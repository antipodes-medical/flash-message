import '@polymer/iron-icons/iron-icons.js';
import ProgressBar from 'progressbar.js';

class FlashMessage extends HTMLElement {

	constructor() {
		super();

		this.inner = this.innerHTML;
		this.innerHTML = '';
	}

	connectedCallback() {
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = `
      ${this._styles()}
      ${this._html()}
    `;
		this._close(this.shadowRoot);
		this._progressBar(this.shadowRoot);
	}

	/**
   * Back to top styles.
   *
   * @private
   */
	_styles() {
		return `
      <style>
        

      .flash-message{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.5s ease;
        z-index: 100;
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
    }

    .flash-message__message{
        padding: 10px;
        border-radius: .2857rem;
        align-items: center;
        justify-content: space-around;
        display: flex;
        overflow: hidden;
    }

    .flash-message__text{
        padding-right: 10px;
        padding-left: 10px;
        font-family: sans-serif;
    }

    .flash-message__message--ERROR{
        background-color: #fd77a4;
        color: white;
    }

    .flash-message__message--OK{
        background-color: #00bf9a;
        color: white;
    }

    .flash-message__message--WARNING{
        background-color: #ff9f89;
        color: white;
    }

    .flash-message__message--INFO{
        background-color: #419ef9;
        color: white;
    }

    .flash-message__close{
        cursor: pointer;
        opacity: 0;
    }

    .flash-message__close:hover{
        transition : all 0.5s ease;
    }

    progressbar{
        position: absolute;
        bottom: -5px;
    }

      </style>
    `;
	}

	/**
   * Get message.
   *
   * @returns {string}
   */
	get message() {
		return this.getAttribute('message');
	}

	/**
   * Get type.
   *
   * @returns {string}
   */
	get type() {
		return this.getAttribute('type');
	}

	/**
   * Get type.
   *
   * @returns {string}
   */
	get time() {
		return this.getAttribute('time');
	}

	/**
   * Flash message element.
   *
   * @private
   */
	_html() {
		return `
      <div class="flash-message">
            <div class="flash-message__message flash-message__message--${this.type}">
                <iron-icon icon="check"></iron-icon>
                <div class="flash-message__text">${this.message}</div>
                <iron-icon class="flash-message__close" id="close" icon="close" style="opacity: 1;"></iron-icon>
            </div>
            <progressbar></progressbar>
        </div>
    `;
	}

	/**
   * Close flash message.
   *
   * @private
   */
	_close($element) {
		const closeButton = $element.querySelector('.flash-message__close');
		const flashMessage = $element.querySelector('.flash-message');

		closeButton.addEventListener('click', () => {
			flashMessage.style.opacity = 0;
		});

		function addStylesAfterDelay() {
			flashMessage.style.opacity = 0;
		}
		setTimeout(addStylesAfterDelay, this.time);
	}

  
	/**
   * Progreesbar.
   *
   * @private
   */
	_progressBar($element) {
		const ColorProgressBar = [];
		ColorProgressBar['OK'] = '#008e72';
		ColorProgressBar['ERROR'] = '#ff0056';
		ColorProgressBar['WARNING'] = '#ff3000';
		ColorProgressBar['INFO'] = '#0081ff';

		const bar = new ProgressBar.Line($element.querySelector('progressbar'), {
			strokeWidth: 1,
			duration: this.time,
			color: ColorProgressBar[this.type],
			trailWidth: 0,
			svgStyle: {width: '100%', height: '4px'}
		});
      
		bar.animate(1.0);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	customElements.define('antipodes-flash-message', FlashMessage);
});
