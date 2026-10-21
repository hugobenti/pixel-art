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
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
