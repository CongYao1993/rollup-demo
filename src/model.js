export const user = {
  name: "张三",
  age: 18,
};

export const menu = [
  { id: "1", name: "系统菜单", level: 1 },
  { id: "2", name: "帮助文档", level: 2 },
];

export default {
  version: "1.0.0",
  getVersion: () => {
    return "1.0.0";
  },
  name: "model",
};
