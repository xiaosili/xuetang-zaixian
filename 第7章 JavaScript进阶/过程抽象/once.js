function once(fn) {
  return function (...args) {
    if (fn) {
      const ret = fn.apply(this, args);
      fn = null;
      return ret;
    }
  };
}

// button.addEventListener(
//   "click",
//   once((evt) => {
//     const target = evt.target;
//     target.parentNode.className = "complete";
//     setTimeout(() => {
//       list.removeChild(target.parentNode);
//     }, 2000);
//   })
// );
// function fn1(a, b) {
//   return a + b;
// }
once(() => {
  // setTimeout(() => {
  //   console.log("12---");
  // });
  console.log("6-----------");
});
