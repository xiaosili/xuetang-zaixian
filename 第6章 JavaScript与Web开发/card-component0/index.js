const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
    <div id="card" class="el-card box-card is-always-shadow"><div class="el-card__header"><div class="clearfix"><span>卡片名称</span> <button type="button" class="el-button el-button--text" style="float: right; padding: 3px 0px;"><!----><!----><span>操作按钮</span></button></div></div><div class="el-card__body"> <div class="text item">
    <slot name="one">defalut 列表内容 1</slot>
    <img>
    </div><div class="text item">
    <slot name="two">defalut 列表内容 2</slot>
    </div><div class="text item">
    <slot name="three">defalut 列表内容 3</slot>
    </div><div class="text item">
    列表内容 4
    </div></div></div>
    <style>
    div{
      color: red
    }
    </style>
    `;

class CardComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(template.content.cloneNode(true));
  }
  connectedCallback() {
    this.shadowRoot.querySelector("#card").style.width = this.getAttribute(
      "width"
    );

    this.shadowRoot
      .querySelector("img")
      .setAttribute("src", this.getAttribute("img"));
  }
}

customElements.define("card-component", CardComponent);
