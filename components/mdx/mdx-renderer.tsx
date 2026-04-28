/**
 * MdxContent — Server-side MDX content renderer
 * ================================================
 * Uses next-mdx-remote/rsc for server-side MDX rendering.
 * 
 * Includes a preprocessor that converts complex JSX props (arrays/objects)
 * into base64-encoded JSON data props. This is necessary because
 * next-mdx-remote's MDX compiler can't handle inline array/object literals
 * reliably across the RSC/client boundary.
 * 
 * Flow:
 * 1. preprocessMdx() scans for JSX component tags
 * 2. Converts props like `features={[...]}` to `__data="base64string"`
 * 3. Wrapper components decode the base64 and pass to real components
 */

import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { PricingTable } from "@/components/mdx/pricing-table";
import { ProsConsList } from "@/components/mdx/pros-cons-list";
import { FeatureGrid } from "@/components/mdx/feature-grid";
import { VerdictCard } from "@/components/mdx/verdict-card";
import { AffiliateButton } from "@/components/mdx/affiliate-button";
import { ReviewHero } from "@/components/mdx/review-hero";
import { UsageSection } from "@/components/mdx/usage-section";
import { ReviewVerdict } from "@/components/mdx/review-verdict";

/**
 * Preprocesses MDX source to extract complex JSX props.
 * 
 * Converts components like:
 *   <PricingTable toolA={{ name: "Notion", tiers: [...] }} />
 * Into:
 *   <PricingTable __data="eyJ0b29sQSI6..." />
 */
