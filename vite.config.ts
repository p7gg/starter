import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
// import { reactRouterDevTools } from "react-router-devtools";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";

const ReactCompilerConfig = {};

export default defineConfig({
	build: {
		assetsInlineLimit: (filePath) => {
			if (
				filePath.endsWith("sprite.svg") ||
				filePath.endsWith("favicon.svg") ||
				filePath.endsWith("apple-touch-icon.png")
			) {
				return false;
			}
		},
	},
	plugins: [
		tailwindcss(),
		// reactRouterDevTools(),
		reactRouter(),
		babel({
			filter: /\.[jt]sx?$/,
			babelConfig: {
				presets: ["@babel/preset-typescript"],
				plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
			},
		}),
		tsconfigPaths(),
	],
});
