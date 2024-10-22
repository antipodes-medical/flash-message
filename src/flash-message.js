class FlashMessage extends HTMLElement {
    constructor() {
        super();
        this.message = this.getAttribute("message");
        this.time = this.getAttribute("time");
        this.progressbar = this.getAttribute("progressbar");
    }

    connectedCallback() {
        this.injectStyles();
        this.render();

        if (this.progressbar === "true") {
            const progressBar = this.querySelector(".progress-bar");
            progressBar.style.animationDuration = `${this.time / 1000}s`;
            setTimeout(() => this.close(), this.time);
        }
    }

    injectStyles() {
        if (!document.querySelector("#flash-message-styles")) {
            const style = document.createElement("style");
            style.id = "flash-message-styles";
            style.textContent = `
                .flash-message-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background-color: #0f3d3e;
                    color: #fff;
                    padding: 10px;
                    border-radius: 5px;
                    font-family: Arial, sans-serif;
                    position: relative;
                    width: 300px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    overflow: hidden;
                }

                .flash-message-container .message {
                    display: flex;
                    align-items: center;
                }

                .flash-message-container .icon {
                    margin-right: 10px;
                }

                .flash-message-container .icon svg {
                    width: 20px;
                    height: 20px;
                    fill: #00f3ff;
                }

                .flash-message-container .close-btn {
                    background: none;
                    border: none;
                    color: #00f3ff;
                    font-size: 18px;
                    cursor: pointer;
                }

                .flash-message-container .progress-bar {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background-color: #00f3ff;
                    width: 0; /* Initially hidden */
                    animation: progress linear forwards;
                }

                @keyframes progress {
                    from {
                        width: 0;
                    }
                    to {
                        width: 100%;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    render() {
        this.innerHTML = this._html();
    }

    _html() {
        return `
            <div class="flash-message-container">
                <div class="message">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M9 21.5 0 12.5l2-2 7 7 13-13 2 2L9 21.5z"/>
                        </svg>
                    </div>
                    <strong>${this.message}</strong>
                </div>
                <button class="close-btn" onclick="this.parentElement.remove()">×</button>
                ${this.progressbar === "true" ? `<div class="progress-bar"></div>` : ''}
            </div>
        `;
    }

    static get observedAttributes() {
        return ["message", "time", "progressbar"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
        this.render();
    }

    disconnectedCallback() {
        this.innerHTML = "";
    }

    close() {
        this.remove();
    }

    open() {
        this.render();
    }

    toggle() {
        this.render();
    }
}

// Register the custom element
customElements.define("flash-message", FlashMessage);