function preprocessMdx(source: string): string {
  const componentNames = ["PricingTable", "ProsConsList", "FeatureGrid", "VerdictCard", "AffiliateButton", "ReviewHero", "UsageSection", "ReviewVerdict"];
  
  let processed = source;

  // Strip lines that leak scraping internals to the user.
  // Matches standalone paragraphs, blockquotes, and notes that reference scraping.
  const scrapePatterns = [
    /^>?\s*\*?\*?(?:Note:?\s*)?.*(?:scrape[d]?|scraping).*(?:data|pricing|feature|information).*(?:not|unavailable|empty|missing|absent).*$/gmi,
    /^>?\s*\*?\*?(?:Note:?\s*)?.*(?:data|pricing|feature|information).*(?:not|unavailable|empty|missing|absent).*(?:scrape[d]?|scraping).*$/gmi,
    /^>?\s*\*?\*?(?:Note:?\s*)?.*(?:scraped?\s+(?:data|payload|dataset)).*(?:not\s+contain|did\s+not|empty|unavailable).*$/gmi,
    /^>?\s*\*?\*?(?:Note:?\s*)?.*(?:not\s+(?:available|present|captured|found)).*(?:scrape[d]?|scraping).*$/gmi,
    /^>?\s*\*?.*(?:pricing|feature)\s+(?:details?|data)\s+(?:were?|was)\s+not\s+(?:captured|present|available).*(?:scrape[d]?|dataset).*\*?$/gmi,
    /^>?\s*\*?.*(?:scrape[d]?\s+data(?:set)?)\s+did\s+not\s+(?:include|contain|capture).*$/gmi,
  ];
  for (const pattern of scrapePatterns) {
    processed = processed.replace(pattern, '');
  }

  // Also clean up inline scrape references in list items and table cells
  processed = processed.replace(/\s*\(?not\s+(?:captured|listed|present|found)\s+in\s+(?:the\s+)?scrape[d]?\s+data\)?/gi, '');
  processed = processed.replace(/\s*\(?(?:from|in|via)\s+(?:the\s+)?scraped?\s+(?:data|dataset|payload)\)?/gi, '');

  // Remove empty blockquote lines left behind
  processed = processed.replace(/^>\s*$/gm, '');

  // Normalize `< ComponentName` → `<ComponentName` (LLM sometimes adds a space after <)
  for (const name of componentNames) {
    processed = processed.replace(new RegExp(`<\\s+${name}`, 'g'), `<${name}`);
  }

  // Ensure standard void HTML tags are self-closing for JSX (e.g. <br> -> <br />)
  processed = processed.replace(/<(br|hr)\s*>/gi, '<$1 />');

  // Strip JS-style comments inside JSX expression braces: {[] /* comment */} → {[]}
  processed = processed.replace(/\/\*[^*]*\*\//g, '');

  // Escape stray angle brackets that aren't valid HTML or registered MDX components.
  // LLM output often contains patterns like <Webex pricing...>, <10 users, etc.
  const validHtmlTags = new Set([
    "a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote",
    "body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist",
    "dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption",
    "figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr",
    "html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map",
    "mark","menu","meta","meter","nav","noscript","object","ol","optgroup","option","output",
    "p","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select",
    "slot","small","source","span","strong","style","sub","summary","sup","table","tbody","td",
    "template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr",
  ]);
  const validMdxComponents = new Set(componentNames);

  // Escape bare < followed by a digit, optionally with whitespace or special chars in between.
  // Covers: <5 users, < 5 users, <$50/mo, <=5, <+50%, <~5, etc.
  // MDX treats all of these as JSX tag starts and crashes.
  processed = processed.replace(/<\s*(\d)/g, '&lt;$1');
  processed = processed.replace(/<([=$+~#%])/g, '&lt;$1');

  processed = processed.replace(/<(\/?[^\s>!][^>]*?)>/g, (match, inner) => {
    // Extract the tag name (first word, stripping any leading /)
    const tagNameMatch = inner.match(/^\/?\s*([a-zA-Z][a-zA-Z0-9_-]*)/);
    if (tagNameMatch) {
      const tagName = tagNameMatch[1];
      if (validHtmlTags.has(tagName.toLowerCase()) || validMdxComponents.has(tagName)) {
        return match; // keep valid tags
      }
    }
    // Not a valid tag — escape the opening <
    return `&lt;${inner}>`;
  });

  for (const name of componentNames) {
    const selfClosingRegex = new RegExp(
      `<${name}\\s([\\s\\S]*?)\\/>`,
      "g"
    );

    processed = processed.replace(selfClosingRegex, (fullMatch, propsString: string) => {
      try {
        const props = parseJsxProps(propsString.trim());
        if (Object.keys(props).length === 0) return fullMatch;
        
        const encoded = Buffer.from(JSON.stringify(props)).toString("base64");
        return `<${name} __data="${encoded}" />`;
      } catch (e) {
        console.error(`[MDX preprocessor] Failed to parse ${name} props:`, e);
        return fullMatch;
      }
    });
  }

  return processed;
}

/**
 * Converts a JS object/array expression string to valid JSON.
 * 
 * Strategy: Walk through the string character by character,
 * tracking whether we're inside a quoted string or not.
 * Only add quotes around keys when we're NOT inside a string.
 */
function jsExprToJson(expr: string): string {
  let result = "";
  let i = 0;
  const len = expr.length;

  while (i < len) {
    const ch = expr[i];

    // Handle quoted strings — pass through verbatim, but escape control chars for JSON safety
    if (ch === '"') {
      result += '"';
      i++;
      while (i < len && expr[i] !== '"') {
        if (expr[i] === '\\' && i + 1 < len) {
          result += expr[i] + expr[i + 1];
          i += 2;
        } else if (expr[i] === '\n') {
          result += '\\n';
          i++;
        } else if (expr[i] === '\r') {
          result += '\\r';
          i++;
        } else if (expr[i] === '\t') {
          result += '\\t';
          i++;
        } else {
          result += expr[i];
          i++;
        }
      }
      if (i < len) {
        result += '"'; // closing quote
        i++;
      }
      continue;
    }

    // Handle single-quoted strings — convert to double quotes
    if (ch === "'") {
      result += '"';
      i++;
      while (i < len && expr[i] !== "'") {
        if (expr[i] === '\\' && i + 1 < len) {
          result += expr[i] + expr[i + 1];
          i += 2;
        } else if (expr[i] === '"') {
          result += '\\"'; // escape inner double quotes
          i++;
        } else {
          result += expr[i];
          i++;
        }
      }
      if (i < len) {
        result += '"'; // closing quote
        i++;
      }
      continue;
    }

    // Handle unquoted object keys: look for `identifier:` pattern
    // Only match when preceded by { or , (with optional whitespace)
    if (/[a-zA-Z_$]/.test(ch)) {
      // Check if this looks like an unquoted key
      let identifier = "";
      let j = i;
      while (j < len && /[\w$]/.test(expr[j])) {
        identifier += expr[j];
        j++;
      }
      // Skip whitespace after identifier
      let k = j;
      while (k < len && /\s/.test(expr[k])) k++;

      // Check for special values
      if (identifier === "true" || identifier === "false" || identifier === "null") {
        result += identifier;
        i = j;
        continue;
      }

      // If followed by ':', it's a key — add quotes
      if (k < len && expr[k] === ':') {
        result += `"${identifier}"`;
        i = j;
        continue;
      }

      // Otherwise it's a value (like a variable ref) — keep as-is
      result += identifier;
      i = j;
      continue;
    }

    // Handle trailing commas before } or ]
    if (ch === ',') {
      // Look ahead for closing bracket/brace
      let k = i + 1;
      while (k < len && /\s/.test(expr[k])) k++;
      if (k < len && (expr[k] === '}' || expr[k] === ']')) {
        // Skip the trailing comma
        i++;
        continue;
      }
    }

    result += ch;
    i++;
  }

  return result;
}

/**
 * Parses JSX-style props string into a JavaScript object.
 * Handles: string props, object/array props in {}, boolean props.
 */
function parseJsxProps(propsString: string): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  
  let i = 0;
  const len = propsString.length;

  while (i < len) {
    // Skip whitespace
    while (i < len && /\s/.test(propsString[i])) i++;
    if (i >= len) break;

    // Read prop name
    let propName = "";
    while (i < len && propsString[i] !== "=" && !/\s/.test(propsString[i])) {
      propName += propsString[i];
      i++;
    }

    if (!propName) break;

    // Skip whitespace
    while (i < len && /\s/.test(propsString[i])) i++;

    // Check for = sign
    if (i < len && propsString[i] === "=") {
      i++; // skip =
      while (i < len && /\s/.test(propsString[i])) i++;

      if (i >= len) break;

      if (propsString[i] === '"') {
        // String value "..."
        i++;
        let value = "";
        while (i < len && propsString[i] !== '"') {
          if (propsString[i] === "\\" && i + 1 < len) {
            value += propsString[i + 1];
            i += 2;
          } else {
            value += propsString[i];
            i++;
          }
        }
        i++; // skip closing quote
        props[propName] = value;
      } else if (propsString[i] === "{") {
        // JSX expression {...}
        let depth = 0;
        let expr = "";
        while (i < len) {
          if (propsString[i] === "{") depth++;
          else if (propsString[i] === "}") {
            depth--;
            if (depth === 0) {
              i++;
              break;
            }
          }
          expr += propsString[i];
          i++;
        }
        // Remove the outer { we captured
        expr = expr.substring(1);
        
        // Clean up LLM syntax artifacts like [ {{ ... }}, {{ ... }} ]
        expr = expr.replace(/\[\s*\{\s*\{/g, '[{')
                   .replace(/\}\s*\}\s*\]/g, '}]')
                   .replace(/\}\s*\}\s*,\s*\{\s*\{/g, '}, {');
        
        try {
          // Use our safe JS-to-JSON converter
          const jsonified = jsExprToJson(expr);
          props[propName] = JSON.parse(jsonified);
        } catch {
          // Fallback 1: Try direct JSON.parse on raw expression
          try {
            props[propName] = JSON.parse(expr);
          } catch {
            // Fallback 2: Try cleaning common issues (e.g. trailing commas, unescaped chars)
            try {
              const cleaned = expr
                .replace(/,\s*([}\]])/g, '$1')  // remove trailing commas
                .replace(/'/g, '"');             // single to double quotes
              props[propName] = JSON.parse(cleaned);
            } catch {
              // Silent fallback: store as raw string
              props[propName] = expr;
            }
          }
        }
      }
    } else {
      // Boolean prop (no value)
      props[propName] = true;
    }
  }

  return props;
}

/**
 * Wrapper components that decode __data prop and pass to real components.
 */
function createDataWrapper(
  Component: React.ComponentType<any>
) {
  return function DataWrapper(props: any) {
    if (props.__data) {
      try {
        const decoded = JSON.parse(
          Buffer.from(props.__data, "base64").toString("utf-8")
        );
        return <Component {...decoded} />;
      } catch {
        return null;
      }
    }
    return <Component {...props} />;
  };
}

const components = {
  PricingTable: createDataWrapper(PricingTable),
  ProsConsList: createDataWrapper(ProsConsList),
  FeatureGrid: createDataWrapper(FeatureGrid),
  VerdictCard: createDataWrapper(VerdictCard),
  AffiliateButton: createDataWrapper(AffiliateButton),
  ReviewHero: createDataWrapper(ReviewHero),
  UsageSection: createDataWrapper(UsageSection),
  ReviewVerdict: createDataWrapper(ReviewVerdict),
};

interface MdxContentProps {
  source: string;
  toolAName?: string;
  toolBName?: string;
  toolALogo?: string | null;
  toolBLogo?: string | null;
}

export function MdxContent({ source, toolAName, toolBName, toolALogo, toolBLogo }: MdxContentProps) {
  const processed = preprocessMdx(source);

  // Override components to inject dynamic tool names and logos from the page context
  const customComponents = {
    ...components,
    // Pricing table removed — pricing info is shown as text in the MDX content
    PricingTable: () => null,
    ProsConsList: createDataWrapper((props: any) => (
      <ProsConsList {...props} toolAName={toolAName} toolBName={toolBName} toolALogo={toolALogo} toolBLogo={toolBLogo} />
    )),
    FeatureGrid: createDataWrapper((props: any) => (
      <FeatureGrid {...props} toolALogo={toolALogo} toolBLogo={toolBLogo} />
    )),
    VerdictCard: createDataWrapper((props: any) => (
      <VerdictCard {...props} toolAName={toolAName} toolBName={toolBName} toolALogo={toolALogo} toolBLogo={toolBLogo} />
    )),
    ReviewHero: createDataWrapper((props: any) => (
      <ReviewHero {...props} logoUrl={toolALogo} />
    )),
    UsageSection: createDataWrapper(UsageSection),
    ReviewVerdict: createDataWrapper(ReviewVerdict),
    table: (props: any) => (
      <div className="w-full overflow-x-auto my-8 border border-border/50 rounded-xl">
        <table {...props} className="w-full border-collapse min-w-[500px]" />
      </div>
    ),
  };

  return (
    <MDXRemote
      source={processed}
      components={customComponents as any}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
    />
  );
}
