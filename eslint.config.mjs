import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

// Feature boundary: dependencies flow shared → editor / gallery → app.
// Each layer is blocked by its `@/` alias and by any relative `../` path that climbs into it.
const layerImports = (layer, aliasPath, message) => ({
  group: [aliasPath, `${aliasPath}/**`, `../**/${layer}`, `../**/${layer}/**`],
  message,
});

const appImports = layerImports(
  "app",
  "@/app",
  "Features must not import src/app; routes depend on features, never the reverse."
);
const editorImports = (from) =>
  layerImports(
    "editor",
    "@/features/editor",
    `${from} must not import the editor feature; move what both need to src/features/shared.`
  );
const galleryImports = (from) =>
  layerImports(
    "gallery",
    "@/features/gallery",
    `${from} must not import the gallery feature; move what both need to src/features/shared.`
  );

const featureFiles = (feature) => [`src/features/${feature}/**/*.{ts,tsx,mts,mjs}`];

/**
 * Token-only styling (AGENTS.md): UI colors come from the semantic tokens in src/app/globals.css.
 * The default palette is removed there, so a raw class like `bg-zinc-200` would silently render
 * nothing; this rule makes it (and arbitrary/literal colors) a lint error instead. Hex strings in
 * the canonical artwork-palette form `#RRGGBB` (uppercase, what artworks store) are pixel data,
 * not styling, and stay allowed. A local plugin rather than `no-restricted-syntax` so it never
 * overrides other `no-restricted-syntax` blocks.
 */
const RAW_PALETTE_CLASS =
  /(?:^|[\s:])(?:bg|text|border(?:-[xytrblse])?|divide|outline|ring(?:-offset)?|fill|stroke|from|via|to|placeholder|caret|accent|decoration|shadow|inset-shadow|drop-shadow)-(?:white|black|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|mist|mauve|olive|taupe)-(?:50|[1-9]00|950))(?:\/\d+)?(?=$|\s)/;
