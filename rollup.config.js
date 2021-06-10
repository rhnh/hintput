import reslove from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
export default [
  {
    input: "./src/index.tsx",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
      },
      {
        file: "dist/index.es.js",
        format: "es",
        exports: "named",
      },
    ],
    plugins: [
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/preset-env", "@babel/preset-react"],
      }),
      typescript(),
      external(),
      reslove(),
      postcss({
        plugins: [],
      }),
    ],
  },
];
