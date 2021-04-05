// 常量
window.CONST = {
  DEFAULT_IMG: "default.jpg",
};

// 页面加载时，设置可以拖拽图片开始，或者默认开始
window.addEventListener("DOMContentLoaded", () => {
  setDropImg2Start();
  setStartWithDefault();

  // 是否有保存到拼图进度
  regain();
});

// 拖入图片并开始游戏
function setDropImg2Start() {
  const $panel = document.getElementsByClassName("panel")[0];

  // 只有同时绑定 dragover 和 drop 事件的元素，指定元素才会是可以释放的元素
  // 必须阻止默认行为，否则 drop 无法生效
  $panel.addEventListener("dragover", (e) => e.preventDefault());

  $panel.addEventListener("drop", async (e) => {
    e.preventDefault();
    this.className = "panel";

    const files = e.dataTransfer.files;
    if (!files.length) {
      return;
    }

    const curFile = files[0];
    if (curFile.type.indexOf("image") === -1) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(curFile);
    reader.onload = function (evt) {
      const url = evt.target.result;
      init(url);
    };
  });
}

// 默认拼图
function setStartWithDefault() {
  const $startWithDefault = document.getElementsByClassName(
    "start-with-default"
  )[0];
  $startWithDefault.addEventListener("click", () => {
    init();
  });
}

// 初始化左侧碎片区域 & 右侧合成区域
async function init(
  imgSrc = CONST.DEFAULT_IMG,
  slices = [3, 4] // 3行 4列
) {
  clear();

  localStorage.setItem("imgUrl", imgSrc);

  const image = new Image();
  image.src = imgSrc;

  image.onload = () => {
    // 计算碎片尺寸 和 面板尺寸
    const pieceWidth = 150;
    const pieceHeight =
      (image.height / slices[0] / (image.width / slices[1])) * pieceWidth;
    const panelWidth = pieceWidth * slices[1];
    const panelHeight = pieceHeight * slices[0];

    // 创建碎片和面板区域
    const pieces = [];
    const panelPieces = [];
    const matchedPieces =
      JSON.parse(localStorage.getItem("matchedPieces")) || [];
    for (let i = 0; i < slices[0]; i++) {
      for (let j = 0; j < slices[1]; j++) {
        const pos = `${j}-${i}`;
        // 左侧碎片
        const $piece = document.createElement("div");
        $piece.className = "piece";
        $piece.dataset.pos = pos;
        $piece.style.width = pieceWidth + "px";
        $piece.style.height = pieceHeight + "px";
        $piece.style.backgroundImage = `url(${imgSrc})`;
        $piece.style.backgroundSize = `${pieceWidth * slices[1]}px ${
          pieceHeight * slices[0]
        }px`;
        $piece.style.backgroundPosition = `${panelWidth - pieceWidth * j}px ${
          panelHeight - pieceHeight * i
        }px`;
        if (!matchedPieces.includes(pos)) {
          pieces.push($piece);
        }

        // 复制出面板碎片
        const $panelPiece = $piece.cloneNode();
        if (matchedPieces.includes(pos)) {
          $panelPiece.className = "piece matched";
        }
        panelPieces.push($panelPiece);

        // 最后将碎片设置为可推拽的
        $piece.draggable = true;
      }
    }

    // 左侧区域插入碎片
    const $pieces = document.getElementsByClassName("pieces")[0];
    shuffle(pieces).forEach((piece) => $pieces.append(piece));

    // 右侧区域插入碎片占位
    const $panel = document.getElementsByClassName("panel")[0];
    $panel.style.width = `${panelWidth}px`;
    $panel.style.height = `${panelHeight}px`;
    $panel.className = "panel";

    // 自动缩放面板区域
    const $main = document.getElementsByTagName("main")[0];
    const {
      width: mainWidth,
      height: mainHeight,
    } = $main.getBoundingClientRect();
    const scaleRatio = Math.min(
      (mainWidth - 100) / panelWidth,
      (mainHeight - 100) / panelHeight
    );
    $panel.style.transform = `scale(${scaleRatio})`;

    panelPieces.forEach((piece) => $panel.append(piece));

    bindPieceEvents();
  };
}

// 清空面板及碎片
function clear() {
  const $pieces = document.getElementsByClassName("piece");
  Array.from($pieces).forEach(($piece) => $piece.remove());
}

// 绑定碎片相关事件
function bindPieceEvents() {
  const $pieces = Array.from(document.querySelectorAll("aside .piece"));
  $pieces.forEach((piece) => {
    piece.addEventListener("dragstart", onDragstart);
    piece.addEventListener("dragend", onDragend);
  });

  const $panelPieces = Array.from(document.querySelectorAll(".panel .piece"));
  $panelPieces.forEach((piece) => {
    piece.addEventListener("dragenter", onDragenter);
    piece.addEventListener("dragleave", onDragleave);
    piece.addEventListener("dragover", onDragover);
    piece.addEventListener("drop", onDrop);
  });
}

// dataTransfer
// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#dragdata
function onDragstart(e) {
  this.className += " draging";
  e.dataTransfer.setData("text/plain", this.dataset.pos);
  e.dataTransfer.setData("drag/piece", "");
}

// 拖动结束 dataTransfer 自动清空
function onDragend(e) {
  this.className = "piece";
}

function onDragenter(e) {
  e.preventDefault();
  if (
    this.className.includes("matched") ||
    !e.dataTransfer.types.includes("drag/piece")
  ) {
    return;
  }
  this.className += " dragenter";
}

function onDragleave(e) {
  if (
    this.className.includes("matched") ||
    !e.dataTransfer.types.includes("drag/piece")
  ) {
    return;
  }
  this.className = "piece";
}

function onDragover(e) {
  e.preventDefault();
}

function onDrop(e) {
  e.preventDefault();
  if (
    this.className.includes("matched") ||
    !e.dataTransfer.types.includes("drag/piece")
  ) {
    return;
  }

  const pos = e.dataTransfer.getData("text/plain");
  const selfPos = this.dataset.pos;
  if (pos === selfPos) {
    this.className = "piece matched";
    const targetPiece = document.querySelectorAll(
      `aside .piece[data-pos="${pos}"]`
    )[0];
    targetPiece.parentNode.removeChild(targetPiece);
    saveMatchedPiece(pos);

    const restPieces = document.querySelectorAll("aside .piece");
    if (!restPieces.length) {
      document.getElementsByTagName("body")[0].className = "completed";
      localStorage.clear();
    }
  } else {
    this.className = "piece";
  }
}

// 本地保存进度;
function saveMatchedPiece(pos) {
  const matchedPieces = JSON.parse(localStorage.getItem("matchedPieces")) || [];
  matchedPieces.push(pos);
  localStorage.setItem("matchedPieces", JSON.stringify(matchedPieces));
}

function regain() {
  const url = localStorage.getItem("imgUrl");
  if (url) {
    init(url);
  } else {
    localStorage.clear();
  }
}

// 伪随机洗牌
function shuffle(arr) {
  for (let i = 0, len = arr.length; i < len; i++) {
    const random = Math.floor(Math.random() * len);
    [arr[i], arr[random]] = [arr[random], arr[i]];
  }
  return arr;
}
