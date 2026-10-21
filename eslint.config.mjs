import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

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

const CLASS_STRING_MESSAGE = "Class strings belong in the component's .style.ts file, not in .tsx.";
const classStringRules = [
  "JSXAttribute[name.name='className'] > Literal",
  "JSXAttribute[name.name='className'] > JSXExpressionContainer > Literal",
  "JSXAttribute[name.name='className'] > JSXExpressionContainer > TemplateLiteral",
  "Property[key.name='className'] > Literal",
  "Property[key.name='className'] > TemplateLiteral",
  "JSXAttribute[name.name='className'] CallExpression > Literal",
  "JSXAttribute[name.name='className'] LogicalExpression > Literal",
  "JSXAttribute[name.name='className'] ConditionalExpression > Literal",
].map((selector) => ({ selector, message: CLASS_STRING_MESSAGE }));

const BEHAVIOR_MESSAGE =
  "Components are presentation: move effects and browser APIs into a useX.ts hook next to the component.";
const presentationRules = [
  "ImportSpecifier[imported.name=/^use(Layout|Insertion)?Effect$/]",
  "MemberExpression[object.name=/^(window|document|navigator|history|location)$/]",
  "NewExpression[callee.name=/^(IntersectionObserver|ResizeObserver|MutationObserver)$/]",
  "CallExpression[callee.name=/^(setTimeout|setInterval|requestAnimationFrame)$/]",
].map((selector) => ({ selector, message: BEHAVIOR_MESSAGE }));

const LOGIC_MESSAGE =
  "Components are presentation: derive values in a useX.ts hook or a .ts module, not in .tsx.";
const logicRules = [
  // Helper functions, at module level or inside a component.
  "Program > FunctionDeclaration[id.name=/^[a-z]/]",
  "Program > ExportNamedDeclaration > FunctionDeclaration[id.name=/^[a-z]/]",
  "FunctionDeclaration FunctionDeclaration",
  "VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)",
  // Computation and formatting.
  "BinaryExpression[operator=/^[-+*\\/%]$/]",
  "ConditionalExpression > ConditionalExpression",
  "TemplateLiteral[expressions.length>0]",
  "NewExpression[callee.name=/^(Date|URL|Map|Set)$/]",
  "CallExpression[callee.property.name=/^(filter|reduce|sort|find|findIndex|some|every|flatMap|slice|splice|join|split|replace|replaceAll|toFixed|toLocaleString)$/]",
  // Plain function calls in markup; only the class helper is allowed.
  "JSXExpressionContainer > CallExpression[callee.type='Identifier']:not([callee.name='cx'])",
].map((selector) => ({ selector, message: LOGIC_MESSAGE }));

const DATA_MESSAGE =
  "Data a component renders belongs in an X.data.ts module (or src/content), not in .tsx.";
const dataRules = [
  "Program > VariableDeclaration > VariableDeclarator > :matches(ArrayExpression, ObjectExpression, Literal, TemplateLiteral, CallExpression)",
  "Program > ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > :matches(ArrayExpression, ObjectExpression, Literal, TemplateLiteral, CallExpression)",
  "MemberExpression > ArrayExpression.object",
].map((selector) => ({ selector, message: DATA_MESSAGE }));

const STYLE_COMPOSE_MESSAGE =
  "Compose classes with cx() in .style.ts: no .join() or template literals, so there's one way to do it and Tailwind sees every class literally.";
const styleComposeRules = [
  "CallExpression[callee.property.name='join']",
  "TemplateLiteral[expressions.length>0]",
].map((selector) => ({ selector, message: STYLE_COMPOSE_MESSAGE }));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
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
  {
    // Architecture rule (AGENTS.md "Component architecture"): a .tsx component is presentation.
    // Classes come from X.style.ts, data from X.data.ts / src/content, derived values and behavior
    // (effects, browser APIs, observers, formatting, computation) from a useX.ts hook.
    files: ["**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...classStringRules,
        ...presentationRules,
        ...logicRules,
        ...dataRules,
      ],
    },
  },
  {
    // Style files hold class strings composed with cx() (AGENTS.md "Styling architecture").
    files: ["**/*.style.ts"],
    rules: {
      "no-restricted-syntax": ["error", ...styleComposeRules],
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
