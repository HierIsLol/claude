import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Use the headless shell from Playwright cache
const BROWSER_EXECUTABLE = "/root/.cache/ms-playwright/chromium_headless_shell-1194/chrome-linux/headless_shell";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const outDir = path.join(__dirname, "out");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const entryPoint = path.join(__dirname, "src", "index.tsx");
const outputLocation = path.join(outDir, "adpal_promo.mp4");

console.log("📦 Bundling...");
const bundleLocation = await bundle({
  entryPoint,
  webpackOverride: (config) => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...(config.module?.rules ?? []),
          {
            test: /\.(tsx|ts|jsx|js)$/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", { targets: { node: "current" } }],
                  ["@babel/preset-react", { runtime: "automatic" }],
                  "@babel/preset-typescript",
                ],
              },
            },
            exclude: /node_modules/,
          },
        ],
      },
    };
  },
});

console.log("🎬 Selecting composition...");
const composition = await selectComposition({
  serveUrl: bundleLocation,
  id: "AdpalPromo",
  browserExecutable: BROWSER_EXECUTABLE,
});

console.log(`🚀 Rendering ${composition.durationInFrames} frames at ${composition.fps}fps...`);
await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: "h264",
  outputLocation,
  browserExecutable: BROWSER_EXECUTABLE,
  onProgress: ({ renderedFrames, totalFrames, progress }) => {
    process.stdout.write(`\r   Frame ${renderedFrames}/${totalFrames} (${Math.round(progress * 100)}%)`);
  },
});

console.log(`\n\n✅ Rendered: ${outputLocation}`);
