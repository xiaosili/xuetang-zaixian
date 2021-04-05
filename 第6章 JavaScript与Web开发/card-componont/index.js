const template = document.createElement("template");

template.innerHTML = `
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
<div class="card">
  <img class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">
      <slot name="header">title to be replaced</slot>
    </h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <slot>More text here</slot>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
<style>
.card {
  margin-bottom: 1rem;
}
</style>
`;

class CardComponont extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(template.content.cloneNode(true));
  }
  connectedCallback() {
    this.shadowRoot.querySelector(".card").style.width = this.getAttribute(
      "width"
    );
    this.shadowRoot
      .querySelector("img")
      .setAttribute("src", this.getAttribute("img"));
  }
}

customElements.define("card-componont", CardComponont);
