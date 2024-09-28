# rollup 使用

Rollup 是一个 JavaScript 模块打包工具。

Rollup 的特点：

- 使用 ES6 模块，而不是 CommonJS 或 AMD；
- 支持 tree-shaking；
- 构建速度更快；
- 更轻量，尽量保持代码原有状态，生成的代码量更小，不会像 webpack 一样注入大量 webpack 内部结构；
- 没有官方的 devServer 工具。

## 1. rollup 快速上手

1. 项目初始化

```shell
npm init -y
```

2. 安装 rollup 库，rollup 核心包既包括核心代码也包括 cli 指令工具集，不用单独安装 cli

```shell
npm i rollup -D
```

3. 创建配置文件 rollup.config.js

```javascript
export default {
  input: "src/index.js",
  output: {
    file: "dist/index.js",
  },
};
```

4. 创建入口文件 src/index.js

```javascript
const str = "hello rollup";
console.log(str);
```

5. 在 package.json 中追加构建命令

```json
{
  "scripts": {
    "build": "rollup --config rollup.config.js"
  }
}
```

6. 执行构建命令

```shell
npm run build
```

7. 报错 Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.

```shell
(node:85367) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
(Use `node --trace-warnings ...` to show where the warning was created)
[!] RollupError: Node tried to load your configuration file as CommonJS even though it is likely an ES module. To resolve this, change the extension of your configuration to ".mjs", set "type": "module" in your package.json file or pass the "--bundleConfigAsCjs" flag.

Original error: Unexpected token 'export'
```

解决方案，在 package.json 设置 `"type": "module"`。

## 2. input 和 output 配置

### 2.1 配置多入口

input 可以通过对象配置多入口，output 通过 dir 和 entryFileNames 配置出口名称。

```javascript
export default {
  input: {
    index: "src/index.js",
  },
  output: {
    dir: "dist",
    entryFileNames: "[name].js", // 为每个入口设置名称
  },
};
```

### 2.2 生成多种格式的出口文件

output 通过 format 可以设置构建之后输出的模块语法，最常用的是 umd、esm 或 cjs。

```javascript
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
};
```

## 3. 处理 CommonJS

Rollup 不能识别和处理 CommonJS 模块，打包后的 require 语句仍是 require 语句。

Rollup 通过如下插件支持 CommonJS 模块：

```shell
npm i @rollup/plugin-node-resolve @rollup/plugin-commonjs -D
```

```javascript
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  // ...
  plugins: [resolve(), commonjs()],
};
```

## 4. 集成 babel

默认情况下 rollup 的构建目标为 es6 之后的语法标准，所以为了保证兼容性，可以通过 babel 构建项目。

1. 在项目中安装如下依赖：

```shell
npm i @rollup/plugin-babel @babel/core @babel/preset-env -D
npm i core-js -s
```

2. 编写 babel 配置文件

.babelrc

```json
{
  "presets": [
    [
      // 加载 preset-env
      "@babel/preset-env",
      {
        // 开启按需 polyfill
        "useBuiltIns": "usage",
        // 使用 core-js3.x 版本进行确实对象的补全
        "corejs": 3
      }
    ]
  ]
}
```

.browserslistrc

以下的例子配置了较大的兼容范围。

```
> 0.1%
last 10 versions
```

3. 引入 babel 插件

```javascript
import babel from "@rollup/plugin-babel";

export default {
  // ...
  plugins: [
    // ...
    babel(),
  ],
};
```

4. 在代码中使用 es6 语法

```javascript
// src/index.js
Promise.resolve(menu).then((res) => {
  console.log(res);
});
```

执行构建命令后，发现生成的代码中所有的 ES6 以后的标准语法统一被自动转化为 ES5 的兼容写法，这样便可以兼容较早的 Node 已经 Browser 环境了。

## 5. 支持网页调试

Rollup 本身并不支持 devServer，不过可以为入口文件追加 html 模版页面用于生成的 js 调试。

### 5.1 @rollup/plugin-html

```shell
npm i @rollup/plugin-html -D
```

```javascript
import html from "@rollup/plugin-html";

export default {
  // ...
  plugins: [
    // ...
    html(),
  ],
};
```

`@rollup/plugin-html` 默认生成的模版如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Rollup Bundle</title>
  </head>
  <body>
    <script src="index.cjs.js" type="module"></script>
  </body>
</html>
```

该插件无法自定义模版。

### 5.2 自定义 html 模版

实现自定义网页内容，自定义 script 标签的生成规则。

1. 创建 public/index.html 文件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    Hello Rollup
  </body>
</html>
```

2. 由于解析 html 文件需要 ast 支持，引入 gogocode

```shell
npm i gogocode -D
```

3. 修改配置文件

```javascript
import $ from "gogocode";
import fs from "fs";

export default {
  // ...
  plugins: [
    // ...
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
```

生成的 index.html 文件内容如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rollup Bundle</title>
  </head>
  <body>
    Hello Rollup
    <script src="index.umd.js"></script>
  </body>
</html>
```