const RAW_COLOR =
  /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\(/i;
const ARTWORK_PALETTE_HEX = /^#[0-9A-F]{6}$/;

const designTokensPlugin = {
  rules: {
    "no-raw-color": {
      meta: {
        type: "problem",
        messages: {
          paletteClass:
            'Raw palette class "{{match}}": use a semantic token utility from src/app/globals.css (bg-surface, text-muted, border-line…).',
          rawColor:
            'Raw color "{{match}}": declare a token in src/app/globals.css and use its utility, or read its CSS variable in canvas code.',
        },
        schema: [],
      },
      create(context) {
        function check(node, text) {
          const palette = RAW_PALETTE_CLASS.exec(text);
          if (palette) {
            context.report({ node, messageId: "paletteClass", data: { match: palette[0].replace(/^[\s:]/, "") } });
            return;
          }
          const color = ARTWORK_PALETTE_HEX.test(text) ? null : RAW_COLOR.exec(text);
          if (color) {
            context.report({ node, messageId: "rawColor", data: { match: color[0] } });
          }
        }
        return {
          Literal(node) {
            if (typeof node.value === "string") check(node, node.value);
          },
          TemplateElement(node) {
            check(node, node.value.cooked ?? node.value.raw);
          },
        };
      },
    },
  },
};

const COPY_MESSAGE =
  "UI copy lives in src/content (AGENTS.md \"Copy\"): import the text from there instead of writing it here.";

// Attributes whose value people read or hear: tooltips, accessible names, alt text, field labels.
const COPY_ATTRIBUTE = "JSXAttribute[name.name=/^(aria-label|title|alt|placeholder|label|hint|.*Label)$/]";
const NON_EMPTY_STRING = "Literal[value=/\\S/]";

// Text in markup: JSX text, string children, and string attributes people read.
const copyRules = [
  "JSXText[value=/\\S/]",
  `:matches(JSXElement, JSXFragment) > JSXExpressionContainer > ${NON_EMPTY_STRING}`,
  ":matches(JSXElement, JSXFragment) > JSXExpressionContainer > TemplateLiteral",
  `:matches(JSXElement, JSXFragment) > JSXExpressionContainer > :matches(ConditionalExpression, LogicalExpression) > ${NON_EMPTY_STRING}`,
  `${COPY_ATTRIBUTE} > ${NON_EMPTY_STRING}`,
  `${COPY_ATTRIBUTE} > JSXExpressionContainer > ${NON_EMPTY_STRING}`,
  `${COPY_ATTRIBUTE} > JSXExpressionContainer > TemplateLiteral`,
  `${COPY_ATTRIBUTE} > JSXExpressionContainer > :matches(ConditionalExpression, LogicalExpression) > ${NON_EMPTY_STRING}`,
  `AssignmentPattern[left.name=/Label$/] > ${NON_EMPTY_STRING}`,
].map((selector) => ({ selector, message: COPY_MESSAGE }));

// Messages that reach people from any module: thrown errors and their fallbacks (shown in toasts),
// toast messages, confirm dialogs, page metadata, and default artwork/layer names.
const copyMessageRules = [
  "NewExpression[callee.name='Error'] > :matches(Literal, TemplateLiteral)",
  "ConditionalExpression[test.right.name='Error'] > :matches(Literal, TemplateLiteral)",
  "Property[key.name=/^(message|title|description|name)$/] > :matches(Literal, TemplateLiteral)",
  "Property[key.name=/^(title|name)$/] > LogicalExpression > :matches(Literal, TemplateLiteral)",
  "CallExpression[callee.property.name='confirm'] > :matches(Literal, TemplateLiteral)",
].map((selector) => ({ selector, message: COPY_MESSAGE }));

// Types rule (AGENTS.md): every interface/type lives in an X.type.ts file next to its user; tests may
// keep local types. Merged into the same no-restricted-syntax arrays as the copy rules: in flat config
// a second no-restricted-syntax block for the same files would silently replace the first.
const TYPE_FILE_MESSAGE =
  "Types live in an X.type.ts file next to the file that uses them (AGENTS.md); tests may keep local types.";
const typeFileRules = ["TSInterfaceDeclaration", "TSTypeAliasDeclaration"].map((selector) => ({
  selector,
  message: TYPE_FILE_MESSAGE,
}));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // Interfaces are IName, type aliases TName (AGENTS.md); the rest of the name is PascalCase.
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "interface", format: ["PascalCase"], prefix: ["I"] },
        { selector: "typeAlias", format: ["PascalCase"], prefix: ["T"] },
      ],
    },
  },
  {
    files: featureFiles("shared"),
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [appImports, editorImports("shared"), galleryImports("shared")] },
      ],
    },
  },
  {
    files: featureFiles("editor"),
    rules: {
      "no-restricted-imports": ["error", { patterns: [appImports, galleryImports("editor")] }],
    },
  },
  {
    files: featureFiles("gallery"),
    rules: {
      "no-restricted-imports": ["error", { patterns: [appImports, editorImports("gallery")] }],
    },
  },
  // Accessibility: next registers the jsx-a11y plugin but enables only a handful of its rules.
  {
    files: ["src/**/*.tsx"],
    rules: {
      ...jsxA11y.flatConfigs.strict.rules,
      // The canvas viewport is role="application" and keyboard-operable (arrow keys pan).
      "jsx-a11y/no-noninteractive-tabindex": [
        "error",
        { tags: [], roles: ["tabpanel", "application"], allowExpressionValues: true },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/**/*.test.ts"],
    plugins: { "design-tokens": designTokensPlugin },
    rules: { "design-tokens/no-raw-color": "error" },
  },
  {
    files: ["src/**/*.tsx"],
    ignores: ["src/**/*.test.tsx"],
    rules: {
      "no-restricted-syntax": ["error", ...copyRules, ...copyMessageRules, ...typeFileRules],
    },
  },
  {
    files: ["src/**/*.ts"],
    ignores: ["src/content/**", "src/**/*.test.ts", "src/**/*.type.ts"],
    rules: {
      "no-restricted-syntax": ["error", ...copyMessageRules, ...typeFileRules],
    },
  },
  {
    files: ["src/content/**/*.ts"],
    ignores: ["src/content/**/*.type.ts", "src/content/**/*.test.ts"],
    rules: {
      "no-restricted-syntax": ["error", ...typeFileRules],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-verify/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
