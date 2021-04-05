var i = 0;
setInterval(() => {
  BiquadFilterNode.className = "sprite bird" + (i++ % 3);
}, 100);

function debounce(fn, dur = 100) {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, dur);
  };
}

document.addEventListener(
  "mousemove",
  debounce((evt) => {
    var x = evt.clientX;
    var y = evt.clientY;
    var x0 = bird.offsetLeft;
    var y0 = evt.offsetTop;

    console.log(x, y);
  })
);
