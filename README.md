# rollup 使用

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
