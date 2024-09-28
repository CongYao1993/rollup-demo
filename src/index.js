// const str = "hello rollup";
// console.log(str);

import { menu } from "./model";
// const menu = require('./model')
menu.forEach((item) => {
  console.log(item);
});
Promise.resolve(menu).then((res) => {
  console.log(res);
});
