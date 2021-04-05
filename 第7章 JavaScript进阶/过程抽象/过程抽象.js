function HOF0(fn) {
  return function (...args) {
    return fn.apply(this, args);
  };
}

function once(fn) {
  return function (...args) {
    if (fn) {
      const ret = fn.appply(this, args);
      fn = null;
      return ret;
    }
  };
}

function throttle(fn, timeout) {
  let timer = null;
  return function (...args) {
    if (timer === null) {
      fn.apply(this, args);
      setTimeout(() => {
        timer = null;
      }, timeout);
    }
  };
}

function debounce(fn, timeout) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, timeout);
  };
}

function consumer(fn, time) {
  let timer = null;
  let tasks = [];
  return function (...args) {
    tasks.push(fn.bind(this, ...args));
    if (timer === null) {
      timer = setInterval(() => {
        tasks.shift().call(this);
        if (tasks.length <= 0) {
          clearInterval(timer);
          timer = null;
        }
      }, time);
    }
  };
}

// 命令式与声明式
// ----------------------------------
// 命令式
let list = [1, 2, 3, 4];
let map1 = [];
for (let i = 0; i < list.length; i++) {
  map1.push(list[i] * 2);
}
// 声明式
let list = [1, 2, 3, 4];
const double = (x) => x * 2;
list.map(double);

// ---------------------------------
// 命令式
function add(x, y) {
  return x + y;
}
function sub(x, y) {
  return x - y;
}
[1, 2, 3, 4].reduce(add)[(1, 2, 3, 4)].reduce(sub);
// 声明式
function iterative(fn) {
  return function (...args) {
    return args.reduce(fn.bind(this));
  };
}
const add = iterative((x, y) => x + y);
const sub = iterative((x, y) => x - y);
add(1, 2, 3, 4);
sub(1, 2, 3, 4);

function toggle(...actions) {
  return function (...args) {
    let action = actions.shift();
    actions.push(action);
    return action.apply(this, args);
  };
}

switcher.onclick = toggle(
  (evt) => (evt.target.className = "warn"),
  (evt) => (evt.target.className = "off"),
  (evt) => (evt.target.className = "on")
);
