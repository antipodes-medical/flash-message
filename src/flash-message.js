/**
 * <flash-message message="…" time="5000" progressbar="true"> : bandeau de confirmation
 * (commentaire envoyé, formulaire de contact envoyé).
 *
 * Remplace kami-flash (~450 Ko pour ce seul bandeau) avec les mêmes attributs et le
 * même rendu : bandeau vert centré en bas, entrée par le bas, bouton de fermeture,
 * barre de progression, fermeture automatique après `time` ms.
 *
 * Shadow DOM : le style voyage avec le composant, quel que soit le CSS de la page.
 * Personnalisable depuis le CSS du site (variables héritées dans le shadow DOM) :
 *   --flash-message-offset      distance au bas de l'écran (55px)
 *   --flash-message-background  fond (#00bf9a)
 *   --flash-message-color       texte et icônes (#fff)
 *   --flash-message-progress    barre de progression (#008e72)
 *   --font-family-sans          police (sans-serif)
 */

const STYLE = `
  .flash {
    position: fixed;
    bottom: var(--flash-message-offset, 55px);
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
    max-width: calc(100% - 32px);
    margin: 0 auto;
    padding: 10px;
    overflow: hidden;
    border-radius: 0.2857rem;
    background: var(--flash-message-background, #00bf9a);
    color: var(--flash-message-color, #fff);
    font-family: var(--font-family-sans, sans-serif);
    box-shadow: 0 10px 30px rgb(0 0 0 / 15%);
    animation: flash-enter 0.5s ease;
  }

  .flash.is-leaving {
    animation: flash-leave 0.5s ease forwards;
  }

  .flash svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  .close {
    all: unset;
    display: flex;
    cursor: pointer;
  }

  .close:focus-visible {
    outline: 2px solid currentcolor;
    outline-offset: 2px;
  }

  .bar {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 3px;
    background: var(--flash-message-progress, #008e72);
    transform-origin: left;
    animation: flash-progress linear forwards;
  }

  @keyframes flash-enter {
    from { opacity: 0; transform: translateY(20px); }
  }

  @keyframes flash-leave {
    to { opacity: 0; transform: translateY(30px); }
  }

  @keyframes flash-progress {
    to { transform: scaleX(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .flash, .flash.is-leaving { animation-duration: 1ms; }
  }
`;

const ICON_OK = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9Z"/></svg>`;
const ICON_CLOSE = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"/></svg>`;

export default class FlashMessage extends HTMLElement {
  // Attributs lus à l'insertion, pas dans le constructeur : un élément créé en JS
  // (document.createElement) reçoit ses attributs après sa construction.
  connectedCallback() {
    if (this.shadowRoot) {
      return;
    }

    const time = Number(this.getAttribute('time')) || 0;
    const withBar = time > 0 && this.hasAttribute('progressbar');

    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>${STYLE}</style>
      <div class="flash" role="status">
        ${ICON_OK}
        <span class="text"></span>
        <button class="close" type="button" aria-label="Fermer">${ICON_CLOSE}</button>
        ${withBar ? `<span class="bar" style="animation-duration: ${time}ms"></span>` : ''}
      </div>
    `;
    // textContent : le message est du texte, jamais du HTML.
    this.shadowRoot.querySelector('.text').textContent = this.getAttribute('message') || '';
    this.shadowRoot.querySelector('.close').addEventListener('click', () => this.close());

    if (time > 0) {
      this.timer = setTimeout(() => this.close(), time);
    }
  }

  close() {
    clearTimeout(this.timer);
    const flash = this.shadowRoot?.querySelector('.flash');
    if (!flash || flash.classList.contains('is-leaving')) {
      return;
    }
    // animationend remonte aussi depuis la barre : on attend la sortie du bandeau lui-même.
    flash.addEventListener('animationend', (event) => event.animationName === 'flash-leave' && this.remove());
    flash.classList.add('is-leaving');
  }
}

if (!customElements.get('flash-message')) {
  customElements.define('flash-message', FlashMessage);
}
