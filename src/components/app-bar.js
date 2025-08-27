class AppBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <header class="app-bar">
        <div class="app-bar-content">
          <h1>Notes App ARiMa</h1>
        </div>
      </header>
    `;
  }
}

customElements.define('app-bar', AppBar);
