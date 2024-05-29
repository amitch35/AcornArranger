(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();var rs;let Pt=class extends Error{};Pt.prototype.name="InvalidTokenError";function wi(n){return decodeURIComponent(atob(n).replace(/(.)/g,(t,e)=>{let i=e.charCodeAt(0).toString(16).toUpperCase();return i.length<2&&(i="0"+i),"%"+i}))}function xi(n){let t=n.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return wi(t)}catch{return atob(t)}}function Is(n,t){if(typeof n!="string")throw new Pt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,i=n.split(".")[e];if(typeof i!="string")throw new Pt(`Invalid token specified: missing part #${e+1}`);let s;try{s=xi(i)}catch(r){throw new Pt(`Invalid token specified: invalid base64 for part #${e+1} (${r.message})`)}try{return JSON.parse(s)}catch(r){throw new Pt(`Invalid token specified: invalid json for part #${e+1} (${r.message})`)}}const Si="mu:context",Se=`${Si}:change`;class ki{constructor(t,e){this._proxy=Ai(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ze extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new ki(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Se,t),t}detach(t){this.removeEventListener(Se,t)}}function Ai(n,t){return new Proxy(n,{get:(i,s,r)=>{if(s==="then")return;const o=Reflect.get(i,s,r);return console.log(`Context['${s}'] => `,o),o},set:(i,s,r,o)=>{const a=n[s];console.log(`Context['${s.toString()}'] <= `,r);const l=Reflect.set(i,s,r,o);if(l){let u=new CustomEvent(Se,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:s,oldValue:a,value:r}),t.dispatchEvent(u)}else console.log(`Context['${s}] was not set to ${r}`);return l}})}function Ei(n,t){const e=Ms(t,n);return new Promise((i,s)=>{if(e){const r=e.localName;customElements.whenDefined(r).then(()=>i(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function Ms(n,t){const e=`[provides="${n}"]`;if(!t||t===document.getRootNode())return;const i=t.closest(e);if(i)return i;const s=t.getRootNode();if(s instanceof ShadowRoot)return Ms(n,s.host)}class Pi extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Ns(n="mu:message"){return(t,...e)=>t.dispatchEvent(new Pi(e,n))}class Te{constructor(t,e,i="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=i,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const i=e.detail;this.consume(i)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Ci(n){return t=>({...t,...n})}const ke="mu:auth:jwt",Kt=class js extends Te{constructor(t,e){super((i,s)=>this.update(i,s),t,js.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:i,redirect:s}=t[1];return e(Ti(i)),ge(s);case"auth/signout":return e(os()),ge(this._redirectForLogin);case"auth/redirect":return e(os()),ge(this._redirectForLogin,{next:window.location.href});default:const r=t[0];throw new Error(`Unhandled Auth message "${r}"`)}}};Kt.EVENT_TYPE="auth:message";Kt.dispatch=Ns(Kt.EVENT_TYPE);let Oi=Kt;function ge(n,t={}){if(!n)return;const e=window.location.href,i=new URL(n,e);return Object.entries(t).forEach(([s,r])=>i.searchParams.set(s,r)),()=>{console.log("Redirecting to ",n),window.location.assign(i)}}class zi extends ze{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:pt.authenticateFromLocalStorage()})}connectedCallback(){new Oi(this.context,this.redirect).attach(this)}}class ht{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ke),t}}class pt extends ht{constructor(t){super();const e=Is(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new pt(t);return localStorage.setItem(ke,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ke);return t?pt.authenticate(t):new ht}}function Ti(n){return Ci({user:pt.authenticate(n),token:n})}function os(){return n=>{const t=n.user;return{user:t&&t.authenticated?ht.deauthenticate(t):t,token:""}}}function Ri(n){return n.authenticated?{Authorization:`Bearer ${n.token||"NO_TOKEN"}`}:{}}function Ui(n){return n.authenticated?Is(n.token||""):{}}const E=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:pt,Provider:zi,User:ht,headers:Ri,payload:Ui},Symbol.toStringTag,{value:"Module"}));function Qt(n,t,e){const i=n.target,s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${n.type}:`,s),i.dispatchEvent(s),n.stopPropagation()}function Ae(n,t="*"){return n.composedPath().find(i=>{const s=i;return s.tagName&&s.matches(t)})}const Ft=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:Ae,relay:Qt},Symbol.toStringTag,{value:"Module"})),Ii=new DOMParser;function qt(n,...t){const e=n.map((o,a)=>a?[t[a-1],o]:[o]).flat().join(""),i=Ii.parseFromString(e,"text/html"),s=i.head.childElementCount?i.head.children:i.body.children,r=new DocumentFragment;return r.replaceChildren(...s),r}function he(n){const t=n.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:i};function i(s,r={mode:"open"}){const o=s.attachShadow(r);return e&&o.appendChild(e.content.cloneNode(!0)),o}}const Ls=class Ds extends HTMLElement{constructor(){super(),this._state={},he(Ds.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const i=e.name,s=e.value;i&&(this._state[i]=s)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),Qt(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},Ni(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};Ls.template=qt`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;let Mi=Ls;function Ni(n,t){const e=Object.entries(n);for(const[i,s]of e){const r=t.querySelector(`[name="${i}"]`);if(r){const o=r;switch(o.type){case"checkbox":const a=o;a.checked=!!s;break;default:o.value=s;break}}}return n}const ji=Object.freeze(Object.defineProperty({__proto__:null,Element:Mi},Symbol.toStringTag,{value:"Module"})),Hs=class Fs extends Te{constructor(t){super((e,i)=>this.update(e,i),t,Fs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:i,state:s}=t[1];e(Di(i,s));break}case"history/redirect":{const{href:i,state:s}=t[1];e(Hi(i,s));break}}}};Hs.EVENT_TYPE="history:message";let Re=Hs;class as extends ze{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Li(t);if(e){const i=new URL(e.href);i.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),Ue(e,"history/navigate",{href:i.pathname+i.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new Re(this.context).attach(this)}}function Li(n){const t=n.currentTarget,e=i=>i.tagName=="A"&&i.href;if(n.button===0)if(n.composed){const s=n.composedPath().find(e);return s||void 0}else{for(let i=n.target;i;i===t?null:i.parentElement)if(e(i))return i;return}}function Di(n,t={}){return history.pushState(t,"",n),()=>({location:document.location,state:history.state})}function Hi(n,t={}){return history.replaceState(t,"",n),()=>({location:document.location,state:history.state})}const Ue=Ns(Re.EVENT_TYPE),qs=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:as,Provider:as,Service:Re,dispatch:Ue},Symbol.toStringTag,{value:"Module"}));class Bt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,i)=>{if(this._provider){const s=new ls(this._provider,t);this._effects.push(s),e(s)}else Ei(this._target,this._contextLabel).then(s=>{const r=new ls(s,t);this._provider=s,this._effects.push(r),s.attach(o=>this._handleChange(o)),e(r)}).catch(s=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class ls{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Ie=class Bs extends HTMLElement{constructor(){super(),this._state={},this._user=new ht,this._authObserver=new Bt(this,"blazing:auth"),he(Bs.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",i=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;qi(s,this._state,e,this.authorization).then(r=>kt(r,this)).then(r=>{const o=`mu-rest-form:${i}`,a=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[i]:r,url:s}});this.dispatchEvent(a)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const i=e.name,s=e.value;i&&(this._state[i]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},kt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&Ee(this.src,this.authorization).then(e=>{this._state=e,kt(e,this)}))})}attributeChangedCallback(t,e,i){switch(t){case"src":this.src&&i&&i!==e&&!this.isNew&&Ee(this.src,this.authorization).then(s=>{this._state=s,kt(s,this)});break;case"new":i&&(this._state={},kt({},this));break}}};Ie.observedAttributes=["src","new","action"];Ie.template=qt`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;let Fi=Ie;function Ee(n,t){return fetch(n,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${n}:`,e))}function kt(n,t){const e=Object.entries(n);for(const[i,s]of e){const r=t.querySelector(`[name="${i}"]`);if(r){const o=r;switch(o.type){case"checkbox":const a=o;a.checked=!!s;break;default:o.value=s;break}}}return n}function qi(n,t,e="PUT",i={}){return fetch(n,{method:e,headers:{"Content-Type":"application/json",...i},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()}).catch(s=>console.log("Error submitting form:",s))}const Me=Object.freeze(Object.defineProperty({__proto__:null,FormElement:Fi,fetchData:Ee},Symbol.toStringTag,{value:"Module"})),Xs=class Ys extends Te{constructor(t,e){super(e,t,Ys.EVENT_TYPE,!1)}};Xs.EVENT_TYPE="mu:message";let Ws=Xs;class Bi extends ze{constructor(t,e,i){super(e),this._user=new ht,this._updateFn=t,this._authObserver=new Bt(this,i)}connectedCallback(){const t=new Ws(this.context,(e,i)=>this._updateFn(e,i,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Xi=Object.freeze(Object.defineProperty({__proto__:null,Provider:Bi,Service:Ws},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Gt=globalThis,Ne=Gt.ShadowRoot&&(Gt.ShadyCSS===void 0||Gt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,je=Symbol(),cs=new WeakMap;let Js=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==je)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Ne&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=cs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&cs.set(e,t))}return t}toString(){return this.cssText}};const Yi=n=>new Js(typeof n=="string"?n:n+"",void 0,je),Wi=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((i,s,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new Js(e,n,je)},Ji=(n,t)=>{if(Ne)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=Gt.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,n.appendChild(i)}},ds=Ne?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return Yi(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Vi,defineProperty:Gi,getOwnPropertyDescriptor:Zi,getOwnPropertyNames:Ki,getOwnPropertySymbols:Qi,getPrototypeOf:tn}=Object,ut=globalThis,hs=ut.trustedTypes,en=hs?hs.emptyScript:"",ps=ut.reactiveElementPolyfillSupport,Ot=(n,t)=>n,te={toAttribute(n,t){switch(t){case Boolean:n=n?en:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},Le=(n,t)=>!Vi(n,t),us={attribute:!0,type:String,converter:te,reflect:!1,hasChanged:Le};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ut.litPropertyMetadata??(ut.litPropertyMetadata=new WeakMap);let lt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=us){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Gi(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=Zi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return s==null?void 0:s.call(this)},set(o){const a=s==null?void 0:s.call(this);r.call(this,o),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??us}static _$Ei(){if(this.hasOwnProperty(Ot("elementProperties")))return;const t=tn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ot("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ot("properties"))){const e=this.properties,i=[...Ki(e),...Qi(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(ds(s))}else t!==void 0&&e.push(ds(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ji(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){var i;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const o=(((i=s.converter)==null?void 0:i.toAttribute)!==void 0?s.converter:te).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var i;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const o=s.getPropertyOptions(r),a=typeof o.converter=="function"?{fromAttribute:o.converter}:((i=o.converter)==null?void 0:i.fromAttribute)!==void 0?o.converter:te;this._$Em=r,this[r]=a.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){if(i??(i=this.constructor.getPropertyOptions(t)),!(i.hasChanged??Le)(this[t],e))return;this.P(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,o]of s)o.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],o)}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostUpdate)==null?void 0:r.call(s)}),this.update(i)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};lt.elementStyles=[],lt.shadowRootOptions={mode:"open"},lt[Ot("elementProperties")]=new Map,lt[Ot("finalized")]=new Map,ps==null||ps({ReactiveElement:lt}),(ut.reactiveElementVersions??(ut.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ee=globalThis,se=ee.trustedTypes,fs=se?se.createPolicy("lit-html",{createHTML:n=>n}):void 0,Vs="$lit$",Y=`lit$${Math.random().toFixed(9).slice(2)}$`,Gs="?"+Y,sn=`<${Gs}>`,et=document,Rt=()=>et.createComment(""),Ut=n=>n===null||typeof n!="object"&&typeof n!="function",Zs=Array.isArray,nn=n=>Zs(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",ve=`[ 	
\f\r]`,At=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ms=/-->/g,gs=/>/g,Z=RegExp(`>|${ve}(?:([^\\s"'>=/]+)(${ve}*=${ve}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vs=/'/g,bs=/"/g,Ks=/^(?:script|style|textarea|title)$/i,rn=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),be=rn(1),ft=Symbol.for("lit-noChange"),C=Symbol.for("lit-nothing"),_s=new WeakMap,Q=et.createTreeWalker(et,129);function Qs(n,t){if(!Array.isArray(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return fs!==void 0?fs.createHTML(t):t}const on=(n,t)=>{const e=n.length-1,i=[];let s,r=t===2?"<svg>":"",o=At;for(let a=0;a<e;a++){const l=n[a];let u,f,h=-1,c=0;for(;c<l.length&&(o.lastIndex=c,f=o.exec(l),f!==null);)c=o.lastIndex,o===At?f[1]==="!--"?o=ms:f[1]!==void 0?o=gs:f[2]!==void 0?(Ks.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=Z):f[3]!==void 0&&(o=Z):o===Z?f[0]===">"?(o=s??At,h=-1):f[1]===void 0?h=-2:(h=o.lastIndex-f[2].length,u=f[1],o=f[3]===void 0?Z:f[3]==='"'?bs:vs):o===bs||o===vs?o=Z:o===ms||o===gs?o=At:(o=Z,s=void 0);const d=o===Z&&n[a+1].startsWith("/>")?" ":"";r+=o===At?l+sn:h>=0?(i.push(u),l.slice(0,h)+Vs+l.slice(h)+Y+d):l+Y+(h===-2?a:d)}return[Qs(n,r+(n[e]||"<?>")+(t===2?"</svg>":"")),i]};let Pe=class ti{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const a=t.length-1,l=this.parts,[u,f]=on(t,e);if(this.el=ti.createElement(u,i),Q.currentNode=this.el.content,e===2){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=Q.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const h of s.getAttributeNames())if(h.endsWith(Vs)){const c=f[o++],d=s.getAttribute(h).split(Y),p=/([.?@])?(.*)/.exec(c);l.push({type:1,index:r,name:p[2],strings:d,ctor:p[1]==="."?ln:p[1]==="?"?cn:p[1]==="@"?dn:pe}),s.removeAttribute(h)}else h.startsWith(Y)&&(l.push({type:6,index:r}),s.removeAttribute(h));if(Ks.test(s.tagName)){const h=s.textContent.split(Y),c=h.length-1;if(c>0){s.textContent=se?se.emptyScript:"";for(let d=0;d<c;d++)s.append(h[d],Rt()),Q.nextNode(),l.push({type:2,index:++r});s.append(h[c],Rt())}}}else if(s.nodeType===8)if(s.data===Gs)l.push({type:2,index:r});else{let h=-1;for(;(h=s.data.indexOf(Y,h+1))!==-1;)l.push({type:7,index:r}),h+=Y.length-1}r++}}static createElement(t,e){const i=et.createElement("template");return i.innerHTML=t,i}};function mt(n,t,e=n,i){var s,r;if(t===ft)return t;let o=i!==void 0?(s=e._$Co)==null?void 0:s[i]:e._$Cl;const a=Ut(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==a&&((r=o==null?void 0:o._$AO)==null||r.call(o,!1),a===void 0?o=void 0:(o=new a(n),o._$AT(n,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=o:e._$Cl=o),o!==void 0&&(t=mt(n,o._$AS(n,t.values),o,i)),t}let an=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=((t==null?void 0:t.creationScope)??et).importNode(e,!0);Q.currentNode=s;let r=Q.nextNode(),o=0,a=0,l=i[0];for(;l!==void 0;){if(o===l.index){let u;l.type===2?u=new De(r,r.nextSibling,this,t):l.type===1?u=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(u=new hn(r,this,t)),this._$AV.push(u),l=i[++a]}o!==(l==null?void 0:l.index)&&(r=Q.nextNode(),o++)}return Q.currentNode=et,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},De=class ei{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=C,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=mt(this,t,e),Ut(t)?t===C||t==null||t===""?(this._$AH!==C&&this._$AR(),this._$AH=C):t!==this._$AH&&t!==ft&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):nn(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==C&&Ut(this._$AH)?this._$AA.nextSibling.data=t:this.T(et.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Pe.createElement(Qs(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===r)this._$AH.p(i);else{const o=new an(r,this),a=o.u(this.options);o.p(i),this.T(a),this._$AH=o}}_$AC(t){let e=_s.get(t.strings);return e===void 0&&_s.set(t.strings,e=new Pe(t)),e}k(t){Zs(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new ei(this.S(Rt()),this.S(Rt()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},pe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=C,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=C}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(r===void 0)t=mt(this,t,e,0),o=!Ut(t)||t!==this._$AH&&t!==ft,o&&(this._$AH=t);else{const a=t;let l,u;for(t=r[0],l=0;l<r.length-1;l++)u=mt(this,a[i+l],e,l),u===ft&&(u=this._$AH[l]),o||(o=!Ut(u)||u!==this._$AH[l]),u===C?t=C:t!==C&&(t+=(u??"")+r[l+1]),this._$AH[l]=u}o&&!s&&this.j(t)}j(t){t===C?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ln=class extends pe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===C?void 0:t}},cn=class extends pe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==C)}},dn=class extends pe{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=mt(this,t,e,0)??C)===ft)return;const i=this._$AH,s=t===C&&i!==C||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==C&&(i===C||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},hn=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){mt(this,t)}};const ys=ee.litHtmlPolyfillSupport;ys==null||ys(Pe,De),(ee.litHtmlVersions??(ee.litHtmlVersions=[])).push("3.1.3");const pn=(n,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let s=i._$litPart$;if(s===void 0){const r=(e==null?void 0:e.renderBefore)??null;i._$litPart$=s=new De(t.insertBefore(Rt(),r),r,void 0,e??{})}return s._$AI(n),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let dt=class extends lt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=pn(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return ft}};dt._$litElement$=!0,dt.finalized=!0,(rs=globalThis.litElementHydrateSupport)==null||rs.call(globalThis,{LitElement:dt});const $s=globalThis.litElementPolyfillSupport;$s==null||$s({LitElement:dt});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const un={attribute:!0,type:String,converter:te,reflect:!1,hasChanged:Le},fn=(n=un,t,e)=>{const{kind:i,metadata:s}=e;let r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),r.set(e.name,n),i==="accessor"){const{name:o}=e;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(o,l,n)},init(a){return a!==void 0&&this.P(o,void 0,n),a}}}if(i==="setter"){const{name:o}=e;return function(a){const l=this[o];t.call(this,a),this.requestUpdate(o,l,n)}}throw Error("Unsupported decorator location: "+i)};function si(n){return(t,e)=>typeof e=="object"?fn(n,t,e):((i,s,r)=>{const o=s.hasOwnProperty(r);return s.constructor.createProperty(r,o?{...i,wrapped:!0}:i),o?Object.getOwnPropertyDescriptor(s,r):void 0})(n,t,e)}function mn(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}function gn(n){throw new Error('Could not dynamically require "'+n+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var ii={};(function(n){var t=function(){var e=function(h,c,d,p){for(d=d||{},p=h.length;p--;d[h[p]]=c);return d},i=[1,9],s=[1,10],r=[1,11],o=[1,12],a=[5,11,12,13,14,15],l={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,d,p,v,b,S,G){var z=S.length-1;switch(b){case 1:return new v.Root({},[S[z-1]]);case 2:return new v.Root({},[new v.Literal({value:""})]);case 3:this.$=new v.Concat({},[S[z-1],S[z]]);break;case 4:case 5:this.$=S[z];break;case 6:this.$=new v.Literal({value:S[z]});break;case 7:this.$=new v.Splat({name:S[z]});break;case 8:this.$=new v.Param({name:S[z]});break;case 9:this.$=new v.Optional({},[S[z-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:i,13:s,14:r,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:i,13:s,14:r,15:o},{1:[2,2]},e(a,[2,4]),e(a,[2,5]),e(a,[2,6]),e(a,[2,7]),e(a,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:i,13:s,14:r,15:o},e(a,[2,10]),e(a,[2,11]),e(a,[2,12]),{1:[2,1]},e(a,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:i,12:[1,16],13:s,14:r,15:o},e(a,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,d){if(d.recoverable)this.trace(c);else{let p=function(v,b){this.message=v,this.hash=b};throw p.prototype=Error,new p(c,d)}},parse:function(c){var d=this,p=[0],v=[null],b=[],S=this.table,G="",z=0,nt=0,St=2,k=1,A=b.slice.call(arguments,1),g=Object.create(this.lexer),_={yy:{}};for(var y in this.yy)Object.prototype.hasOwnProperty.call(this.yy,y)&&(_.yy[y]=this.yy[y]);g.setInput(c,_.yy),_.yy.lexer=g,_.yy.parser=this,typeof g.yylloc>"u"&&(g.yylloc={});var U=g.yylloc;b.push(U);var I=g.options&&g.options.ranges;typeof _.yy.parseError=="function"?this.parseError=_.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var F=function(){var ot;return ot=g.lex()||k,typeof ot!="number"&&(ot=d.symbols_[ot]||ot),ot},x,w,P,fe,rt={},Jt,X,ns,Vt;;){if(w=p[p.length-1],this.defaultActions[w]?P=this.defaultActions[w]:((x===null||typeof x>"u")&&(x=F()),P=S[w]&&S[w][x]),typeof P>"u"||!P.length||!P[0]){var me="";Vt=[];for(Jt in S[w])this.terminals_[Jt]&&Jt>St&&Vt.push("'"+this.terminals_[Jt]+"'");g.showPosition?me="Parse error on line "+(z+1)+`:
`+g.showPosition()+`
Expecting `+Vt.join(", ")+", got '"+(this.terminals_[x]||x)+"'":me="Parse error on line "+(z+1)+": Unexpected "+(x==k?"end of input":"'"+(this.terminals_[x]||x)+"'"),this.parseError(me,{text:g.match,token:this.terminals_[x]||x,line:g.yylineno,loc:U,expected:Vt})}if(P[0]instanceof Array&&P.length>1)throw new Error("Parse Error: multiple actions possible at state: "+w+", token: "+x);switch(P[0]){case 1:p.push(x),v.push(g.yytext),b.push(g.yylloc),p.push(P[1]),x=null,nt=g.yyleng,G=g.yytext,z=g.yylineno,U=g.yylloc;break;case 2:if(X=this.productions_[P[1]][1],rt.$=v[v.length-X],rt._$={first_line:b[b.length-(X||1)].first_line,last_line:b[b.length-1].last_line,first_column:b[b.length-(X||1)].first_column,last_column:b[b.length-1].last_column},I&&(rt._$.range=[b[b.length-(X||1)].range[0],b[b.length-1].range[1]]),fe=this.performAction.apply(rt,[G,nt,z,_.yy,P[1],v,b].concat(A)),typeof fe<"u")return fe;X&&(p=p.slice(0,-1*X*2),v=v.slice(0,-1*X),b=b.slice(0,-1*X)),p.push(this.productions_[P[1]][0]),v.push(rt.$),b.push(rt._$),ns=S[p[p.length-2]][p[p.length-1]],p.push(ns);break;case 3:return!0}}return!0}},u=function(){var h={EOF:1,parseError:function(d,p){if(this.yy.parser)this.yy.parser.parseError(d,p);else throw new Error(d)},setInput:function(c,d){return this.yy=d||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var d=c.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var d=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var v=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var b=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===v.length?this.yylloc.first_column:0)+v[v.length-p.length].length-p[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[b[0],b[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),d=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+d+"^"},test_match:function(c,d){var p,v,b;if(this.options.backtrack_lexer&&(b={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(b.yylloc.range=this.yylloc.range.slice(0))),v=c[0].match(/(?:\r\n?|\n).*/g),v&&(this.yylineno+=v.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:v?v[v.length-1].length-v[v.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var S in b)this[S]=b[S];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,d,p,v;this._more||(this.yytext="",this.match="");for(var b=this._currentRules(),S=0;S<b.length;S++)if(p=this._input.match(this.rules[b[S]]),p&&(!d||p[0].length>d[0].length)){if(d=p,v=S,this.options.backtrack_lexer){if(c=this.test_match(p,b[S]),c!==!1)return c;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(c=this.test_match(d,b[v]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var d=this.next();return d||this.lex()},begin:function(d){this.conditionStack.push(d)},popState:function(){var d=this.conditionStack.length-1;return d>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(d){return d=this.conditionStack.length-1-Math.abs(d||0),d>=0?this.conditionStack[d]:"INITIAL"},pushState:function(d){this.begin(d)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(d,p,v,b){switch(v){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return h}();l.lexer=u;function f(){this.yy={}}return f.prototype=l,l.Parser=f,new f}();typeof gn<"u"&&(n.parser=t,n.Parser=t.Parser,n.parse=function(){return t.parse.apply(t,arguments)})})(ii);function at(n){return function(t,e){return{displayName:n,props:t,children:e||[]}}}var ni={Root:at("Root"),Concat:at("Concat"),Literal:at("Literal"),Splat:at("Splat"),Param:at("Param"),Optional:at("Optional")},ri=ii.parser;ri.yy=ni;var vn=ri,bn=Object.keys(ni);function _n(n){return bn.forEach(function(t){if(typeof n[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:n}}var oi=_n,yn=oi,$n=/[\-{}\[\]+?.,\\\^$|#\s]/g;function ai(n){this.captures=n.captures,this.re=n.re}ai.prototype.match=function(n){var t=this.re.exec(n),e={};if(t)return this.captures.forEach(function(i,s){typeof t[s+1]>"u"?e[i]=void 0:e[i]=decodeURIComponent(t[s+1])}),e};var wn=yn({Concat:function(n){return n.children.reduce((function(t,e){var i=this.visit(e);return{re:t.re+i.re,captures:t.captures.concat(i.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(n){return{re:n.props.value.replace($n,"\\$&"),captures:[]}},Splat:function(n){return{re:"([^?]*?)",captures:[n.props.name]}},Param:function(n){return{re:"([^\\/\\?]+)",captures:[n.props.name]}},Optional:function(n){var t=this.visit(n.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(n){var t=this.visit(n.children[0]);return new ai({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),xn=wn,Sn=oi,kn=Sn({Concat:function(n,t){var e=n.children.map((function(i){return this.visit(i,t)}).bind(this));return e.some(function(i){return i===!1})?!1:e.join("")},Literal:function(n){return decodeURI(n.props.value)},Splat:function(n,t){return t[n.props.name]?t[n.props.name]:!1},Param:function(n,t){return t[n.props.name]?t[n.props.name]:!1},Optional:function(n,t){var e=this.visit(n.children[0],t);return e||""},Root:function(n,t){t=t||{};var e=this.visit(n.children[0],t);return e?encodeURI(e):!1}}),An=kn,En=vn,Pn=xn,Cn=An;Xt.prototype=Object.create(null);Xt.prototype.match=function(n){var t=Pn.visit(this.ast),e=t.match(n);return e||!1};Xt.prototype.reverse=function(n){return Cn.visit(this.ast,n)};function Xt(n){var t;if(this?t=this:t=Object.create(Xt.prototype),typeof n>"u")throw new Error("A route spec is required");return t.spec=n,t.ast=En.parse(n),t}var On=Xt,zn=On,Tn=zn;const Rn=mn(Tn);var Un=Object.defineProperty,In=(n,t,e,i)=>{for(var s=void 0,r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=o(t,e,s)||s);return s&&Un(t,e,s),s};class ie extends dt{constructor(t,e){super(),this._cases=[],this._fallback=()=>be`
      <h1>Not Found</h1>
    `,this._cases=t.map(i=>({...i,route:new Rn(i.path)})),this._historyObserver=new Bt(this,e)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match),be`
      <main>${(()=>{if(this._match){if("view"in this._match)return this._match.view(this._match.params||{});if("redirect"in this._match){const e=this._match.redirect;if(typeof e=="string")return this.redirect(e),be`
              <h1>Redirecting to ${e}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:i}=t,s=new URLSearchParams(e),r=i+e;for(const o of this._cases){const a=o.route.match(r);if(a)return{...o,path:i,params:a,query:s}}}redirect(t){Ue(this,"history/redirect",{href:t})}}ie.styles=Wi`
    :host,
    main {
      display: contents;
    }
  `;In([si()],ie.prototype,"_match");const Mn=Object.freeze(Object.defineProperty({__proto__:null,Element:ie,Switch:ie},Symbol.toStringTag,{value:"Module"})),Nn=class li extends HTMLElement{constructor(){if(super(),he(li.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Nn.template=qt`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const ci=class di extends HTMLElement{constructor(){super(),this._array=[],he(di.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(hi("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const i=new Event("change",{bubbles:!0}),s=e.value,r=e.closest("label");if(r){const o=Array.from(this.children).indexOf(r);this._array[o]=s,this.dispatchEvent(i)}}}),this.addEventListener("click",t=>{Ae(t,"button.add")?Qt(t,"input-array:add"):Ae(t,"button.remove")&&Qt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Ln(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const i=Array.from(this.children).indexOf(e);this._array.splice(i,1),e.remove()}}};ci.template=qt`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style>
          :host {
            display: contents;
          }
          ul {
            display: contents;
          }
          button.add {
            grid-column: input / input-end;
          }
          ::slotted(label) {
            display: contents;
          }
        </style>
      </button>
    </template>
  `;let jn=ci;function Ln(n,t){t.replaceChildren(),n.forEach((e,i)=>t.append(hi(e)))}function hi(n,t){const e=n===void 0?"":`value="${n}"`;return qt`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}const Dn=Object.freeze(Object.defineProperty({__proto__:null,Element:jn},Symbol.toStringTag,{value:"Module"}));function wt(n){return Object.entries(n).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Hn=Object.defineProperty,Fn=Object.getOwnPropertyDescriptor,qn=(n,t,e,i)=>{for(var s=Fn(t,e),r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=o(t,e,s)||s);return s&&Hn(t,e,s),s};class H extends dt{constructor(t){super(),this._pending=[],this._observer=new Bt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([i,s])=>{console.log("Dispatching queued event",s,i),i.dispatchEvent(s)}),e.setEffect(()=>{var i;if(console.log("View effect",this,e,(i=this._context)==null?void 0:i.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const i=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",i),e.dispatchEvent(i)):(console.log("Queueing message event",i),this._pending.push([e,i]))}ref(t){return this.model?this.model[t]:void 0}}qn([si()],H.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Zt=globalThis,He=Zt.ShadowRoot&&(Zt.ShadyCSS===void 0||Zt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Fe=Symbol(),ws=new WeakMap;let pi=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==Fe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(He&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=ws.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&ws.set(e,t))}return t}toString(){return this.cssText}};const Bn=n=>new pi(typeof n=="string"?n:n+"",void 0,Fe),T=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((i,s,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new pi(e,n,Fe)},Xn=(n,t)=>{if(He)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=Zt.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,n.appendChild(i)}},xs=He?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return Bn(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Yn,defineProperty:Wn,getOwnPropertyDescriptor:Jn,getOwnPropertyNames:Vn,getOwnPropertySymbols:Gn,getPrototypeOf:Zn}=Object,J=globalThis,Ss=J.trustedTypes,Kn=Ss?Ss.emptyScript:"",_e=J.reactiveElementPolyfillSupport,zt=(n,t)=>n,ne={toAttribute(n,t){switch(t){case Boolean:n=n?Kn:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},qe=(n,t)=>!Yn(n,t),ks={attribute:!0,type:String,converter:ne,reflect:!1,hasChanged:qe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),J.litPropertyMetadata??(J.litPropertyMetadata=new WeakMap);class ct extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ks){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Wn(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=Jn(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return s==null?void 0:s.call(this)},set(o){const a=s==null?void 0:s.call(this);r.call(this,o),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ks}static _$Ei(){if(this.hasOwnProperty(zt("elementProperties")))return;const t=Zn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(zt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(zt("properties"))){const e=this.properties,i=[...Vn(e),...Gn(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(xs(s))}else t!==void 0&&e.push(xs(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Xn(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){var r;const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){const o=(((r=i.converter)==null?void 0:r.toAttribute)!==void 0?i.converter:ne).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){var r;const i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const o=i.getPropertyOptions(s),a=typeof o.converter=="function"?{fromAttribute:o.converter}:((r=o.converter)==null?void 0:r.fromAttribute)!==void 0?o.converter:ne;this._$Em=s,this[s]=a.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){if(i??(i=this.constructor.getPropertyOptions(t)),!(i.hasChanged??qe)(this[t],e))return;this.P(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,o]of s)o.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(s=>{var r;return(r=s.hostUpdate)==null?void 0:r.call(s)}),this.update(e)):this._$EU()}catch(s){throw t=!1,this._$EU(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}ct.elementStyles=[],ct.shadowRootOptions={mode:"open"},ct[zt("elementProperties")]=new Map,ct[zt("finalized")]=new Map,_e==null||_e({ReactiveElement:ct}),(J.reactiveElementVersions??(J.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,re=Tt.trustedTypes,As=re?re.createPolicy("lit-html",{createHTML:n=>n}):void 0,ui="$lit$",W=`lit$${Math.random().toFixed(9).slice(2)}$`,fi="?"+W,Qn=`<${fi}>`,st=document,It=()=>st.createComment(""),Mt=n=>n===null||typeof n!="object"&&typeof n!="function",mi=Array.isArray,tr=n=>mi(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",ye=`[ 	
\f\r]`,Et=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Es=/-->/g,Ps=/>/g,K=RegExp(`>|${ye}(?:([^\\s"'>=/]+)(${ye}*=${ye}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Cs=/'/g,Os=/"/g,gi=/^(?:script|style|textarea|title)$/i,er=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),m=er(1),gt=Symbol.for("lit-noChange"),O=Symbol.for("lit-nothing"),zs=new WeakMap,tt=st.createTreeWalker(st,129);function vi(n,t){if(!Array.isArray(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return As!==void 0?As.createHTML(t):t}const sr=(n,t)=>{const e=n.length-1,i=[];let s,r=t===2?"<svg>":"",o=Et;for(let a=0;a<e;a++){const l=n[a];let u,f,h=-1,c=0;for(;c<l.length&&(o.lastIndex=c,f=o.exec(l),f!==null);)c=o.lastIndex,o===Et?f[1]==="!--"?o=Es:f[1]!==void 0?o=Ps:f[2]!==void 0?(gi.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=K):f[3]!==void 0&&(o=K):o===K?f[0]===">"?(o=s??Et,h=-1):f[1]===void 0?h=-2:(h=o.lastIndex-f[2].length,u=f[1],o=f[3]===void 0?K:f[3]==='"'?Os:Cs):o===Os||o===Cs?o=K:o===Es||o===Ps?o=Et:(o=K,s=void 0);const d=o===K&&n[a+1].startsWith("/>")?" ":"";r+=o===Et?l+Qn:h>=0?(i.push(u),l.slice(0,h)+ui+l.slice(h)+W+d):l+W+(h===-2?a:d)}return[vi(n,r+(n[e]||"<?>")+(t===2?"</svg>":"")),i]};class Nt{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const a=t.length-1,l=this.parts,[u,f]=sr(t,e);if(this.el=Nt.createElement(u,i),tt.currentNode=this.el.content,e===2){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=tt.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const h of s.getAttributeNames())if(h.endsWith(ui)){const c=f[o++],d=s.getAttribute(h).split(W),p=/([.?@])?(.*)/.exec(c);l.push({type:1,index:r,name:p[2],strings:d,ctor:p[1]==="."?nr:p[1]==="?"?rr:p[1]==="@"?or:ue}),s.removeAttribute(h)}else h.startsWith(W)&&(l.push({type:6,index:r}),s.removeAttribute(h));if(gi.test(s.tagName)){const h=s.textContent.split(W),c=h.length-1;if(c>0){s.textContent=re?re.emptyScript:"";for(let d=0;d<c;d++)s.append(h[d],It()),tt.nextNode(),l.push({type:2,index:++r});s.append(h[c],It())}}}else if(s.nodeType===8)if(s.data===fi)l.push({type:2,index:r});else{let h=-1;for(;(h=s.data.indexOf(W,h+1))!==-1;)l.push({type:7,index:r}),h+=W.length-1}r++}}static createElement(t,e){const i=st.createElement("template");return i.innerHTML=t,i}}function vt(n,t,e=n,i){var o,a;if(t===gt)return t;let s=i!==void 0?(o=e._$Co)==null?void 0:o[i]:e._$Cl;const r=Mt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==r&&((a=s==null?void 0:s._$AO)==null||a.call(s,!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=s:e._$Cl=s),s!==void 0&&(t=vt(n,s._$AS(n,t.values),s,i)),t}class ir{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=((t==null?void 0:t.creationScope)??st).importNode(e,!0);tt.currentNode=s;let r=tt.nextNode(),o=0,a=0,l=i[0];for(;l!==void 0;){if(o===l.index){let u;l.type===2?u=new Yt(r,r.nextSibling,this,t):l.type===1?u=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(u=new ar(r,this,t)),this._$AV.push(u),l=i[++a]}o!==(l==null?void 0:l.index)&&(r=tt.nextNode(),o++)}return tt.currentNode=st,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Yt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=O,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=vt(this,t,e),Mt(t)?t===O||t==null||t===""?(this._$AH!==O&&this._$AR(),this._$AH=O):t!==this._$AH&&t!==gt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):tr(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==O&&Mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(st.createTextNode(t)),this._$AH=t}$(t){var r;const{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Nt.createElement(vi(i.h,i.h[0]),this.options)),i);if(((r=this._$AH)==null?void 0:r._$AD)===s)this._$AH.p(e);else{const o=new ir(s,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(t){let e=zs.get(t.strings);return e===void 0&&zs.set(t.strings,e=new Nt(t)),e}k(t){mi(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Yt(this.S(It()),this.S(It()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class ue{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=O,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=O}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(r===void 0)t=vt(this,t,e,0),o=!Mt(t)||t!==this._$AH&&t!==gt,o&&(this._$AH=t);else{const a=t;let l,u;for(t=r[0],l=0;l<r.length-1;l++)u=vt(this,a[i+l],e,l),u===gt&&(u=this._$AH[l]),o||(o=!Mt(u)||u!==this._$AH[l]),u===O?t=O:t!==O&&(t+=(u??"")+r[l+1]),this._$AH[l]=u}o&&!s&&this.j(t)}j(t){t===O?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class nr extends ue{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===O?void 0:t}}class rr extends ue{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==O)}}class or extends ue{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=vt(this,t,e,0)??O)===gt)return;const i=this._$AH,s=t===O&&i!==O||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==O&&(i===O||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class ar{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){vt(this,t)}}const $e=Tt.litHtmlPolyfillSupport;$e==null||$e(Nt,Yt),(Tt.litHtmlVersions??(Tt.litHtmlVersions=[])).push("3.1.3");const lr=(n,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let s=i._$litPart$;if(s===void 0){const r=(e==null?void 0:e.renderBefore)??null;i._$litPart$=s=new Yt(t.insertBefore(It(),r),r,void 0,e??{})}return s._$AI(n),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class q extends ct{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=lr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return gt}}var Us;q._$litElement$=!0,q.finalized=!0,(Us=globalThis.litElementHydrateSupport)==null||Us.call(globalThis,{LitElement:q});const we=globalThis.litElementPolyfillSupport;we==null||we({LitElement:q});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");const cr={};function dr(n,t,e){switch(n[0]){case"properties/save":hr(n[1],e).then(s=>t(r=>({...r,property:s}))).then(()=>{const{onSuccess:s}=n[1];s&&s()}).catch(s=>{const{onFailure:r}=n[1];r&&r(s)});break;case"properties/select":pr(n[1],e).then(s=>t(r=>({...r,property:s})));break;case"properties/":ur(n[1],e).then(s=>t(r=>({...r,properties:s})));break;case"roles/save":fr(n[1],e).then(s=>t(r=>({...r,role:s})));break;case"roles/select":mr(n[1],e).then(s=>t(r=>({...r,role:s})));break;case"roles/":gr(e).then(s=>t(r=>({...r,roles:s})));break;case"appointments/select":vr(n[1],e).then(s=>t(r=>({...r,appointment:s})));break;case"appointments/":br(n[1],e).then(s=>t(r=>({...r,appointments:s})));break;case"plans/select":it(n[1],e).then(s=>t(r=>({...r,plan:s})));break;case"plans/":_r(n[1],e).then(s=>t(r=>({...r,plans:s})));break;case"plans/staff/add":yr(n[1],e).then(s=>t(r=>({...r,plan:s})));break;case"plans/staff/remove":$r(n[1],e).then(s=>t(r=>({...r,plan:s})));break;case"plans/appointment/add":wr(n[1],e).then(s=>t(r=>({...r,plan:s})));break;case"plans/appointment/remove":xr(n[1],e).then(s=>t(r=>({...r,plan:s})));break;case"plans/build":Sr(n[1],e).then(s=>{t(r=>({...r,build_error:s}))});break;case"plans/send":kr(n[1],e).then(s=>{t(r=>({...r,build_error:s}))});break;case"plans/add":Ar(n[1],e).then(s=>{t(r=>({...r,build_error:s}))});break;case"staff/select":Er(n[1],e).then(s=>t(r=>({...r,staff_member:s})));break;case"staff/":Pr(n[1],e).then(s=>t(r=>({...r,staff:s})));break;case"services/":Cr(e).then(s=>t(r=>({...r,services:s})));break;case"available/save":t(s=>({...s,available:n[1].available}));break;case"omissions/save":t(s=>({...s,omissions:n[1].omissions}));break;default:const i=n[0];throw new Error(`Unhandled Auth message "${i}"`)}}function hr(n,t){return fetch(`/api/properties/${n.properties_id}`,{method:"PUT",headers:{"Content-Type":"application/json",...E.headers(t)},body:JSON.stringify(n.property)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function pr(n,t){return fetch(`/api/properties/${n.properties_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Property:",e),e})}function ur(n,t){let e="/api/properties";if(n.filter_status_ids&&n.filter_status_ids.length>0){const i=n.filter_status_ids.map(s=>`filter_status_id=${s}`).join("&");e+=`?${i}`}return fetch(e,{headers:E.headers(t)}).then(i=>{if(i.status===200)return i.json()}).then(i=>{if(i)return console.log("Properties:",i),i})}function fr(n,t){return fetch(`/api/roles/${n.role_id}`,{method:"PUT",headers:{"Content-Type":"application/json",...E.headers(t)},body:JSON.stringify(n.role)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function mr(n,t){return fetch(`/api/roles/${n.role_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Role:",e),e})}function gr(n){return fetch("/api/roles",{headers:E.headers(n)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Roles:",t),t})}function vr(n,t){return fetch(`/api/appointments/${n.appointment_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Appointment:",e),e})}function br(n,t){let e=`/api/appointments?from_service_date=${n.from_service_date}&to_service_date=${n.to_service_date}`;if(n.per_page&&(e+=`&per_page=${n.per_page}`),n.page&&(e+=`&page=${n.page}`),n.filter_status_ids&&n.filter_status_ids.length>0){const i=n.filter_status_ids.map(s=>`filter_status_id=${s}`).join("&");e+=`&${i}`}if(n.filter_service_ids&&n.filter_service_ids.length>0){const i=n.filter_service_ids.map(s=>`filter_service_id=${s}`).join("&");e+=`&${i}`}return fetch(e,{headers:E.headers(t)}).then(i=>{if(i.status===200)return i.json()}).then(i=>{if(i)return console.log("Appointments:",i),i})}function it(n,t){return fetch(`/api/plans/${n.plan_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Plan:",e),e})}function _r(n,t){let e=`/api/plans?from_plan_date=${n.from_plan_date}`;return n.to_plan_date&&(e+=`&to_plan_date=${n.to_plan_date}`),n.per_page&&(e+=`&per_page=${n.per_page}`),n.page&&(e+=`&page=${n.page}`),fetch(e,{headers:E.headers(t)}).then(i=>{if(i.status===200)return i.json()}).then(i=>{if(i)return console.log("Plans:",i),i})}function yr(n,t){return fetch(`/api/plans/${n.plan_id}/staff/${n.user_id}`,{method:"POST",headers:E.headers(t)}).then(e=>e.status===204?it(n,t):e.status===400?e.json():void 0).then(e=>{if(e){const i=e;return i.details&&(i.details==="REPEATED_ACTION"||i.details==="IMMUTABLE")?it(n,t):void 0}})}function $r(n,t){return fetch(`/api/plans/${n.plan_id}/staff/${n.user_id}`,{method:"DELETE",headers:E.headers(t)}).then(e=>{if(e.status===204)return it(n,t)})}function wr(n,t){return fetch(`/api/plans/${n.plan_id}/appointment/${n.appointment_id}`,{method:"POST",headers:E.headers(t)}).then(e=>e.status===204?it(n,t):e.status===400?e.json():void 0).then(e=>{if(e){const i=e;return i.details&&(i.details==="REPEATED_ACTION"||i.details==="IMMUTABLE")?it(n,t):void 0}})}function xr(n,t){return fetch(`/api/plans/${n.plan_id}/appointment/${n.appointment_id}`,{method:"DELETE",headers:E.headers(t)}).then(e=>{if(e.status===204)return it(n,t)})}function Sr(n,t){return fetch(`/api/plans/build/${n.plan_date}`,{method:"POST",headers:{"Content-Type":"application/json",...E.headers(t)},body:JSON.stringify(n.build_options)}).then(e=>{if(e.status===400)return e.json()}).then(e=>{if(e){const i=e;return i.details?i:void 0}})}function kr(n,t){return fetch(`/api/plans/send/${n.plan_date}`,{method:"POST",headers:E.headers(t)}).then(e=>{if(e.status===400)return e.json()}).then(e=>{if(e){const i=e;return i.details?i:void 0}})}function Ar(n,t){return fetch(`/api/plans/add/${n.plan_date}`,{method:"POST",headers:E.headers(t)}).then(e=>{if(e.status===400)return e.json()}).then(e=>{if(e){const i=e;return i.details?i:void 0}})}function Er(n,t){return fetch(`/api/staff/${n.user_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Staff Member:",e),e})}function Pr(n,t){let e="/api/staff";if(n.filter_status_ids&&n.filter_status_ids.length>0){const i=n.filter_status_ids.map(s=>`filter_status_id=${s}`).join("&");e+=`?${i}`,n.filter_can_clean&&(e+="&filter_can_clean=true")}else n.filter_can_clean&&(e+="?filter_can_clean=true");return fetch(e,{headers:E.headers(t)}).then(i=>{if(i.status===200)return i.json()}).then(i=>{if(i)return console.log("Staff:",i),i})}function Cr(n){return fetch("/api/services",{headers:E.headers(n)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Services:",t),t})}class Ct extends Error{}Ct.prototype.name="InvalidTokenError";function Or(n){return decodeURIComponent(atob(n).replace(/(.)/g,(t,e)=>{let i=e.charCodeAt(0).toString(16).toUpperCase();return i.length<2&&(i="0"+i),"%"+i}))}function zr(n){let t=n.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Or(t)}catch{return atob(t)}}function Tr(n,t){if(typeof n!="string")throw new Ct("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,i=n.split(".")[e];if(typeof i!="string")throw new Ct(`Invalid token specified: missing part #${e+1}`);let s;try{s=zr(i)}catch(r){throw new Ct(`Invalid token specified: invalid base64 for part #${e+1} (${r.message})`)}try{return JSON.parse(s)}catch(r){throw new Ct(`Invalid token specified: invalid json for part #${e+1} (${r.message})`)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rr={attribute:!0,type:String,converter:ne,reflect:!1,hasChanged:qe},Ur=(n=Rr,t,e)=>{const{kind:i,metadata:s}=e;let r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),r.set(e.name,n),i==="accessor"){const{name:o}=e;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(o,l,n)},init(a){return a!==void 0&&this.P(o,void 0,n),a}}}if(i==="setter"){const{name:o}=e;return function(a){const l=this[o];t.call(this,a),this.requestUpdate(o,l,n)}}throw Error("Unsupported decorator location: "+i)};function D(n){return(t,e)=>typeof e=="object"?Ur(n,t,e):((i,s,r)=>{const o=s.hasOwnProperty(r);return s.constructor.createProperty(r,o?{...i,wrapped:!0}:i),o?Object.getOwnPropertyDescriptor(s,r):void 0})(n,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $(n){return D({...n,state:!0,attribute:!1})}var Ir=Object.defineProperty,Mr=(n,t,e,i)=>{for(var s=void 0,r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=o(t,e,s)||s);return s&&Ir(t,e,s),s};const We=class We extends q{constructor(){super(...arguments),this.display_name="Status: 401",this._authObserver=new Bt(this,"acorn:auth")}displayNameTemplate(){return this.display_name==="Status: 401"||this.display_name==="Status: 403"?m`<span>Please <a href="/login.html?next=${window.location.href}" style="color: var(--text-color-link);" @click=${Ts}>login</a></span>`:this.display_name===""?m`<span>Hello, user</span>`:m`<span>${this.display_name}</span>`}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{const e=t;if(e&&e.token){const i=Tr(e.token);i&&(this.display_name=i.user_metadata.display_name||"")}})}toggleDarkMode(t){this.classList.toggle("dark-mode"),Ft.relay(t,"dark-mode:toggle",{})}toggleActive(){this.classList.toggle("active")}render(){return m`
        <nav class="sidebar">
            <box-icon id="sidebar-btn" name='menu' color="var(--text-color-header)" size="var(--icon-size)" @click=${this.toggleActive} ></box-icon>
            <div class="top">
                <div class="logo">
                    <img src="/images/AcornArranger Logo.png" alt="AcornArranger Logo">
                    <span>AcornArranger</span>
                </div>
            </div>
            <div class="user">
                <box-icon name='user-circle' type='solid' color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
                ${this.displayNameTemplate()}
            </div>
            <ul class="menu-items">
                <li>
                    <a href="/app/appointments">
                        <box-icon name='calendar-alt' color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
                        <span class="nav-item">View Appointments</span>
                    </a>
                    <span class="tooltip">View Appointments</span>
                </li>
                <li>
                    <a href="/app/schedule">
                        <box-icon name='book-bookmark' type='solid' color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
                        <span class="nav-item">Schedule</span>
                    </a>
                    <span class="tooltip">Schedule</span>
                </li>
                <li>
                    <a href="/app/properties">
                        <box-icon name='edit-location' type='solid' color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
                        <span class="nav-item">Properties</span>
                    </a>
                    <span class="tooltip">Properties</span>
                </li>
                <li>
                    <a href="/app/staff">
                        <box-icon name='male' color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
                        <span class="nav-item">Staff</span>
                    </a>
                    <span class="tooltip">Staff</span>
                </li>
                <li>
                    <a href="/app/roles">
                        <box-icon name='hard-hat' type='solid' class="dark-mode-only" color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
                        <span class="nav-item">Staff Roles</span>
                    </a>
                    <span class="tooltip">Staff Roles</span>
                </li>
            </ul>
            <ul class="bottom">
                <li>
                    <a href="#" @click=${this.toggleDarkMode} >
                        <box-icon name='sun' type='solid' class="dark-mode-only" color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
                        <box-icon name='moon' type='solid' class="light-mode-only" color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
                        <span class="nav-item">Theme</span>
                    </a>
                    <span class="tooltip">Theme</span>
                </li>
                <li>
                    <a href="/login.html?next=${window.location.href}" @click=${Ts}>
                        <box-icon name='log-out' color="var(--text-color-header)" size="var(--icon-size)"></box-icon>
                        <span class="nav-item">Logout</span>
                    </a>
                    <span class="tooltip">Logout</span>
                </li>
            </ul>
        </nav>
    `}};We.styles=T`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    img {
        max-width: 100%;
    }

    a span {
        pointer-events: none;
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

    :host(.active) .sidebar {
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

    :host(.active) .sidebar #sidebar-btn {
        left: 87%;
    }

    .sidebar .top {
        padding: var(--spacing-size-small) var(--spacing-size-small);
        line-height: 1;
    }

    :host(.active) .sidebar .top {
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

    :host(.active) .sidebar .top .logo img {
        transform: translateY(- calc(var(--spacing-size-small) + var(--icon-size)));
    }

    :host(.active) .sidebar .top .logo * {
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

    .sidebar .user span {
        visibility: hidden;
        opacity: 0;
        transition-property: all;
        transition-duration: var(--transition-duration-sidebar);
        transition-timing-function: step-start;
        transition-delay: 0s;
    }

    :host(.active) .sidebar .user span {
        visibility: visible;
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

    .sidebar box-icon:not(#sidebar-btn) {
        padding: 0 var(--spacing-size-small);
    }

    .sidebar .nav-item {
        visibility: hidden;
        opacity: 0;
        transition-property: all;
        transition-duration: var(--transition-duration-sidebar);
        transition-timing-function: step-start;
        transition-delay: 0s;
    }

    :host(.active) .sidebar .nav-item {
        visibility: visible;
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
        opacity: 0;
        visibility: hidden;
    }

    .sidebar ul li a:hover ~ .tooltip {
        opacity: 1;
        visibility: visible;
    }

    :host(.active) .sidebar ul li a:hover ~ .tooltip {
        display: none;
    }

    .bottom {
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
        opacity: 0;
        display: none;
    }

    :host(.dark-mode) .dark-mode-only {
        opacity: 1;
        display: initial;
    }

    :host .light-mode-only {
        opacity: 1;
        display: initial;
    }

    :host(.dark-mode) .light-mode-only {
        opacity: 0;
        display: none;
    }   
  `;let oe=We;Mr([D({attribute:!1})],oe.prototype,"display_name");function Ts(n){Ft.relay(n,"auth:message",["auth/signout"])}wt({"restful-form":Me.FormElement});class Nr extends q{render(){return m`
      <restful-form new src="/auth/login">
        <slot></slot>
      </restful-form>
    `}get next(){return new URLSearchParams(document.location.search).get("next")}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:i}={token:e.created.session.access_token},s=this.next||"/";console.log("Login successful",e,s),Ft.relay(t,"auth:message",["auth/signin",{token:i,redirect:s}])})}}wt({"restful-form":Me.FormElement});class jr extends q{render(){return m`
      <restful-form new src="/auth/signup">
        <slot></slot>
      </restful-form>
    `}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:i}={token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxa2NneGZhcWhwcXJ5dGNpeHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAyNzU3ODQsImV4cCI6MjAyNTg1MTc4NH0.f2OUbu37RF-NMV1iSj16rBOgmcarmjnntUMNGLZm7Xc"},s="/";console.log("Signup successful",e,s),Ft.relay(t,"auth:message",["auth/signin",{token:i,redirect:s}])})}}const N=T`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
img {
  max-width: 100%;
}
`,j=T`
.page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.page main {
    padding: var(--spacing-size-large) var(--spacing-size-xxlarge);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: fit-content;
    gap: var(--spacing-size-medium);
}

.page header:first-of-type {
    height: var(--page-header-height);
}

.page main:first-of-type {
    border-radius: var(--border-size-radius);
    height: calc(100vh - var(--page-header-height));
    overflow: scroll;
}

.dark-mode-only {
    display: none;
}

.dark-mode .dark-mode-only {
    display: contents;
}

.light-mode-only {
    display: contents;
}

.dark-mode .light-mode-only {
    display: none;
} 

header {
    color: var(--text-color-header);
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: var(--background-color-header);
    line-height: 1;
    padding: var(--spacing-size-small);
    width: 100%;
}

header img {
    width: auto;
    height: auto;
    max-width: calc(var(--text-font-size-xxlarge) + 1rem);
    max-height: calc(var(--text-font-size-xxlarge) + 1rem);
}

h1 { 
    font-size: var(--text-font-size-xxlarge);
    font-family: var(--text-font-family-display);
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
}

h2 { 
    font-size: var(--text-font-size-xxlarge); 
}

h3 { font-size: var(--text-font-size-xlarge); }

h4 { font-size: var(--text-font-size-large); }

h5 { font-size: var(--text-font-size-medium); }

h6 { font-size: var(--text-font-size-body); }

h2, h3, h4, h5, h6 {
    font-family: var(--text-font-family-display);
    font-optical-sizing: auto;
    font-weight: var(--text-font-weight-light);
    font-style: normal;
}

a {
    color: var(--text-color-link);
}

.spread-apart {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.align-left {
    display: flex;
    justify-content: flex-start;
    width: 100%;
}

.multi-select {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-size-small);
}

.multi-select ul {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-size-xsmall);
    padding-top: var(--spacing-size-small);
    border-top: 1px solid currentColor;
    width: 100%;
}

.multi-select ul li {
    width: max-content;
    background-color: var(--background-color);
    border-radius: var(--border-size-radius);
    padding: 0 var(--spacing-size-small);
}

menu.table-menu {
    background-color: var(--background-color-accent);
    border-radius: var(--border-size-radius);
    list-style-type: none;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: var(--spacing-size-small) var(--spacing-size-medium);
    gap: var(--spacing-size-medium);
    width: 100%;
}

menu.table-menu > div > label {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

.table-menu .filters {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-content: space-between;
    justify-content: flex-start;
    overflow-y: auto;
    max-height: calc(var(--text-font-size-large) * 5.5);
    min-width: calc(var(--text-font-size-large) * 7);
    background-color: var(--background-color);
    padding: var(--spacing-size-xsmall) var(--spacing-size-small);
}

.table-menu .filters::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
}

.table-menu .filters::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .5);
    box-shadow: 0 0 1px var(--background-color-accent);
}

section.showing {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    background-color: var(--background-color-accent);
    border-radius: var(--border-size-radius);
    padding: var(--spacing-size-small) var(--spacing-size-medium);
    width: 100%;
    gap: var(--spacing-size-medium);
}

section.showing div {
    display: flex;
    align-items: baseline;
    justify-content: space-evenly;
    gap: var(--spacing-size-medium);
}

section.showing .page-selector {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: var(--spacing-size-small);
}

section.showing .page-selector * {
    border-radius: var(--border-size-radius);
    width: var(--icon-size);
    height: var(--icon-size);
    display: flex;
    align-items: center;
    justify-content: center;
}

section.showing .page-selector .highlight {
    background-color: var(--background-color);
    cursor: default;
}

section.showing div label {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-size-small);
}

section.showing button {
    background-color: var(--background-color-accent);
}

section.showing button:hover {
    background-color: var(--background-color); 
}

.in-bubble {
    background-color: var(--accent-color);
    border-radius: 50%;
    line-height: 1;
    padding: var(--spacing-size-xsmall);
    font-size: var(--text-font-size-small);
    color: var(--text-color-header);
}

table {
    /* margin: var(--spacing-size-medium); */
    width: 100%;
    border-collapse: collapse;
    background-color: var(--background-color-accent);
    /* border: 2px solid; 
    border-color: var(--accent-color); */
    border-radius: var(--border-size-radius);
}

th, td {
    border: 1px solid var(--background-color);
}

th {
    font-weight: var(--text-font-weight-bold);
    padding: var(--spacing-size-small) var(--spacing-size-medium);
}

td {
    padding: var(--spacing-size-small) var(--spacing-size-small);
}

td.center {
    text-align: center;
}

dt {
    color: var(--accent-color);
    margin-bottom: var(--spacing-size-xsmall);
}

dd {
    margin-bottom: var(--spacing-size-medium);
    margin-left: var(--spacing-size-xxlarge);
    margin-right: var(--spacing-size-xxlarge);
    padding-left: var(--spacing-size-small);
    border-left: 1px solid var(--accent-color);
}

button {
    display: flex;
    align-items: center;
    gap: var(--spacing-size-small);
    border-radius: var(--border-size-radius);
    background-color: var(--background-color-accent);
    color: var(--text-color-body);
    border: none;
    font-size: var(--text-font-size-body);
    padding: var(--spacing-size-small);
}

button:hover {
    background-color: var(--background-color-dark); 
    cursor: pointer;
}

button * {
    padding: 0;
}

strong {
    font-weight: var(--text-font-weight-bold);
}

em {
    font-family: var(--text-font-family-body);
    font-weight: var(--text-font-weight-body);
    font-style: italic;
}

/* Mono */
.roboto-mono-code-snippet {
    font-family: Roboto Mono, Consolas, monaco, monospace;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
}

/* Body Text */
.roboto-regular {
    font-family: Roboto, Arial, Helvetica Neue, Helvetica, sans-serif;
    font-weight: 400;
    font-style: normal;
}
  
.roboto-medium {
    font-family: Roboto, Arial, Helvetica Neue, Helvetica, sans-serif;
    font-weight: 500;
    font-style: normal;
}

.roboto-regular-italic {
    font-family: Roboto, Arial, Helvetica Neue, Helvetica, sans-serif;
    font-weight: 400;
    font-style: italic;
}

/* Display Text */
.roboto-slab-main-title {
    font-family: Roboto Slab, Rockwell, Georgia, Times, Times New Roman, serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
} 

.roboto-slab-title {
    font-family: Roboto Slab, Rockwell, Georgia, Times, Times New Roman, serif;
    font-optical-sizing: auto;
    font-weight: 300;
    font-style: normal;
} 
`;var Lr={exports:{}};(function(n,t){(function(e,i,s,r,o){if("customElements"in s)o();else{if(s.AWAITING_WEB_COMPONENTS_POLYFILL)return void s.AWAITING_WEB_COMPONENTS_POLYFILL.then(o);var a=s.AWAITING_WEB_COMPONENTS_POLYFILL=f();a.then(o);var l=s.WEB_COMPONENTS_POLYFILL||"//cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.0.2/webcomponents-bundle.js",u=s.ES6_CORE_POLYFILL||"//cdnjs.cloudflare.com/ajax/libs/core-js/2.5.3/core.min.js";"Promise"in s?h(l).then(function(){a.isDone=!0,a.exec()}):h(u).then(function(){h(l).then(function(){a.isDone=!0,a.exec()})})}function f(){var c=[];return c.isDone=!1,c.exec=function(){c.splice(0).forEach(function(d){d()})},c.then=function(d){return c.isDone?d():c.push(d),c},c}function h(c){var d=f(),p=r.createElement("script");return p.type="text/javascript",p.readyState?p.onreadystatechange=function(){p.readyState!="loaded"&&p.readyState!="complete"||(p.onreadystatechange=null,d.isDone=!0,d.exec())}:p.onload=function(){d.isDone=!0,d.exec()},p.src=c,r.getElementsByTagName("head")[0].appendChild(p),p.then=d.then,p}})(0,0,window,document,function(){var e;e=function(){return function(i){var s={};function r(o){if(s[o])return s[o].exports;var a=s[o]={i:o,l:!1,exports:{}};return i[o].call(a.exports,a,a.exports,r),a.l=!0,a.exports}return r.m=i,r.c=s,r.d=function(o,a,l){r.o(o,a)||Object.defineProperty(o,a,{enumerable:!0,get:l})},r.r=function(o){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(o,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(o,"__esModule",{value:!0})},r.t=function(o,a){if(1&a&&(o=r(o)),8&a||4&a&&typeof o=="object"&&o&&o.__esModule)return o;var l=Object.create(null);if(r.r(l),Object.defineProperty(l,"default",{enumerable:!0,value:o}),2&a&&typeof o!="string")for(var u in o)r.d(l,u,(function(f){return o[f]}).bind(null,u));return l},r.n=function(o){var a=o&&o.__esModule?function(){return o.default}:function(){return o};return r.d(a,"a",a),a},r.o=function(o,a){return Object.prototype.hasOwnProperty.call(o,a)},r.p="",r(r.s=5)}([function(i,s){i.exports=function(r){var o=[];return o.toString=function(){return this.map(function(a){var l=function(u,f){var h,c=u[1]||"",d=u[3];if(!d)return c;if(f&&typeof btoa=="function"){var p=(h=d,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(h))))+" */"),v=d.sources.map(function(b){return"/*# sourceURL="+d.sourceRoot+b+" */"});return[c].concat(v).concat([p]).join(`
`)}return[c].join(`
`)}(a,r);return a[2]?"@media "+a[2]+"{"+l+"}":l}).join("")},o.i=function(a,l){typeof a=="string"&&(a=[[null,a,""]]);for(var u={},f=0;f<this.length;f++){var h=this[f][0];typeof h=="number"&&(u[h]=!0)}for(f=0;f<a.length;f++){var c=a[f];typeof c[0]=="number"&&u[c[0]]||(l&&!c[2]?c[2]=l:l&&(c[2]="("+c[2]+") and ("+l+")"),o.push(c))}},o}},function(i,s,r){var o=r(3);i.exports=typeof o=="string"?o:o.toString()},function(i,s,r){var o=r(4);i.exports=typeof o=="string"?o:o.toString()},function(i,s,r){(i.exports=r(0)(!1)).push([i.i,"@-webkit-keyframes spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@keyframes spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@-webkit-keyframes burst{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}90%{-webkit-transform:scale(1.5);transform:scale(1.5);opacity:0}}@keyframes burst{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}90%{-webkit-transform:scale(1.5);transform:scale(1.5);opacity:0}}@-webkit-keyframes flashing{0%{opacity:1}45%{opacity:0}90%{opacity:1}}@keyframes flashing{0%{opacity:1}45%{opacity:0}90%{opacity:1}}@-webkit-keyframes fade-left{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(-20px);transform:translateX(-20px);opacity:0}}@keyframes fade-left{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(-20px);transform:translateX(-20px);opacity:0}}@-webkit-keyframes fade-right{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(20px);transform:translateX(20px);opacity:0}}@keyframes fade-right{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(20px);transform:translateX(20px);opacity:0}}@-webkit-keyframes fade-up{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(-20px);transform:translateY(-20px);opacity:0}}@keyframes fade-up{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(-20px);transform:translateY(-20px);opacity:0}}@-webkit-keyframes fade-down{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(20px);transform:translateY(20px);opacity:0}}@keyframes fade-down{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(20px);transform:translateY(20px);opacity:0}}@-webkit-keyframes tada{0%{-webkit-transform:scaleX(1);transform:scaleX(1)}10%,20%{-webkit-transform:scale3d(.95,.95,.95) rotate(-10deg);transform:scale3d(.95,.95,.95) rotate(-10deg)}30%,50%,70%,90%{-webkit-transform:scaleX(1) rotate(10deg);transform:scaleX(1) rotate(10deg)}40%,60%,80%{-webkit-transform:scaleX(1) rotate(-10deg);transform:scaleX(1) rotate(-10deg)}to{-webkit-transform:scaleX(1);transform:scaleX(1)}}@keyframes tada{0%{-webkit-transform:scaleX(1);transform:scaleX(1)}10%,20%{-webkit-transform:scale3d(.95,.95,.95) rotate(-10deg);transform:scale3d(.95,.95,.95) rotate(-10deg)}30%,50%,70%,90%{-webkit-transform:scaleX(1) rotate(10deg);transform:scaleX(1) rotate(10deg)}40%,60%,80%{-webkit-transform:rotate(-10deg);transform:rotate(-10deg)}to{-webkit-transform:scaleX(1);transform:scaleX(1)}}.bx-spin,.bx-spin-hover:hover{-webkit-animation:spin 2s linear infinite;animation:spin 2s linear infinite}.bx-tada,.bx-tada-hover:hover{-webkit-animation:tada 1.5s ease infinite;animation:tada 1.5s ease infinite}.bx-flashing,.bx-flashing-hover:hover{-webkit-animation:flashing 1.5s infinite linear;animation:flashing 1.5s infinite linear}.bx-burst,.bx-burst-hover:hover{-webkit-animation:burst 1.5s infinite linear;animation:burst 1.5s infinite linear}.bx-fade-up,.bx-fade-up-hover:hover{-webkit-animation:fade-up 1.5s infinite linear;animation:fade-up 1.5s infinite linear}.bx-fade-down,.bx-fade-down-hover:hover{-webkit-animation:fade-down 1.5s infinite linear;animation:fade-down 1.5s infinite linear}.bx-fade-left,.bx-fade-left-hover:hover{-webkit-animation:fade-left 1.5s infinite linear;animation:fade-left 1.5s infinite linear}.bx-fade-right,.bx-fade-right-hover:hover{-webkit-animation:fade-right 1.5s infinite linear;animation:fade-right 1.5s infinite linear}",""])},function(i,s,r){(i.exports=r(0)(!1)).push([i.i,'.bx-rotate-90{transform:rotate(90deg);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)"}.bx-rotate-180{transform:rotate(180deg);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)"}.bx-rotate-270{transform:rotate(270deg);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)"}.bx-flip-horizontal{transform:scaleX(-1);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)"}.bx-flip-vertical{transform:scaleY(-1);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)"}',""])},function(i,s,r){r.r(s),r.d(s,"BoxIconElement",function(){return St});var o,a,l,u,f=r(1),h=r.n(f),c=r(2),d=r.n(c),p=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(k){return typeof k}:function(k){return k&&typeof Symbol=="function"&&k.constructor===Symbol&&k!==Symbol.prototype?"symbol":typeof k},v=function(){function k(A,g){for(var _=0;_<g.length;_++){var y=g[_];y.enumerable=y.enumerable||!1,y.configurable=!0,"value"in y&&(y.writable=!0),Object.defineProperty(A,y.key,y)}}return function(A,g,_){return g&&k(A.prototype,g),_&&k(A,_),A}}(),b=(a=(o=Object).getPrototypeOf||function(k){return k.__proto__},l=o.setPrototypeOf||function(k,A){return k.__proto__=A,k},u=(typeof Reflect>"u"?"undefined":p(Reflect))==="object"?Reflect.construct:function(k,A,g){var _,y=[null];return y.push.apply(y,A),_=k.bind.apply(k,y),l(new _,g.prototype)},function(k){var A=a(k);return l(k,l(function(){return u(A,arguments,a(this).constructor)},A))}),S=window,G={},z=document.createElement("template"),nt=function(){return!!S.ShadyCSS};z.innerHTML=`
<style>
:host {
  display: inline-block;
  font-size: initial;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
}
:host([size=xs]) {
    width: 0.8rem;
    height: 0.8rem;
}
:host([size=sm]) {
    width: 1.55rem;
    height: 1.55rem;
}
:host([size=md]) {
    width: 2.25rem;
    height: 2.25rem;
}
:host([size=lg]) {
    width: 3.0rem;
    height: 3.0rem;
}

:host([size]:not([size=""]):not([size=xs]):not([size=sm]):not([size=md]):not([size=lg])) {
    width: auto;
    height: auto;
}
:host([pull=left]) #icon {
    float: left;
    margin-right: .3em!important;
}
:host([pull=right]) #icon {
    float: right;
    margin-left: .3em!important;
}
:host([border=square]) #icon {
    padding: .25em;
    border: .07em solid rgba(0,0,0,.1);
    border-radius: .25em;
}
:host([border=circle]) #icon {
    padding: .25em;
    border: .07em solid rgba(0,0,0,.1);
    border-radius: 50%;
}
#icon,
svg {
  width: 100%;
  height: 100%;
}
#icon {
    box-sizing: border-box;
} 
`+h.a+`
`+d.a+`
</style>
<div id="icon"></div>`;var St=b(function(k){function A(){(function(_,y){if(!(_ instanceof y))throw new TypeError("Cannot call a class as a function")})(this,A);var g=function(_,y){if(!_)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!y||typeof y!="object"&&typeof y!="function"?_:y}(this,(A.__proto__||Object.getPrototypeOf(A)).call(this));return g.$ui=g.attachShadow({mode:"open"}),g.$ui.appendChild(g.ownerDocument.importNode(z.content,!0)),nt()&&S.ShadyCSS.styleElement(g),g._state={$iconHolder:g.$ui.getElementById("icon"),type:g.getAttribute("type")},g}return function(g,_){if(typeof _!="function"&&_!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof _);g.prototype=Object.create(_&&_.prototype,{constructor:{value:g,enumerable:!1,writable:!0,configurable:!0}}),_&&(Object.setPrototypeOf?Object.setPrototypeOf(g,_):g.__proto__=_)}(A,HTMLElement),v(A,null,[{key:"getIconSvg",value:function(g,_){var y=this.cdnUrl+"/regular/bx-"+g+".svg";return _==="solid"?y=this.cdnUrl+"/solid/bxs-"+g+".svg":_==="logo"&&(y=this.cdnUrl+"/logos/bxl-"+g+".svg"),y&&G[y]||(G[y]=new Promise(function(U,I){var F=new XMLHttpRequest;F.addEventListener("load",function(){this.status<200||this.status>=300?I(new Error(this.status+" "+this.responseText)):U(this.responseText)}),F.onerror=I,F.onabort=I,F.open("GET",y),F.send()})),G[y]}},{key:"define",value:function(g){g=g||this.tagName,nt()&&S.ShadyCSS.prepareTemplate(z,g),customElements.define(g,this)}},{key:"cdnUrl",get:function(){return"//unpkg.com/boxicons@2.1.4/svg"}},{key:"tagName",get:function(){return"box-icon"}},{key:"observedAttributes",get:function(){return["type","name","color","size","rotate","flip","animation","border","pull"]}}]),v(A,[{key:"attributeChangedCallback",value:function(g,_,y){var U=this._state.$iconHolder;switch(g){case"type":(function(I,F,x){var w=I._state;w.$iconHolder.textContent="",w.type&&(w.type=null),w.type=!x||x!=="solid"&&x!=="logo"?"regular":x,w.currentName!==void 0&&I.constructor.getIconSvg(w.currentName,w.type).then(function(P){w.type===x&&(w.$iconHolder.innerHTML=P)}).catch(function(P){console.error("Failed to load icon: "+w.currentName+`
`+P)})})(this,0,y);break;case"name":(function(I,F,x){var w=I._state;w.currentName=x,w.$iconHolder.textContent="",x&&w.type!==void 0&&I.constructor.getIconSvg(x,w.type).then(function(P){w.currentName===x&&(w.$iconHolder.innerHTML=P)}).catch(function(P){console.error("Failed to load icon: "+x+`
`+P)})})(this,0,y);break;case"color":U.style.fill=y||"";break;case"size":(function(I,F,x){var w=I._state;w.size&&(w.$iconHolder.style.width=w.$iconHolder.style.height="",w.size=w.sizeType=null),x&&!/^(xs|sm|md|lg)$/.test(w.size)&&(w.size=x.trim(),w.$iconHolder.style.width=w.$iconHolder.style.height=w.size)})(this,0,y);break;case"rotate":_&&U.classList.remove("bx-rotate-"+_),y&&U.classList.add("bx-rotate-"+y);break;case"flip":_&&U.classList.remove("bx-flip-"+_),y&&U.classList.add("bx-flip-"+y);break;case"animation":_&&U.classList.remove("bx-"+_),y&&U.classList.add("bx-"+y)}}},{key:"connectedCallback",value:function(){nt()&&S.ShadyCSS.styleElement(this)}}]),A}());s.default=St,St.define()}])},n.exports=e()})})(Lr);const Je=class Je extends H{constructor(){super("acorn:model")}render(){return m`
        <div class="page">
            <header>
                <h1>
                    AcornArranger
                </h1>
            </header>
            <main>
                <div class="logo">
                    <img src="../images/AcornArranger Logo.png" alt="AcornArranger Logo">
                </div>
                <nav>
                    <h2>
                    Welcome!
                    </h2>
                    <a href="/login.html?next=/app/appointments" @click=${xe}>
                        <box-icon name='log-in' color="var(--text-color-body)" ></box-icon>
                        <span>Login</span>
                    </a>
                </nav>
                <section>
                    <h4>
                        Returning user?
                    </h4>
                    <p>
                        Feel free to <a href="/login.html?next=/app/appointments" @click=${xe}>login</a>
                    </p>
                </section>
                <section>
                    <h4>
                        New to AcornArranger?
                    </h4>
                    <p>
                        If you are new here, please <a href="/login.html?next=/app/appointments" @click=${xe}>create an account</a> and request access from your administrator.
                    </p>
                </section>
                <section>
                    <h4>
                        Just made an account?
                    </h4>
                    <p>
                        Check your email to verify your account before you login and contact your administrator to gain access.
                    </p><p>
                        You may not see any data on content pages until the administrator has activated your account.
                    </p>
                </section>
            </main>
        </div>
    `}};Je.styles=[N,j,T`
            .logo {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .logo img {
                width: var(--logo-size-medium);
                height: var(--logo-size-medium);
            }

            nav {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
            }

            h2 {
                width: min-content;
            }

            h2 + a {
                display: flex;
                align-items: center;
                text-decoration: none;
                color: var(--text-color-body);
                border-radius: var(--border-size-radius);
                height: calc(var(--icon-size) + 1rem);
                padding: var(--spacing-size-small) var(--spacing-size-small);
                background-color: var(--background-color-accent);
            }

            h2 + a:hover {
                background-color: var(--background-color-dark);
            }
            
            h2 + a i {
                pointer-events: none;
            }

            h2 +  a span{
                padding-left: var(--spacing-size-small);
                font-size: var(--text-font-size-large); 
                pointer-events: none;
            }


            section {
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
                margin-bottom: var(--spacing-size-medium);
                padding: var(--spacing-size-medium);
                width: 100%;
            }

            h4 {
                border-bottom: 1px solid currentColor;
                padding-left: var(--spacing-size-medium);
                padding-bottom: var(--spacing-size-small);
                padding-top: 0;
                padding-right: 0;
                margin-bottom: var(--spacing-size-small)
            }

            p {
                padding: var(--spacing-size-small) var(--spacing-size-large);
            }
        `];let Ce=Je;function xe(n){Ft.relay(n,"auth:message",["auth/signout"])}var Dr=Object.defineProperty,Hr=Object.getOwnPropertyDescriptor,Be=(n,t,e,i)=>{for(var s=i>1?void 0:i?Hr(t,e):t,r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=(i?o(t,e,s):o(s))||s);return i&&s&&Dr(t,e,s),s};const Fr=[{id:1,label:"Active"},{id:2,label:"Inactive"},{id:3,label:"Unverified"}],Ve=class Ve extends H{constructor(){super("acorn:model"),this.filter_status_ids=[1,3]}get staff(){return this.model.staff}get showing_total(){return this.staff?this.staff.length:0}connectedCallback(){super.connectedCallback(),this.updateStaff()}updateStaff(){this.dispatchMessage(["staff/",{filter_status_ids:this.filter_status_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateStaff()}handleInputChange(t){const e=t.target,{name:i,value:s,type:r}=e;r==="checkbox"?this.handleCheckboxChange(t):this[i]=s}handleCheckboxChange(t){const e=t.target,{name:i}=e,s=i,r=parseInt(e.value);switch(s){case"staff_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,r]:this.filter_status_ids=this.filter_status_ids.filter(a=>a!==r);break;default:const o=s;throw new Error(`Unhandled Auth message "${o}"`)}}render(){const t=(s,r)=>{var o;switch(r){case"staff_status":o=this.filter_status_ids;break;default:const a=r;throw new Error(`Unhandled Auth message "${a}"`)}return m`
            <label>
            <input
                name=${r}
                type="checkbox"
                .value=${s.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${o.includes(s.id)}
            />
            ${s.label}
            </label>
        `},e=s=>{var r,o;return m`
            <tr>
                <td class="center">
                    <span>
                    ${s.user_id}
                    </span>
                </td>
                <td>
                    <span>
                    ${s.name}
                    </span>
                </td>
                <td>
                    <span>
                    ${(r=s.role)==null?void 0:r.title}
                    </span>
                </td>
                <td class="center">
                    <span>
                    ${(o=s.status)==null?void 0:o.status}
                    </span>
                </td>
            </tr>
        `},i=this.staff||[];return m`
        <div class="page">
            <header>
                <h1>
                    Staff
                </h1>
            </header>
            <main>
                <menu class="table-menu">
                    <div>
                        <span>Status:</span>
                        <div class="filters">
                            ${Fr.map(s=>t(s,"staff_status"))}
                        </div>
                    </div>
                </menu>
                <section class="showing">
                    <p>Showing: </p><p class="in-bubble">${this.showing_total}</p>
                </section>
                <table>
                    <thead>
                        <tr>
                            <th>Staff ID</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${i.map(s=>e(s))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};Ve.styles=[N,j,T`
            
        `];let bt=Ve;Be([$()],bt.prototype,"staff",1);Be([$()],bt.prototype,"showing_total",1);Be([$()],bt.prototype,"filter_status_ids",2);function Rs(n){const t=new Date(n),e={month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0,timeZone:"UTC"};return new Intl.DateTimeFormat("en-US",e).format(t)}function qr(n){const t=new Date(n),e={month:"2-digit",day:"2-digit",year:"numeric"};return new Intl.DateTimeFormat("en-US",e).format(t)}function Oe(n){var t=r=>("0"+r).slice(-2),e=r=>("00"+r).slice(-3),i=n.getTimezoneOffset(),s=i>0?"-":"+";return i=Math.abs(i),n.getFullYear()+"-"+t(n.getMonth()+1)+"-"+t(n.getDate())+"T"+t(n.getHours())+":"+t(n.getMinutes())+":"+t(n.getSeconds())+"."+e(n.getMilliseconds())+s+t(i/60|0)+":"+t(i%60)}var Br=Object.defineProperty,Xr=Object.getOwnPropertyDescriptor,B=(n,t,e,i)=>{for(var s=i>1?void 0:i?Xr(t,e):t,r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=(i?o(t,e,s):o(s))||s);return i&&s&&Br(t,e,s),s};const Yr=[{id:1,label:"Unconfirmed"},{id:2,label:"Confirmed"},{id:3,label:"Completed"},{id:4,label:"Completed (Invoiced)"},{id:5,label:"Cancelled"}],Ge=class Ge extends H{constructor(){super("acorn:model"),this.from_service_date=Oe(new Date).split("T")[0],this.to_service_date=Oe(new Date).split("T")[0],this.per_page=50,this.page=1,this.filter_status_ids=[1,2,3,4],this.filter_service_ids=[21942,23044]}get appointments(){return this.model.appointments}get services(){return this.model.services}get showing_total(){return this.appointments?this.appointments.length:0}get service_options(){return this.services?this.services.map(t=>({id:t.service_id,label:t.service_name})):[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["services/",{}]),this.updateAppointments()}updateAppointments(){const t=new Date(this.from_service_date),e=new Date(this.to_service_date);t>e&&(this.to_service_date=this.from_service_date),this.dispatchMessage(["appointments/",{from_service_date:this.from_service_date,to_service_date:this.to_service_date,per_page:this.per_page,page:this.page-1,filter_status_ids:this.filter_status_ids,filter_service_ids:this.filter_service_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateAppointments()}handleInputChange(t){const e=t.target,{name:i,value:s,type:r}=e;r==="checkbox"?this.handleCheckboxChange(t):this[i]=s}handleCheckboxChange(t){const e=t.target,{name:i}=e,s=i,r=parseInt(e.value);switch(s){case"app_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,r]:this.filter_status_ids=this.filter_status_ids.filter(a=>a!==r);break;case"app_service":e.checked?this.filter_service_ids=[...this.filter_service_ids,r]:this.filter_service_ids=this.filter_service_ids.filter(a=>a!==r);break;default:const o=s;throw new Error(`Unhandled Auth message "${o}"`)}}previousPage(){this.page>1&&(this.page--,this.updateAppointments())}nextPage(){this.page++,this.updateAppointments()}render(){const t=(r,o)=>{var a;switch(o){case"app_status":a=this.filter_status_ids;break;case"app_service":a=this.filter_service_ids;break;default:const l=o;throw new Error(`Unhandled Auth message "${l}"`)}return m`
            <label>
            <input
                name=${o}
                type="checkbox"
                .value=${r.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${a.includes(r.id)}
            />
            ${r.label}
            </label>
        `},e=r=>m`
            <li>
                <span>${r.name}</span>
            </li>
        `,i=r=>{var o,a;return m`
            <tr>
                <td class="center">
                    <span>
                    ${r.appointment_id}
                    </span>
                </td>
                <td>
                    <span>
                    ${Rs(r.service_time)}
                    </span>
                </td>
                <td>
                    <span>
                    ${r.property_info.property_name}
                    </span>
                </td>
                <td>
                    <ul class="staff">
                        ${(o=r.staff)==null?void 0:o.map(l=>e(l.staff_info))}
                    </ul>
                </td>
                <td class="center">
                    <span>
                        ${r.turn_around?m`<box-icon name='revision' color="var(--text-color-body)" ></box-icon>`:m``}
                    </span>
                </td>
                <td>
                    <span>
                    ${Rs(r.next_arrival_time)}
                    </span>
                </td>
                <td>
                    <span>
                    ${r.service.service_name}
                    </span>
                </td>
                <td>
                    <span>
                    ${(a=r.status)==null?void 0:a.status}
                    </span>
                </td>
            </tr>
        `},s=this.appointments||[];return m`
        <div class="page">
            <header>
                <h1>
                    Appointments
                </h1>
            </header>
            <main>
                <menu class="table-menu">
                    <div>
                        <label>
                            <span>From Date:</span>
                            <input name="from_service_date" autocomplete="off" .value=${this.from_service_date} type="date" @input=${this.handleTableOptionChange} />
                        </label>
                    </div>
                    <div>
                        <label>
                            <span>To Date:</span>
                            <input name="to_service_date" autocomplete="off" .value=${this.to_service_date} type="date" @input=${this.handleTableOptionChange} />
                        </label>
                    </div>
                    <div>
                        <span>Status:</span>
                        <div class="filters">
                            ${Yr.map(r=>t(r,"app_status"))}
                        </div>
                    </div>
                    <div>
                        <span>Services:</span>
                        <div class="filters">
                            ${this.service_options.map(r=>t(r,"app_service"))}
                        </div>
                    </div>
                </menu>
                <section class="showing">
                    <div><p>Showing: </p><p class="in-bubble">${this.showing_total}</p></div>
                    <div>
                        <label>
                            <span>Show:</span>
                            <select name="per_page" .value=${this.per_page.toString()} @change=${this.handleTableOptionChange} >
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                            </select>
                        </label>
                        <div class="page-selector">
                            <span>Page:</span>
                            <button @click=${this.previousPage} ?disabled=${this.page===1}><box-icon name='chevron-left' type='solid' color="var(--text-color-body)"></box-icon></button>
                            <span class="highlight">${this.page}</span>
                            <button @click=${this.nextPage}><box-icon name='chevron-right' type='solid' color="var(--text-color-body)"></box-icon></button>
                        </div>
                    </div>
                </section>
                <table>
                    <thead>
                        <tr>
                            <th>Appointment ID</th>
                            <th>Service Time</th>
                            <th>Property</th>
                            <th>Staff</th>
                            <th>T/A</th>
                            <th>Next Arrival Time</th>
                            <th>Service</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${s.map(r=>i(r))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};Ge.styles=[N,j,T`
            ul.staff {
                list-style-type: none;
            }

            ul.staff li {
                width: max-content;
                background-color: var(--background-color);
                border-radius: var(--border-size-radius);
                margin-bottom: var(--spacing-size-xsmall);
                padding: 0 var(--spacing-size-small);
            }
        `];let M=Ge;B([$()],M.prototype,"appointments",1);B([$()],M.prototype,"services",1);B([$()],M.prototype,"showing_total",1);B([$()],M.prototype,"service_options",1);B([$()],M.prototype,"from_service_date",2);B([$()],M.prototype,"to_service_date",2);B([$()],M.prototype,"per_page",2);B([$()],M.prototype,"page",2);B([$()],M.prototype,"filter_status_ids",2);B([$()],M.prototype,"filter_service_ids",2);var Wr=Object.defineProperty,Jr=Object.getOwnPropertyDescriptor,bi=(n,t,e,i)=>{for(var s=Jr(t,e),r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=o(t,e,s)||s);return s&&Wr(t,e,s),s};const Ze=class Ze extends H{get roles(){return this.model.roles}get showing_total(){return this.roles?this.roles.length:0}constructor(){super("acorn:model")}connectedCallback(){super.connectedCallback(),this.updateRoles()}updateRoles(){this.dispatchMessage(["roles/",{}])}handleInputChange(t,e,i){const s=t.target;if(i==="priority")if(s.value)e[i]=parseInt(s.value);else return;else if(i==="can_lead_team"||i==="can_clean")e[i]=s.checked;else{if(i==="role_id")return;e[i]=s.value}this.dispatchMessage(["roles/save",{role_id:e.role_id,role:e}])}render(){const t=i=>m`
            <tr>
                <td class="center">
                    <input
                    type="number"
                    .value=${i.priority.toString()}
                    @input=${s=>this.handleInputChange(s,i,"priority")}
                    />
                </td>
                <td>
                    <span>
                        ${i.title}
                    </span>
                </td>
                <td class="center">
                    <input
                    type="checkbox"
                    .checked=${i.can_lead_team}
                    @change=${s=>this.handleInputChange(s,i,"can_lead_team")}
                    />
                </td>
                <td class="center">
                    <input
                    type="checkbox"
                    .checked=${i.can_clean}
                    @change=${s=>this.handleInputChange(s,i,"can_clean")}
                    />
                </td>
            </tr>
        `,e=this.roles||[];return m`
        <div class="page">
            <header>
                <h1>
                    Staff Roles
                </h1>
            </header>
            <main>
                <section class="showing">
                    <p>Showing: </p><p class="in-bubble">${this.showing_total}</p>
                </section>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <button @click=${this.updateRoles} alt="Sync Prorities">
                                        <box-icon name='sync' color="var(--text-color-body)" ></box-icon>
                                    </button>
                                    <span>
                                        Priority
                                    </span>
                                    <div class="not-shown">
                                        <box-icon name='sync' color="var(--text-color-body)" ></box-icon>
                                    </div>
                                </label>
                            </th>
                            <th>Role</th>
                            <th>Can Lead</th>
                            <th>Can Clean</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${e.map(i=>t(i))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};Ze.styles=[N,j,T`
            th label {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--spacing-size-medium);
            }

            th button {
                display: inline;
                margin: 0;
            }

            .not-shown {
                visibility: hidden;
            }
        `];let jt=Ze;bi([$()],jt.prototype,"roles");bi([$()],jt.prototype,"showing_total");var Vr=Object.defineProperty,Gr=Object.getOwnPropertyDescriptor,Xe=(n,t,e,i)=>{for(var s=i>1?void 0:i?Gr(t,e):t,r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=(i?o(t,e,s):o(s))||s);return i&&s&&Vr(t,e,s),s};const Zr=[{id:1,label:"Active"},{id:2,label:"Inactive"}];function Kr(n){const t=Math.floor(n/60),e=n%60;return!t&&!n?"":t?e&&t===1?`${t} Hour ${e} Minutes`:e?`${t} Hours ${e} Minutes`:t===1?`${t} Hour`:`${t} Hours`:`${e} Minutes`}const Ke=class Ke extends H{constructor(){super("acorn:model"),this.filter_status_ids=[1]}get properties(){return this.model.properties}get showing_total(){return this.properties?this.properties.length:0}connectedCallback(){super.connectedCallback(),this.updateProperties()}updateProperties(){this.dispatchMessage(["properties/",{filter_status_ids:this.filter_status_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateProperties()}handleInputChange(t){const e=t.target,{name:i,value:s,type:r}=e;r==="checkbox"?this.handleCheckboxChange(t):this[i]=s}handleCheckboxChange(t){const e=t.target,{name:i}=e,s=i,r=parseInt(e.value);switch(s){case"property_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,r]:this.filter_status_ids=this.filter_status_ids.filter(a=>a!==r);break;default:const o=s;throw new Error(`Unhandled Auth message "${o}"`)}}render(){const t=(r,o)=>{var a;switch(o){case"property_status":a=this.filter_status_ids;break;default:const l=o;throw new Error(`Unhandled Auth message "${l}"`)}return m`
            <label>
            <input
                name=${o}
                type="checkbox"
                .value=${r.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${a.includes(r.id)}
            />
            ${r.label}
            </label>
        `},e=r=>m`
            <li>
                <span>${r}</span>
            </li>
        `,i=r=>{var o,a;return m`
            <tr>
                <td class="center">
                    <a href="/app/property/${r.properties_id}">
                        <span>
                        ${r.properties_id}
                        </span>
                    </a>
                </td>
                <td>
                    <span>
                    ${r.property_name}
                    </span>
                </td>
                <td>
                    <span>
                    ${Kr(r.estimated_cleaning_mins)}
                    </span>
                </td>
                <td>
                    <ul>
                    ${(o=r.double_unit)==null?void 0:o.map(l=>e(l))}
                    </ul>
                </td>
                <td class="center">
                    <span>
                    ${(a=r.status)==null?void 0:a.status}
                    </span>
                </td>
                <td>
                    <a href="/app/property/${r.properties_id}/edit">
                        <box-icon name='edit-alt' type='solid' color="var(--text-color-body)" ></box-icon>
                    </a>
                </td>
            </tr>
        `},s=this.properties||[];return m`
        <div class="page">
            <header>
                <h1>
                    Properties
                </h1>
            </header>
            <main>
                <menu class="table-menu">
                    <div>
                        <span>Status:</span>
                        <div class="filters">
                            ${Zr.map(r=>t(r,"property_status"))}
                        </div>
                    </div>
                </menu>
                <section class="showing">
                    <p>Showing: </p><p class="in-bubble">${this.showing_total}</p>
                </section>
                <table>
                    <thead>
                        <tr>
                            <th>Propery ID</th>
                            <th>Name</th>
                            <th>Estimated Cleaning Time</th>
                            <th>Double Unit References</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    ${s.map(r=>i(r))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};Ke.styles=[N,j,T`
            ul {
                list-style-type: none;
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-size-xsmall);
                max-width: calc(var(--spacing-size-medium) * 16);
            }

            ul li {
                width: max-content;
                background-color: var(--background-color);
                border-radius: var(--border-size-radius);
                padding: 0 var(--spacing-size-small);
            }
        `];let _t=Ke;Xe([$()],_t.prototype,"properties",1);Xe([$()],_t.prototype,"showing_total",1);Xe([$()],_t.prototype,"filter_status_ids",2);var Qr=Object.defineProperty,to=Object.getOwnPropertyDescriptor,_i=(n,t,e,i)=>{for(var s=i>1?void 0:i?to(t,e):t,r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=(i?o(t,e,s):o(s))||s);return i&&s&&Qr(t,e,s),s};const Qe=class Qe extends H{get model_plan(){return this.model.plan}constructor(){super("acorn:model")}updated(t){super.updated(t);const e=this.model_plan;e&&(!this.plan||e.plan_id===this.plan.plan_id)&&(this.plan=e)}render(){if(!this.plan)return m`<section><p>Loading...</p></section>`;const t=i=>m`
            <li>
                <span>${i.name}</span>
            </li>
        `,e=i=>m`
            <li>
                <span>${i.property_info.property_name}</span>
            </li>
        `;return m`
        <section>
            <div>
                <p>ID: ${this.plan.plan_id}</p>
                <p>${qr(this.plan.plan_date)}</p>
            </div>
            <h4>Team ${this.plan.team}</h4>
            <h5>Staff</h5>
            <ul>
                ${this.plan.staff.map(i=>t(i.staff_info))}
            </ul>
            <h5>Appointments</h5>
            <ul>
                ${this.plan.appointments.map(i=>e(i.appointment_info))}
            </ul>
        </section>
    `}};Qe.styles=[N,j,T`
            section {
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
                padding: var(--spacing-size-small) var(--spacing-size-medium);
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                min-width: calc(var(--spacing-size-medium) * 20);
                width: fit-content;
            }

            ul {
                list-style-type: none;
                padding: var(--spacing-size-small);
            }

            ul li {
                width: max-content;
                background-color: var(--background-color);
                border-radius: var(--border-size-radius);
                margin-bottom: var(--spacing-size-xsmall);
                padding: 0 var(--spacing-size-small);
            }

            div {
                display: flex;
                justify-content: space-between;
                width: 100%;
            }

            p {
                font-size: var(--text-font-size-small);
            }

            h4, h5 {
                padding: 0;
                width: 100%;
            }

            h4 {
                text-align: center;
                border-bottom: 2px solid currentColor;
                padding-bottom: var(--spacing-size-small);
                line-height: 1;
            }

            h5 {
                border-bottom: 1px solid currentColor;
                line-height: 1.5;
            }
        `];let Lt=Qe;_i([$()],Lt.prototype,"model_plan",1);_i([D({attribute:!1})],Lt.prototype,"plan",2);var eo=Object.defineProperty,so=Object.getOwnPropertyDescriptor,Ye=(n,t,e,i)=>{for(var s=i>1?void 0:i?so(t,e):t,r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=(i?o(t,e,s):o(s))||s);return i&&s&&eo(t,e,s),s};const ts=class ts extends H{constructor(){super("acorn:model"),this.init_load=!0,this.available_staff=[]}get staff(){return this.init_load&&this.model.staff&&(this.init_load=!1,this.selectAll(),this.updateAvailable()),this.model.staff}get staff_options(){return this.staff?this.staff.map(t=>({id:t.user_id,label:t.name})):[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["staff/",{filter_status_ids:[1],filter_can_clean:!0}])}updateAvailable(){this.dispatchMessage(["available/save",{available:this.available_staff}])}handleCheckboxChange(t){const e=t.target,{name:i}=e,s=i,r=parseInt(e.value);switch(s){case"available_staff":e.checked?this.available_staff=[...this.available_staff,r]:this.available_staff=this.available_staff.filter(a=>a!==r),this.updateAvailable();break;default:const o=s;throw new Error(`Unhandled Auth message "${o}"`)}}selectAll(){this.available_staff=this.staff.map(t=>t.user_id),this.updateAvailable()}clearSelection(){this.available_staff=[],this.updateAvailable()}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){const t=(s,r)=>{var o;switch(r){case"available_staff":o=this.available_staff;break;default:const a=r;throw new Error(`Unhandled Auth message "${a}"`)}return m`
            <label>
            <input
                name=${r}
                type="checkbox"
                .value=${s.id.toString()}
                @change=${this.handleCheckboxChange}
                ?checked=${o.includes(s.id)}
            />
            ${s.label}
            </label>
        `},e=s=>this.available_staff.includes(s.user_id)?m`
            <li>
                <span>${s.name}</span>
            </li>
        `:m``,i=this.staff||[];return m`
        <div class="multi-select">
        <button @click=${this.showModal}>
            <box-icon name='select-multiple' color='var(--text-color-body)'></box-icon>
            <span>Select Available Staff</span>
        </button>
        <ul class="staff">
            ${i.map(s=>e(s))}
        </ul>
        </div>
        <dialog>
            <div class="modal-content">
            <div>
                <h4>Select Available Staff</h4>
                <button @click=${this.closeDialog}>Close</button>
            </div>
            <div>
                <button @click=${this.clearSelection}>Clear Selection</button>
                <button @click=${this.selectAll}>Select All</button>
            </div>
            <div>
                ${this.staff_options.map(s=>t(s,"available_staff"))}
            </div>
            </div>
        </dialog>
    `}};ts.styles=[N,j,T`
        `];let yt=ts;Ye([$()],yt.prototype,"staff",1);Ye([$()],yt.prototype,"available_staff",2);Ye([$()],yt.prototype,"staff_options",1);var io=Object.defineProperty,no=Object.getOwnPropertyDescriptor,Wt=(n,t,e,i)=>{for(var s=i>1?void 0:i?no(t,e):t,r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=(i?o(t,e,s):o(s))||s);return i&&s&&io(t,e,s),s};const es=class es extends H{constructor(){super("acorn:model"),this.appointment_omissions=[]}get appointments(){return this.model.appointments}get appointment_options(){return this.appointments&&this.date?this.appointments.map(t=>({id:t.appointment_id,label:t.property_info.property_name})):[]}connectedCallback(){super.connectedCallback(),this.updateAppointments()}attributeChangedCallback(t,e,i){super.attributeChangedCallback(t,e,i),t==="date"&&e!==i&&i&&this.updateAppointments()}updateAppointments(){this.dispatchMessage(["appointments/",{from_service_date:this.date,to_service_date:this.date,per_page:100,page:0,filter_status_ids:[1,2,3,4],filter_service_ids:this.services}])}updateOmissions(){this.dispatchMessage(["omissions/save",{omissions:this.appointment_omissions}])}handleCheckboxChange(t){const e=t.target,{name:i}=e,s=i,r=parseInt(e.value);switch(s){case"app_omissions":e.checked?this.appointment_omissions=[...this.appointment_omissions,r]:this.appointment_omissions=this.appointment_omissions.filter(a=>a!==r),this.updateOmissions();break;default:const o=s;throw new Error(`Unhandled Auth message "${o}"`)}}selectAll(){this.appointment_omissions=this.appointments.map(t=>t.appointment_id)}clearSelection(){this.appointment_omissions=[]}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){const t=(s,r)=>{var o;switch(r){case"app_omissions":o=this.appointment_omissions;break;default:const a=r;throw new Error(`Unhandled Auth message "${a}"`)}return m`
            <label>
            <input
                name=${r}
                type="checkbox"
                .value=${s.id.toString()}
                @change=${this.handleCheckboxChange}
                ?checked=${o.includes(s.id)}
            />
            ${s.label}
            </label>
        `},e=s=>this.appointment_omissions.includes(s.appointment_id)?m`
            <li>
                <span>${s.property_info.property_name}</span>
            </li>
        `:m``,i=this.appointments||[];return m`
        <div class="multi-select">
        <button @click=${this.showModal}>
            <box-icon name='select-multiple' color='var(--text-color-body)'></box-icon>
            <span>Select Omissions</span>
        </button>
        <ul class="appointments">
            ${i.map(s=>e(s))}
        </ul>
        </div>
        <dialog>
            <div class="modal-content">
                <div>
                    <h4>Select Appointments to Omit</h4>
                    <button @click=${this.closeDialog}>Close</button>
                </div>
                <div>
                    <button @click=${this.clearSelection}>Clear Selection</button>
                    <button @click=${this.selectAll}>Select All</button>
                </div>
                <div>
                    ${this.appointment_options.map(s=>t(s,"app_omissions"))}
                </div>
            </div>
        </dialog>
    `}};es.styles=[N,j,T`
        `];let V=es;Wt([D({attribute:!1})],V.prototype,"services",2);Wt([D()],V.prototype,"date",2);Wt([$()],V.prototype,"appointments",1);Wt([$()],V.prototype,"appointment_omissions",2);Wt([$()],V.prototype,"appointment_options",1);var ro=Object.defineProperty,yi=(n,t,e,i)=>{for(var s=void 0,r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=o(t,e,s)||s);return s&&ro(t,e,s),s};const ss=class ss extends q{attributeChangedCallback(t,e,i){super.attributeChangedCallback(t,e,i),t==="code"&&e!==i&&i&&(i.split(":")[0]==="no-error"?this.requestPlanUpdate():this.show())}requestPlanUpdate(){const t=new CustomEvent("build-error-dialog:no-error",{bubbles:!0,composed:!0,detail:{}});this.dispatchEvent(t)}closeDialog(){this.shadowRoot.querySelector("dialog").close()}show(){this.shadowRoot.querySelector("dialog").show()}render(){const t=e=>e?m`
                <h6>Code: ${e.code}</h6>
                <p>Error: ${e.details}</p>
                <P>Message: ${e.message}</P>
                <p>Hint: ${e.hint}</p>
            `:m``;return m`
        <div>
        <button @click=${this.show}>
            <box-icon name='error-alt' color="var(--text-color-body)" size="var(--text-font-size-large)"></box-icon>
        </button>
        </div>
        <dialog>
            <div class="dialog-content">
                <button @click=${this.closeDialog}>Close</button>
                ${t(this.error)}
            </div>
        </dialog>
    `}};ss.styles=[N,j,T`
        `];let Dt=ss;yi([D({attribute:!1})],Dt.prototype,"error");yi([D()],Dt.prototype,"code");var oo=Object.defineProperty,ao=Object.getOwnPropertyDescriptor,L=(n,t,e,i)=>{for(var s=i>1?void 0:i?ao(t,e):t,r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=(i?o(t,e,s):o(s))||s);return i&&s&&oo(t,e,s),s};const le=class le extends H{constructor(){super("acorn:model"),this.build_count=0,this.from_plan_date=Oe(new Date).split("T")[0],this.per_page=10,this.page=1,this.filter_service_ids=[21942,23044],this.routing_type=1,this.cleaning_window=6,this.max_hours=8,this.addEventListener("build-error-dialog:no-error",()=>{this.updatePlans()})}get plans(){return this.model.plans}get services(){return this.model.services}get build_error(){return this.model.build_error}get showing_total(){return this.plans?this.plans.length:0}get service_options(){return this.services?this.services.map(t=>({id:t.service_id,label:t.service_name})):[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["services/",{}]),this.updatePlans()}updatePlans(){this.dispatchMessage(["plans/",{from_plan_date:this.from_plan_date,per_page:this.per_page,page:this.page-1}])}buildSchedule(){this.build_count++,this.dispatchMessage(["plans/build",{plan_date:this.from_plan_date,build_options:{available_staff:this.model.available?this.model.available:[],services:this.filter_service_ids,omissions:this.model.omissions?this.model.omissions:[],routing_type:this.routing_type,cleaning_window:this.cleaning_window,max_hours:this.max_hours,target_staff_count:this.target_staff_count}}])}sendSchedule(){this.build_count++,this.dispatchMessage(["plans/send",{plan_date:this.from_plan_date}])}handleTableOptionChange(t){this.handleInputChange(t);const e=t.target,{name:i}=e;(i==="per_page"||i==="from_plan_date")&&this.updatePlans()}handleInputChange(t){const e=t.target,{name:i,value:s,type:r}=e;r==="checkbox"?this.handleCheckboxChange(t):this[i]=s}handleCheckboxChange(t){const e=t.target,{name:i}=e,s=i,r=parseInt(e.value);switch(s){case"app_service":e.checked?this.filter_service_ids=[...this.filter_service_ids,r]:this.filter_service_ids=this.filter_service_ids.filter(a=>a!==r);break;default:const o=s;throw new Error(`Unhandled Auth message "${o}"`)}}previousPage(){this.page>1&&(this.page--,this.updatePlans())}nextPage(){this.page++,this.updatePlans()}closeSendModal(){this.shadowRoot.querySelector("dialog.send-modal").close()}showSendModal(){this.shadowRoot.querySelector("dialog.send-modal").showModal()}render(){const t=(s,r)=>{var o;switch(r){case"app_service":o=this.filter_service_ids;break;default:const a=r;throw new Error(`Unhandled Auth message "${a}"`)}return m`
            <label>
            <input
                name=${r}
                type="checkbox"
                .value=${s.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${o.includes(s.id)}
            />
            ${s.label}
            </label>
        `},e=s=>m`
            <plan-view .plan=${s}></plan-view>
        `,i=this.plans||[];return m`
        <div class="page">
            <header>
                <h1>
                    Schedule Plans
                </h1>
            </header>
            <main>
                <div class="align-left">
                    <h4>Parameters</h4>
                </div>
                <menu class="parameter-menu">
                    <div>
                        <label>
                            <span>Schedule Date:</span>
                            <input name="from_plan_date" autocomplete="off" .value=${this.from_plan_date} type="date" @input=${this.handleTableOptionChange} />
                        </label>
                    </div>
                    <available-modal></available-modal>
                </menu>
                <div class="align-left">
                    <h4>Options</h4>
                </div>
                <menu class="table-menu">
                    <div>
                        <span>Services:</span>
                        <div class="filters">
                            ${this.service_options.map(s=>t(s,"app_service"))}
                        </div>
                    </div>
                    <omissions-modal date=${this.from_plan_date} .services=${this.filter_service_ids}></omissions-modal>
                    <div>
                        <label>
                            <span>Routing Type:</span>
                            <select name="routing_type" .value=${this.routing_type.toString()} @change=${this.handleTableOptionChange} >
                                <option value="1">Farthest to Office (Recommended)</option>
                                <option value="2">Farthest to Anywhere</option>
                                <option value="3">Office to Farthest</option>
                                <option value="4">Office to Anywhere</option>
                                <option value="4">Start and end Anywhere</option>
                            </select>
                        </label>
                        <label>
                            <span>Cleaning Window:</span>
                            <input name="cleaning_window" autocomplete="off" .value=${this.cleaning_window.toString()} type="number" @input=${this.handleTableOptionChange} />
                        </label>
                        <label>
                            <span>Max Hours:</span>
                            <input name="max_hours" autocomplete="off" .value=${this.max_hours.toString()} type="number" @input=${this.handleTableOptionChange} />
                        </label>
                        <label>
                            <span>Target Staff Count:</span>
                            <input name="target_staff_count" autocomplete="off" .value=${this.target_staff_count?this.target_staff_count.toString():""} type="number" @input=${this.handleTableOptionChange} />
                        </label>
                    </div>
                </menu>
                <div class="spread-apart">
                    <build-error-dialog code=${this.build_error?this.build_error.code:`no-error:${this.build_count}`} .error=${this.build_error}></build-error-dialog>
                    <button @click=${this.buildSchedule}>
                        <box-icon type='solid' name='wrench' color="var(--text-color-body)"></box-icon>
                        <span>Build</span>
                    </button>
                    <button @click=${this.showSendModal}>
                        <box-icon name='upload' color="var(--text-color-body)"></box-icon>
                        <span>Send</span>
                    </button>
                </div>
                <dialog class="send-modal">
                    <div class="modal-content">
                        <div>
                            <h4>Confirm Send</h4>
                            <button @click=${this.closeSendModal}>Close</button>
                        </div>
                        <div>
                            <h6>Are you sure you want to send this plan to ResortCleaning?</h6>
                        </div>
                        <div>
                            <button @click=${this.closeSendModal}>Cancel</button>
                            <button @click=${this.sendSchedule}>Send</button>
                        </div>
                    </div>
                </dialog>
                <section class="showing">
                    <div><p>Showing: </p><p class="in-bubble">${this.showing_total}</p></div>
                    <div>
                        <label>
                            <span>Show:</span>
                            <select name="per_page" .value=${this.per_page.toString()} @change=${this.handleTableOptionChange} >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </label>
                        <div class="page-selector">
                            <span>Page:</span>
                            <button @click=${this.previousPage} ?disabled=${this.page===1}><box-icon name='chevron-left' type='solid' color="var(--text-color-body)"></box-icon></button>
                            <span class="highlight">${this.page}</span>
                            <button @click=${this.nextPage}><box-icon name='chevron-right' type='solid' color="var(--text-color-body)"></box-icon></button>
                        </div>
                    </div>
                </section>
                <div class="plans">
                    ${i.map(s=>e(s))}
                </div>
            </main>
        </div>
    `}};le.uses=wt({"plan-view":Lt,"available-modal":yt,"omissions-modal":V,"build-error-dialog":Dt}),le.styles=[N,j,T`

            menu.parameter-menu {
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-evenly;
                padding: var(--spacing-size-medium) var(--spacing-size-medium);
                gap: var(--spacing-size-medium);
                width: 100%;
            }

            menu.parameter-menu > div > label {
                display: flex;
                gap: var(--spacing-size-small);
            }

            ul {
                list-style-type: none;
            }

            ul li {
                width: max-content;
                background-color: var(--background-color);
                border-radius: var(--border-size-radius);
                margin-bottom: var(--spacing-size-xsmall);
                padding: 0 var(--spacing-size-small);
            }

            .plans {
                display: flex;
                width: 100%;
                flex-wrap: wrap;
                align-items: flex-start;
                justify-content: space-evenly;
                gap: var(--spacing-size-large);
            }
        `];let R=le;L([$()],R.prototype,"plans",1);L([$()],R.prototype,"services",1);L([$()],R.prototype,"build_error",1);L([$()],R.prototype,"showing_total",1);L([$()],R.prototype,"service_options",1);L([$()],R.prototype,"from_plan_date",2);L([$()],R.prototype,"per_page",2);L([$()],R.prototype,"page",2);L([$()],R.prototype,"filter_service_ids",2);L([$()],R.prototype,"routing_type",2);L([$()],R.prototype,"cleaning_window",2);L([$()],R.prototype,"max_hours",2);L([$()],R.prototype,"target_staff_count",2);var lo=Object.defineProperty,co=Object.getOwnPropertyDescriptor,xt=(n,t,e,i)=>{for(var s=i>1?void 0:i?co(t,e):t,r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=(i?o(t,e,s):o(s))||s);return i&&s&&lo(t,e,s),s};const $i=T`
div.detail-header {
    padding-left: var(--spacing-size-small);
}

section.property-details {
    display: flex;
    align-items: flex-start;
    justify-content: space-evenly;
    background-color: var(--background-color-accent);
    border-radius: var(--border-size-radius);
    padding: var(--spacing-size-medium) var(--spacing-size-large) var(--spacing-size-small) var(--spacing-size-large);
    width: 100%;
    gap: var(--spacing-size-xlarge);
}

div.options-header {
    padding-left: var(--spacing-size-small);
}

section.property-options {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: var(--background-color-accent);
    border-radius: var(--border-size-radius);
    padding: var(--spacing-size-medium) var(--spacing-size-large) var(--spacing-size-small) var(--spacing-size-large);
    width: 100%;
    gap: var(--spacing-size-medium);
}

a {
    display: flex;
    align-items: center;
    gap: var(--spacing-size-xsmall);
    text-decoration: none;
    color: var(--text-color-body);
    border-radius: var(--border-size-radius);
    height: calc(var(--icon-size) + 1rem);
    padding: var(--spacing-size-xsmall) var(--spacing-size-small);
    background-color: var(--background-color-accent);
}

a:hover {
    background-color: var(--background-color-dark);
}
`,is=class is extends q{render(){return m`
    <div class="page">
        <header>
            <h1>
                <slot name="property_name_header"><span>Property View</span></slot>
            </h1>
        </header>
        <main>
            <div class="detail-header align-left"><h4>Details</h4></div>
            <section class="property-details">
                <dl>
                    <dt>Property ID:</dt>
                    <dd><slot name="properties_id"></slot></dd>
                    <dt>Property Name:</dt>
                    <dd><slot name="property_name"></slot></dd>
                    <dt>Status ID:</dt>
                    <dd><slot name="status_id"></slot></dd>
                    <dt>Status:</dt>
                    <dd><slot name="status"></slot></dd>
                </dl>
                <dl>
                    <dt>Address:</dt>
                    <dd><slot name="address"></slot></dd>
                    <dt>City:</dt>
                    <dd><slot name="city"></slot></dd>
                    <dt>State:</dt>
                    <dd><slot name="state_name"></slot></dd>
                </dl>
                <dl>
                    <dt>Postal Code:</dt>
                    <dd><slot name="postal_code"></slot></dd>
                    <dt>Country:</dt>
                    <dd><slot name="country"></slot></dd>
                </dl>
            </section>
            <div class="options-header spread-apart">
                <h4>Options</h4>
                <nav>
                    <a href="/app/property/${this.property}/edit" class="edit">
                        <box-icon name='edit-alt' type='solid' color="var(--text-color-body)" ></box-icon>
                        <span>Edit</span>
                    </a>
                </nav>
            </div>
            <section class="property-options">
                <dl>
                    <dt>Estimated Cleaning Time (minutes):</dt>
                    <dd><slot name="estimated_cleaning_mins"></slot></dd>
                    <dt>Double Unit Links</dt>
                    <dd><slot name="double_unit"></slot></dd>
                </dl>
            </section>
        </main>
    </div>
    `}};is.styles=[N,j,$i,T`
    ::slotted(ul) {
        list-style-type: none;
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-size-small);
        max-width: calc(var(--spacing-size-medium) * 16);
    }
    `];let ae=is;xt([D()],ae.prototype,"property",2);const ce=class ce extends q{render(){return m`
    <div class="page">
        <header>
            <h1>
                <slot name="property_name_header"><span>Property View</span></slot>
            </h1>
        </header>
        <main>
        <div class="detail-header align-left"><h4>Details</h4></div>
            <section class="property-details">
                <dl>
                    <dt>Property ID:</dt>
                    <dd><slot name="properties_id"></slot></dd>
                    <dt>Property Name:</dt>
                    <dd><slot name="property_name"></slot></dd>
                    <dt>Status ID:</dt>
                    <dd><slot name="status_id"></slot></dd>
                    <dt>Status:</dt>
                    <dd><slot name="status"></slot></dd>
                </dl>
                <dl>
                    <dt>Address:</dt>
                    <dd><slot name="address"></slot></dd>
                    <dt>City:</dt>
                    <dd><slot name="city"></slot></dd>
                    <dt>State:</dt>
                    <dd><slot name="state_name"></slot></dd>
                </dl>
                <dl>
                    <dt>Postal Code:</dt>
                    <dd><slot name="postal_code"></slot></dd>
                    <dt>Country:</dt>
                    <dd><slot name="country"></slot></dd>
                </dl>
            </section>
            <div class="options-header spread-apart">
                <h4>Options</h4>
                <nav>
                    <a href="/app/property/${this.property}" class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                        <span>Close</span>
                    </a>
                </nav>
            </div>
            <section class="property-options">
                <mu-form .init=${this.init}>
                    <label>
                        <span>Estimated Cleaning Time (minutes)</span>
                        <input name="estimated_cleaning_mins" />
                    </label>
                    <label>
                        <span>Double Unit Links</span>
                        <input-array name="double_unit">
                            <span slot="label-add">Add a property_id</span>
                        </input-array>
                    </label>
                </mu-form>
            </section>
        </main>
    </div>
    `}};ce.uses=wt({"mu-form":ji.Element,"input-array":Dn.Element}),ce.styles=[N,j,$i,T`
        mu-form {
        grid-column: key / end;
        }
        mu-form input {
        grid-column: input;
        }

        a.close {
            gap: 0;
        }
    `];let Ht=ce;xt([D()],Ht.prototype,"property",2);xt([D({attribute:!1})],Ht.prototype,"init",2);const de=class de extends H{constructor(){super("acorn:model"),this.edit=!1,this.properties_id=0}get property(){return this.model.property}attributeChangedCallback(t,e,i){super.attributeChangedCallback(t,e,i),t==="properties-id"&&e!==i&&i&&(console.log("Property Page:",i),this.dispatchMessage(["properties/select",{properties_id:parseInt(i)}]))}render(){const{properties_id:t,property_name:e,address:i,status:s,estimated_cleaning_mins:r,double_unit:o=[]}=this.property||{properties_id:0},a=o.map(u=>m`
        <li>${u}</li>
        `),l=m`
    <span slot="properties_id">${t}</span>
    <span slot="property_name_header">${e}</span>
    <span slot="property_name">${e}</span>
    <span slot="address">${i==null?void 0:i.address}</span>
    <span slot="city">${i==null?void 0:i.city}</span>
    <span slot="state_name">${i==null?void 0:i.state_name}</span>
    <span slot="postal_code">${i==null?void 0:i.postal_code}</span>
    <span slot="country">${i==null?void 0:i.country}</span>
    <span slot="status_id">${s==null?void 0:s.status_id}</span>
    <span slot="status">${s==null?void 0:s.status}</span>
    `;return this.edit?m`
        <property-editor
            property=${t}
            .init=${this.property}
            @mu-form:submit=${u=>this._handleSubmit(u)}>
            ${l}
        </property-editor>
        `:m`
        <property-viewer property=${t}>
            ${l}
            <span slot="estimated_cleaning_mins">${r}</span>
            <ul slot="double_unit">
            ${a}
            </ul>
        </property-viewer>
        `}_handleSubmit(t){console.log("Handling submit of mu-form"),this.dispatchMessage(["properties/save",{properties_id:this.properties_id,property:t.detail,onSuccess:()=>qs.dispatch(this,"history/navigate",{href:`/app/property/${this.properties_id}`}),onFailure:e=>console.log("ERROR:",e)}])}};de.uses=wt({"property-viewer":ae,"property-editor":Ht}),de.styles=[N,j,T`
        li {
            width: max-content;
            background-color: var(--background-color);
            border-radius: var(--border-size-radius);
            padding: 0 var(--spacing-size-small);
        }
    `];let $t=de;xt([D({type:Boolean,reflect:!0})],$t.prototype,"edit",2);xt([D({attribute:"properties-id",reflect:!0,type:Number})],$t.prototype,"properties_id",2);xt([$()],$t.prototype,"property",1);const ho=[{path:"/app/appointments",view:()=>m`
      <appointments-view></appointments-view>
    `},{path:"/app/staff",view:()=>m`
      <staff-view></staff-view>
    `},{path:"/app/roles",view:()=>m`
      <roles-view></roles-view>
    `},{path:"/app/properties",view:()=>m`
      <properties-view></properties-view>
    `},{path:"/app/property/:id/edit",view:n=>m`
      <property-view edit properties-id=${n.id}></property-view>
    `},{path:"/app/property/:id",view:n=>m`
      <property-view properties-id=${n.id}></property-view>
    `},{path:"/app/schedule",view:()=>m`
      <plans-view></plans-view>
    `},{path:"/app",view:()=>m`
      <landing-view></landing-view>
    `},{path:"/",redirect:"/app"}];wt({"mu-auth":E.Provider,"mu-store":class extends Xi.Provider{constructor(){super(dr,cr,"acorn:auth")}},"mu-history":qs.Provider,"mu-switch":class extends Mn.Element{constructor(){super(ho,"acorn:history")}},"side-bar":oe,"login-form":Nr,"signup-form":jr,"restful-form":Me.FormElement,"landing-view":Ce,"staff-view":bt,"appointments-view":M,"roles-view":jt,"properties-view":_t,"plans-view":R,"property-view":$t});export{E as a,wt as d,Ft as e};
