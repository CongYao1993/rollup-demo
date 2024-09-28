import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import html from "@rollup/plugin-html";
import $ from "gogocode";
import fs from "fs";

export default {
  input: {
    index: "src/index.js",
  },
  output: [
    {
      dir: "dist",
      entryFileNames: "[name].esm.js",
      format: "esm", // 使用 ecma 模块语法
    },
    {
      dir: "dist",
      entryFileNames: "[name].cjs.js",
      format: "cjs", //  使用 commonJS 模块语法
    },
    {
      dir: "dist",
      entryFileNames: "[name].umd.js",
      format: "umd", // 使用 umd 模块系统导出
      name: "index", // 在构建 umd 模块时需要对模块命名
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel(),
    html({
      fileName: "index.html", // 设置生成的文件名
      template(options) {
        let template = fs.readFileSync("./public/index.html").toString(); // 读取 template 文件
        // 通过 ast 在 body 后追加 umd 模式的依赖
        let ast = $(template, { parseOptions: { language: "html" } })
          .replace(`<body>$_$</body>`, `<body>$_$<script src="index.umd.js"></script></body>`)
          .replace(`<title></title>`, `<title>${options.title}</title>`);
        return ast.generate();
      },
    }),
  ],
};
