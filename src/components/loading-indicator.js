class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  show() {
    this.classList.add('show');
  }

  hide() {
    this.classList.remove('show');
  }

  render() {
    this.className = 'loading-indicator';
    this.innerHTML = `
      <div class="spinner"></div>
    `;
  }
}

customElements.define('loading-indicator', LoadingIndicator);
