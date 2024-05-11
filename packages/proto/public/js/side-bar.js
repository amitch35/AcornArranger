import { Auth, Observer } from "@calpoly/mustang";
import { prepareTemplate } from "./template.js";
import { relayEvent } from "./relay-event.js";
import { loadJSON } from "./json-loader.js";
import "./drop-down.js";

export class SidebarElement extends HTMLElement {

    static styles = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    img {
        max-width: 100%;
    }

    .sidebar {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        top: 0;
        left: 0;
        height: 100vh;
        width: var(--sidebar-width-collapsed);
        background-color: var(--background-color-dark);
        padding: var(--spacing-size-small) var(--spacing-size-small);
        transition: all var(--transition-duration-sidebar) ease;
        z-index: 20;
    }
    
    .sidebar.active {
        width: var(--sidebar-width-active);
    }
    
    .sidebar #sidebar-btn {
        position: absolute;
        top: var(--spacing-size-small);
        left: 50%;
        color: var(--text-color-header);
        line-height: 1;
        transform: translateX(-50%);
        cursor: pointer;
    }
    
    .sidebar.active #sidebar-btn {
        left: 87%;
    }
    
    .sidebar .top {
        padding: var(--spacing-size-small) var(--spacing-size-small);
        line-height: 1;
    }
    
    .sidebar.active .top {
        padding: 0;
    }
    
    .sidebar .top .logo {
        color: var(--text-color-header);
        display: flex;
        font-size: var(--text-font-size-medium);
        width: 100%;
        align-items: center;
        pointer-events: none;
        gap: var(--spacing-size-small);
    }
    
    .sidebar .top .logo * {
        opacity: 0;
    }
    
    
    .sidebar .top .logo img {
        width: auto;
        height: auto;
        max-height: var(--logo-size-small);
        opacity: 1;
        transform: translateY(calc(var(--spacing-size-small) + var(--icon-size)));
        transition: all var(--transition-duration-sidebar) ease;
    }
    
    .sidebar.active .top .logo img {
        transform: translateY(- calc(var(--spacing-size-small) + var(--icon-size)));
    }
    
    .sidebar.active .top .logo * {
        opacity: 1;
    }
    
    .sidebar .top ~ *:not(.bottom) {
        transform: translateY(calc(var(--spacing-size-small) + var(--icon-size)));
        font-size: var(--text-font-size-body);
    }
    
    .sidebar .user {
        margin-top: var(--spacing-size-small);
        display: flex;
        align-items: center;
        color: var(--text-color-header);
    }
    
    .sidebar .user ::slotted(span), .sidebar .user span {
        /* display: none; */
        opacity: 0;
        transition-property: all;
        transition-duration: var(--transition-duration-sidebar);
        transition-timing-function: step-start;
        transition-delay: 0s;
    }
    
    .sidebar.active .user ::slotted(span), .sidebar.active .user span{
        /* display: inline; */
        opacity: 1;
        transition-property: all;
        transition-duration: var(--transition-duration-sidebar);
        transition-timing-function: cubic-bezier(0.89, 0, 0.26, 0.9);
        transition-delay: 0s;
    }
    
    .menu-items {
        margin-top: var(--spacing-size-medium);
        line-height: 1;
        flex-grow: 1;
    }
    
    .sidebar .menu-items li {
        position: relative;
        list-style-type: none;
    }

    .sidebar li + li {
        margin-top: var(--spacing-size-small);
    }
    
    .sidebar .menu-items a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: var(--text-color-header);
        border-radius: var(--border-size-radius);
        min-height: calc(var(--icon-size) + 1rem);
    }
    
    .sidebar .menu-items a:hover {
        background-color: var(--background-color-accent);
    }
    
    i.bx {
        font-size: var(--icon-size);
    }
    
    .sidebar i:not(#sidebar-btn) {
        min-width: calc(var(--icon-size) + 1rem);
        text-align: center;
    }
    
    .sidebar .nav-item {
        /* display: none; */
        opacity: 0;
        transition-property: all;
        transition-duration: var(--transition-duration-sidebar);
        transition-timing-function: step-start;
        transition-delay: 0s;
    }
    
    .sidebar.active .nav-item {
        /* display: inline; */
        opacity: 1;
        transition-property: all;
        transition-duration: var(--transition-duration-sidebar);
        transition-timing-function: cubic-bezier(0.89, 0, 0.26, 0.9);
        transition-delay: 0s;
    }
    
    .sidebar ul li .tooltip {
        position: absolute;
        left: var(--sidebar-width-collapsed);
        top: 50%;
        transform: translateY(-50%);
        width: max-content;
        box-shadow: 0 0.5rem 0.8rem var(--background-color-dark);
        border-radius: var(--border-size-radius);
        background-color: var(--background-color-accent);
        padding: var(--spacing-size-small) var(--spacing-size-medium);
        /* z-index: 20; */
        opacity: 0;
    }
    
    .sidebar ul li a:hover ~ .tooltip {
        opacity: 1;
    }
    
    .sidebar.active ul li a:hover ~ .tooltip {
        display: none;
    }
    
    .bottom {
        /* margin-top: var(--spacing-size-large); */
        line-height: 1;
    }
    
    .sidebar .bottom li {
        position: relative;
        list-style-type: none;
    }
    
    .sidebar .bottom a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: var(--text-color-header);
        border-radius: var(--border-size-radius);
        min-height: calc(var(--icon-size) + 1rem);
    }
    
    .sidebar .bottom a:hover {
        background-color: var(--background-color-accent);
    }
    
    :host .dark-mode-only {
        /* opacity: 0; */
        display: none;
    }
    
    :host(.dark-mode) .dark-mode-only {
        /* opacity: 1; */
        display: inline-block;
    }
    
    :host .light-mode-only {
        /* opacity: 1; */
        display: inline-block;
    }
    
    :host(.dark-mode) .light-mode-only {
        /* opacity: 0; */
        display: none;
    }    
    `;

    static template = prepareTemplate(`
        <template>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        <nav class="sidebar">
            <i id="sidebar-btn" class='bx bx-menu'></i>
            <div class="top">
                <div class="logo">
                    <img src="../images/AcornArranger Logo.png" alt="AcornArranger Logo">
                    <span>AcornArranger</span>
                </div>
            </div>
            <div class="user">
                <i class='bx bxs-user-circle' ></i>
                <slot name="display_name"><span>Please <a href="../login.html?next=${window.location.href}" style="color: var(--text-color-link);">login</a></span></slot>
            </div>
            <ul class="menu-items">
                <li>
                    <a href="#">
                        <i class='bx bx-calendar-alt'></i>
                        <span class="nav-item">View Appointments</span>
                    </a>
                    <span class="tooltip">View Appointments</span>
                </li>
                <li>
                    <a href="#">
                        <i class='bx bxs-book-bookmark'></i>
                        <span class="nav-item">Schedule</span>
                    </a>
                    <span class="tooltip">Schedule</span>
                </li>
                <li>
                    <a href="#">
                        <i class='bx bxs-edit-location' ></i>
                        <span class="nav-item">Properties</span>
                    </a>
                    <span class="tooltip">Properties</span>
                </li>
                <li>
                    <a href="#">
                        <i class='bx bx-male'></i>
                        <span class="nav-item">Employee Roles</span>
                    </a>
                    <span class="tooltip">Employee Roles</span>
                </li>
            </ul>
            <ul class="bottom">
                <li>
                    <a href="#" id="theme-btn" >
                        <i class='bx bxs-sun dark-mode-only'></i>
                        <i class='bx bxs-moon light-mode-only'></i>
                        <span class="nav-item">Theme</span>
                    </a>
                    <span class="tooltip">Theme</span>
                </li>
                <li>
                    <a href="#" id="logout-btn">
                        <i class='bx bx-log-out'></i>
                        <span class="nav-item">Logout</span>
                    </a>
                    <span class="tooltip">Logout</span>
                </li>
            </ul>
        </nav>
        <style>
        ${this.styles}
        </style>
        </template>
    `);

    constructor() {
        super();

        this.attachShadow({ mode: "open" }).appendChild(
            SidebarElement.template.cloneNode(true)
        );

        this.shadowRoot
            .querySelector('#sidebar-btn')
            .addEventListener(
                "click", 
                () => this.shadowRoot
                    .querySelector('.sidebar')
                    .classList.toggle('active')
            );

        this.shadowRoot
            .querySelector('#theme-btn')
            .addEventListener(
                "click", 
                (event) => {
                    this.classList.toggle("dark-mode");
                    relayEvent(event,'dark-mode:toggle',{checked: event.target.checked});
                }
            );

        this.shadowRoot
            .querySelector('#logout-btn')
            .addEventListener(
                "click", 
                (event) => {
                    relayEvent(event, 'auth:message', ['auth/signout'])
                }
            );
    }

    _authObserver = new Observer(this, "acorn:auth");

    get authorization() {
        console.log("Authorization for user, ", this._user);
        return (
          this._user?.authenticated && {
            Authorization: `Bearer ${this._user.token}`
          }
        );
    }

    connectedCallback() {
        this._authObserver.observe().then((obs) => {
            obs.setEffect(({ user }) => {
                this._user = user;
                if (user) {
                    const { token } = user;
                    const href = '/auth/user'
                    console.log("Loading display name", this.authorization);
                    this.replaceChildren();
                    loadJSON(
                        href,
                        this,
                        renderDisplayName,
                        this.authorization
                    );
                }
            });
        });
    }
}

customElements.define("side-bar", SidebarElement);

function renderDisplayName(json) {
    console.log("Rendering Display Name:", json);
    const entries = Object.entries(json);
    const slot = ([key, value]) => {
        switch (key) {
            case "Error":
                return `<span slot="display_name">Error: ${value}</span>`;
            case "user_metadata":
                if (value.display_name){
                    return `<span slot="display_name">${value.display_name}</span>`;
                } else {
                    return `<span slot="display_name">Hello, user</span>`;
                }
            default:
                return;
        }
    };
  
    return entries.map(slot).join("\n");
  }import { Auth, Observer } from "@calpoly/mustang";
import { prepareTemplate } from "./template.js";
import { relayEvent } from "./relay-event.js";
import { loadJSON } from "./json-loader.js";
import "./drop-down.js";

export class SidebarElement extends HTMLElement {

    static styles = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    img {
        max-width: 100%;
    }

    .sidebar {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        top: 0;
        left: 0;
        height: 100vh;
        width: var(--sidebar-width-collapsed);
        background-color: var(--background-color-dark);
        padding: var(--spacing-size-small) var(--spacing-size-small);
        transition: all var(--transition-duration-sidebar) ease;
        z-index: 20;
    }
    
    .sidebar.active {
        width: var(--sidebar-width-active);
    }
    
    .sidebar #sidebar-btn {
        position: absolute;
        top: var(--spacing-size-small);
        left: 50%;
        color: var(--text-color-header);
        line-height: 1;
        transform: translateX(-50%);
        cursor: pointer;
    }
    
    .sidebar.active #sidebar-btn {
        left: 87%;
    }
    
    .sidebar .top {
        padding: var(--spacing-size-small) var(--spacing-size-small);
        line-height: 1;
    }
    
    .sidebar.active .top {
        padding: 0;
    }
    
    .sidebar .top .logo {
        color: var(--text-color-header);
        display: flex;
        font-size: var(--text-font-size-medium);
        width: 100%;
        align-items: center;
        pointer-events: none;
        gap: var(--spacing-size-small);
    }
    
    .sidebar .top .logo * {
        opacity: 0;
    }
    
    
    .sidebar .top .logo img {
        width: auto;
        height: auto;
        max-height: var(--logo-size-small);
        opacity: 1;
        transform: translateY(calc(var(--spacing-size-small) + var(--icon-size)));
        transition: all var(--transition-duration-sidebar) ease;
    }
    
    .sidebar.active .top .logo img {
        transform: translateY(- calc(var(--spacing-size-small) + var(--icon-size)));
    }
    
    .sidebar.active .top .logo * {
        opacity: 1;
    }
    
    .sidebar .top ~ *:not(.bottom) {
        transform: translateY(calc(var(--spacing-size-small) + var(--icon-size)));
        font-size: var(--text-font-size-body);
    }
    
    .sidebar .user {
        margin-top: var(--spacing-size-small);
        display: flex;
        align-items: center;
        color: var(--text-color-header);
    }
    
    .sidebar .user ::slotted(span), .sidebar .user span {
        /* display: none; */
        opacity: 0;
        transition-property: all;
        transition-duration: var(--transition-duration-sidebar);
        transition-timing-function: step-start;
        transition-delay: 0s;
    }
    
    .sidebar.active .user ::slotted(span), .sidebar.active .user span{
        /* display: inline; */
        opacity: 1;
        transition-property: all;
        transition-duration: var(--transition-duration-sidebar);
        transition-timing-function: cubic-bezier(0.89, 0, 0.26, 0.9);
        transition-delay: 0s;
    }
    
    .menu-items {
        
        margin-top: var(--spacing-size-medium);
        line-height: 1;
        flex-grow: 1;
    }
    
    .sidebar .menu-items li {
        position: relative;
        list-style-type: none;
    }
    
    .sidebar .menu-items a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: var(--text-color-header);
        border-radius: var(--border-size-radius);
        min-height: calc(var(--icon-size) + 1rem);
    }
    
    .sidebar .menu-items a:hover {
        background-color: var(--background-color-accent);
    }
    
    i.bx {
        font-size: var(--icon-size);
    }
    
    .sidebar i:not(#sidebar-btn) {
        min-width: calc(var(--icon-size) + 1rem);
        text-align: center;
    }
    
    .sidebar .nav-item {
        /* display: none; */
        opacity: 0;
        transition-property: all;
        transition-duration: var(--transition-duration-sidebar);
        transition-timing-function: step-start;
        transition-delay: 0s;
    }
    
    .sidebar.active .nav-item {
        /* display: inline; */
        opacity: 1;
        transition-property: all;
        transition-duration: var(--transition-duration-sidebar);
        transition-timing-function: cubic-bezier(0.89, 0, 0.26, 0.9);
        transition-delay: 0s;
    }
    
    .sidebar ul li .tooltip {
        position: absolute;
        left: var(--sidebar-width-collapsed);
        top: 50%;
        transform: translateY(-50%);
        width: max-content;
        box-shadow: 0 0.5rem 0.8rem var(--background-color-dark);
        border-radius: var(--border-size-radius);
        background-color: var(--background-color-accent);
        padding: var(--spacing-size-small) var(--spacing-size-medium);
        /* z-index: 20; */
        opacity: 0;
    }
    
    .sidebar ul li a:hover ~ .tooltip {
        opacity: 1;
    }
    
    .sidebar.active ul li a:hover ~ .tooltip {
        display: none;
    }
    
    .bottom {
        /* margin-top: var(--spacing-size-large); */
        line-height: 1;
    }
    
    .sidebar .bottom li {
        position: relative;
        list-style-type: none;
    }
    
    .sidebar .bottom a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: var(--text-color-header);
        border-radius: var(--border-size-radius);
        min-height: calc(var(--icon-size) + 1rem);
    }
    
    .sidebar .bottom a:hover {
        background-color: var(--background-color-accent);
    }
    
    :host .dark-mode-only {
        /* opacity: 0; */
        display: none;
    }
    
    :host(.dark-mode) .dark-mode-only {
        /* opacity: 1; */
        display: inline-block;
    }
    
    :host .light-mode-only {
        /* opacity: 1; */
        display: inline-block;
    }
    
    :host(.dark-mode) .light-mode-only {
        /* opacity: 0; */
        display: none;
    }    
    `;

    static template = prepareTemplate(`
        <template>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        <nav class="sidebar">
            <i id="sidebar-btn" class='bx bx-menu'></i>
            <div class="top">
                <div class="logo">
                    <img src="../images/AcornArranger Logo.png" alt="AcornArranger Logo">
                    <span>AcornArranger</span>
                </div>
            </div>
            <div class="user">
                <i class='bx bxs-user-circle' ></i>
                <slot name="display_name"><span>Please login</span></slot>
            </div>
            <ul class="menu-items">
                <li>
                    <a href="#">
                        <i class='bx bx-calendar-alt'></i>
                        <span class="nav-item">View Appointments</span>
                    </a>
                    <span class="tooltip">View Appointments</span>
                </li>
                <li>
                    <a href="#">
                        <i class='bx bxs-book-bookmark'></i>
                        <span class="nav-item">Schedule</span>
                    </a>
                    <span class="tooltip">Schedule</span>
                </li>
                <li>
                    <a href="#">
                        <i class='bx bxs-edit-location' ></i>
                        <span class="nav-item">Properties</span>
                    </a>
                    <span class="tooltip">Properties</span>
                </li>
                <li>
                    <a href="#">
                        <i class='bx bx-male'></i>
                        <span class="nav-item">Employee Roles</span>
                    </a>
                    <span class="tooltip">Employee Roles</span>
                </li>
            </ul>
            <ul class="bottom">
                <li>
                    <a href="#" id="theme-btn" >
                        <i class='bx bxs-sun dark-mode-only'></i>
                        <i class='bx bxs-moon light-mode-only'></i>
                        <span class="nav-item">Theme</span>
                    </a>
                    <span class="tooltip">Theme</span>
                </li>
                <li>
                    <a href="#" id="logout-btn">
                        <i class='bx bx-log-out'></i>
                        <span class="nav-item">Logout</span>
                    </a>
                    <span class="tooltip">Logout</span>
                </li>
            </ul>
        </nav>
        <style>
        ${this.styles}
        </style>
        </template>
    `);

    constructor() {
        super();

        this.attachShadow({ mode: "open" }).appendChild(
            SidebarElement.template.cloneNode(true)
        );

        this.shadowRoot
            .querySelector('#sidebar-btn')
            .addEventListener(
                "click", 
                () => this.shadowRoot
                    .querySelector('.sidebar')
                    .classList.toggle('active')
            );

        this.shadowRoot
            .querySelector('#theme-btn')
            .addEventListener(
                "click", 
                (event) => {
                    this.classList.toggle("dark-mode");
                    relayEvent(event,'dark-mode:toggle',{checked: event.target.checked});
                }
            );

        this.shadowRoot
            .querySelector('#logout-btn')
            .addEventListener(
                "click", 
                (event) => {
                    relayEvent(event, 'auth:message', ['auth/signout'])
                }
            );
    }

    _authObserver = new Observer(this, "acorn:auth");

    get authorization() {
        console.log("Authorization for user, ", this._user);
        return (
          this._user?.authenticated && {
            Authorization: `Bearer ${this._user.token}`
          }
        );
    }

    connectedCallback() {
        this._authObserver.observe().then((obs) => {
            obs.setEffect(({ user }) => {
                this._user = user;
                if (user) {
                    const { token } = user;
                    const href = '/auth/user'
                    console.log("Loading display name", this.authorization);
                    this.replaceChildren();
                    loadJSON(
                        href,
                        this,
                        renderDisplayName,
                        this.authorization
                    );
                }
            });
        });
    }
}

customElements.define("side-bar", SidebarElement);

function renderDisplayName(json) {
    console.log("Rendering Display Name:", json);
    const entries = Object.entries(json);
    const slot = ([key, value]) => {
        switch (key) {
            case "Error":
                return `<span slot="display_name">Error: ${value}</span>`;
            case "user_metadata":
                if (value.display_name){
                    return `<span slot="display_name">${value.display_name}</span>`;
                } else {
                    return `<span slot="display_name">Hello, user</span>`;
                }
            default:
                return;
        }
    };
  
    return entries.map(slot).join("\n");
  }