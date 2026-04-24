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
import { PricingTable } from "@/components/mdx/pricing-table";
import { ProsConsList } from "@/components/mdx/pros-cons-list";
import { FeatureGrid } from "@/components/mdx/feature-grid";
import { VerdictCard } from "@/components/mdx/verdict-card";
import { AffiliateButton } from "@/components/mdx/affiliate-button";

/**
 * Preprocesses MDX source to extract complex JSX props.
 * 
 * Converts components like:
 *   <PricingTable toolA={{ name: "Notion", tiers: [...] }} />
 * Into:
 *   <PricingTable __data="eyJ0b29sQSI6..." />
 */
function preprocessMdx(source: string): string {
  const componentNames = ["PricingTable", "ProsConsList", "FeatureGrid", "VerdictCard", "AffiliateButton"];
  
  let processed = source;

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

    // Handle quoted strings — pass through verbatim
    if (ch === '"') {
      result += '"';
      i++;
      while (i < len && expr[i] !== '"') {
        if (expr[i] === '\\' && i + 1 < len) {
          result += expr[i] + expr[i + 1];
          i += 2;
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
        
        try {
          // Use our safe JS-to-JSON converter
          const jsonified = jsExprToJson(expr);
          props[propName] = JSON.parse(jsonified);
        } catch (e) {
          console.error(`[MDX preprocessor] Failed to parse prop "${propName}":`, e, "\nExpression:", expr.substring(0, 200));
          // Store as raw string fallback
          props[propName] = expr;
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
};

interface MdxContentProps {
  source: string;
  toolAName?: string;
  toolBName?: string;
}

export function MdxContent({ source, toolAName, toolBName }: MdxContentProps) {
  const processed = preprocessMdx(source);

  // Override VerdictCard to inject dynamic tool names from the page context
  const customComponents = {
    ...components,
    VerdictCard: createDataWrapper((props: any) => (
      <VerdictCard {...props} toolAName={toolAName} toolBName={toolBName} />
    )),
  };

  return (
    <MDXRemote
      source={processed}
      components={customComponents as any}
    />
  );
}
