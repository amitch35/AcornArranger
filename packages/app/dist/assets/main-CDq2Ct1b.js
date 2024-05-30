(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();var hs;let Ct=class extends Error{};Ct.prototype.name="InvalidTokenError";function Pi(n){return decodeURIComponent(atob(n).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Ci(n){let t=n.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Pi(t)}catch{return atob(t)}}function Hs(n,t){if(typeof n!="string")throw new Ct("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=n.split(".")[e];if(typeof s!="string")throw new Ct(`Invalid token specified: missing part #${e+1}`);let i;try{i=Ci(s)}catch(r){throw new Ct(`Invalid token specified: invalid base64 for part #${e+1} (${r.message})`)}try{return JSON.parse(i)}catch(r){throw new Ct(`Invalid token specified: invalid json for part #${e+1} (${r.message})`)}}const zi="mu:context",Ce=`${zi}:change`;class Oi{constructor(t,e){this._proxy=Ti(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Ie extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Oi(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Ce,t),t}detach(t){this.removeEventListener(Ce,t)}}function Ti(n,t){return new Proxy(n,{get:(s,i,r)=>{if(i==="then")return;const a=Reflect.get(s,i,r);return console.log(`Context['${i}'] => `,a),a},set:(s,i,r,a)=>{const o=n[i];console.log(`Context['${i.toString()}'] <= `,r);const l=Reflect.set(s,i,r,a);if(l){let u=new CustomEvent(Ce,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:i,oldValue:o,value:r}),t.dispatchEvent(u)}else console.log(`Context['${i}] was not set to ${r}`);return l}})}function Ri(n,t){const e=Fs(t,n);return new Promise((s,i)=>{if(e){const r=e.localName;customElements.whenDefined(r).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function Fs(n,t){const e=`[provides="${n}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return Fs(n,i.host)}class Mi extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Xs(n="mu:message"){return(t,...e)=>t.dispatchEvent(new Mi(e,n))}class Ne{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Ui(n){return t=>({...t,...n})}const ze="mu:auth:jwt",te=class qs extends Ne{constructor(t,e){super((s,i)=>this.update(s,i),t,qs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(ji(s)),$e(i);case"auth/signout":return e(ps()),$e(this._redirectForLogin);case"auth/redirect":return e(ps()),$e(this._redirectForLogin,{next:window.location.href});default:const r=t[0];throw new Error(`Unhandled Auth message "${r}"`)}}};te.EVENT_TYPE="auth:message";te.dispatch=Xs(te.EVENT_TYPE);let Ii=te;function $e(n,t={}){if(!n)return;const e=window.location.href,s=new URL(n,e);return Object.entries(t).forEach(([i,r])=>s.searchParams.set(i,r)),()=>{console.log("Redirecting to ",n),window.location.assign(s)}}class Ni extends Ie{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:ft.authenticateFromLocalStorage()})}connectedCallback(){new Ii(this.context,this.redirect).attach(this)}}class ut{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ze),t}}class ft extends ut{constructor(t){super();const e=Hs(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new ft(t);return localStorage.setItem(ze,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ze);return t?ft.authenticate(t):new ut}}function ji(n){return Ui({user:ft.authenticate(n),token:n})}function ps(){return n=>{const t=n.user;return{user:t&&t.authenticated?ut.deauthenticate(t):t,token:""}}}function Li(n){return n.authenticated?{Authorization:`Bearer ${n.token||"NO_TOKEN"}`}:{}}function Di(n){return n.authenticated?Hs(n.token||""):{}}const E=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:ft,Provider:Ni,User:ut,headers:Li,payload:Di},Symbol.toStringTag,{value:"Module"}));function ee(n,t,e){const s=n.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${n.type}:`,i),s.dispatchEvent(i),n.stopPropagation()}function Oe(n,t="*"){return n.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const Xt=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:Oe,relay:ee},Symbol.toStringTag,{value:"Module"})),Hi=new DOMParser;function qt(n,...t){const e=n.map((a,o)=>o?[t[o-1],a]:[a]).flat().join(""),s=Hi.parseFromString(e,"text/html"),i=s.head.childElementCount?s.head.children:s.body.children,r=new DocumentFragment;return r.replaceChildren(...i),r}function fe(n){const t=n.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:s};function s(i,r={mode:"open"}){const a=i.attachShadow(r);return e&&a.appendChild(e.content.cloneNode(!0)),a}}const Ys=class Bs extends HTMLElement{constructor(){super(),this._state={},fe(Bs.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),ee(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},Xi(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};Ys.template=qt`
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
  `;let Fi=Ys;function Xi(n,t){const e=Object.entries(n);for(const[s,i]of e){const r=t.querySelector(`[name="${s}"]`);if(r){const a=r;switch(a.type){case"checkbox":const o=a;o.checked=!!i;break;default:a.value=i;break}}}return n}const qi=Object.freeze(Object.defineProperty({__proto__:null,Element:Fi},Symbol.toStringTag,{value:"Module"})),Ws=class Js extends Ne{constructor(t){super((e,s)=>this.update(e,s),t,Js.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(Bi(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(Wi(s,i));break}}}};Ws.EVENT_TYPE="history:message";let je=Ws;class us extends Ie{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Yi(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),Le(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new je(this.context).attach(this)}}function Yi(n){const t=n.currentTarget,e=s=>s.tagName=="A"&&s.href;if(n.button===0)if(n.composed){const i=n.composedPath().find(e);return i||void 0}else{for(let s=n.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function Bi(n,t={}){return history.pushState(t,"",n),()=>({location:document.location,state:history.state})}function Wi(n,t={}){return history.replaceState(t,"",n),()=>({location:document.location,state:history.state})}const Le=Xs(je.EVENT_TYPE),Vs=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:us,Provider:us,Service:je,dispatch:Le},Symbol.toStringTag,{value:"Module"}));class Yt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new fs(this._provider,t);this._effects.push(i),e(i)}else Ri(this._target,this._contextLabel).then(i=>{const r=new fs(i,t);this._provider=i,this._effects.push(r),i.attach(a=>this._handleChange(a)),e(r)}).catch(i=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class fs{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const De=class Gs extends HTMLElement{constructor(){super(),this._state={},this._user=new ut,this._authObserver=new Yt(this,"blazing:auth"),fe(Gs.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Vi(i,this._state,e,this.authorization).then(r=>At(r,this)).then(r=>{const a=`mu-rest-form:${s}`,o=new CustomEvent(a,{bubbles:!0,composed:!0,detail:{method:e,[s]:r,url:i}});this.dispatchEvent(o)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},At(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&Te(this.src,this.authorization).then(e=>{this._state=e,At(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Te(this.src,this.authorization).then(i=>{this._state=i,At(i,this)});break;case"new":s&&(this._state={},At({},this));break}}};De.observedAttributes=["src","new","action"];De.template=qt`
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
  `;let Ji=De;function Te(n,t){return fetch(n,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${n}:`,e))}function At(n,t){const e=Object.entries(n);for(const[s,i]of e){const r=t.querySelector(`[name="${s}"]`);if(r){const a=r;switch(a.type){case"checkbox":const o=a;o.checked=!!i;break;default:a.value=i;break}}}return n}function Vi(n,t,e="PUT",s={}){return fetch(n,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()}).catch(i=>console.log("Error submitting form:",i))}const He=Object.freeze(Object.defineProperty({__proto__:null,FormElement:Ji,fetchData:Te},Symbol.toStringTag,{value:"Module"})),Zs=class Ks extends Ne{constructor(t,e){super(e,t,Ks.EVENT_TYPE,!1)}};Zs.EVENT_TYPE="mu:message";let Qs=Zs;class Gi extends Ie{constructor(t,e,s){super(e),this._user=new ut,this._updateFn=t,this._authObserver=new Yt(this,s)}connectedCallback(){const t=new Qs(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Zi=Object.freeze(Object.defineProperty({__proto__:null,Provider:Gi,Service:Qs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Kt=globalThis,Fe=Kt.ShadowRoot&&(Kt.ShadyCSS===void 0||Kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Xe=Symbol(),ms=new WeakMap;let ti=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Xe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Fe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=ms.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ms.set(e,t))}return t}toString(){return this.cssText}};const Ki=n=>new ti(typeof n=="string"?n:n+"",void 0,Xe),Qi=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((s,i,r)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new ti(e,n,Xe)},tn=(n,t)=>{if(Fe)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Kt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},gs=Fe?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Ki(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:en,defineProperty:sn,getOwnPropertyDescriptor:nn,getOwnPropertyNames:rn,getOwnPropertySymbols:an,getPrototypeOf:on}=Object,mt=globalThis,vs=mt.trustedTypes,ln=vs?vs.emptyScript:"",bs=mt.reactiveElementPolyfillSupport,Ot=(n,t)=>n,se={toAttribute(n,t){switch(t){case Boolean:n=n?ln:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},qe=(n,t)=>!en(n,t),_s={attribute:!0,type:String,converter:se,reflect:!1,hasChanged:qe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),mt.litPropertyMetadata??(mt.litPropertyMetadata=new WeakMap);let dt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_s){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&sn(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=nn(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get(){return i==null?void 0:i.call(this)},set(a){const o=i==null?void 0:i.call(this);r.call(this,a),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_s}static _$Ei(){if(this.hasOwnProperty(Ot("elementProperties")))return;const t=on(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ot("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ot("properties"))){const e=this.properties,s=[...rn(e),...an(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(gs(i))}else t!==void 0&&e.push(gs(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return tn(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){const a=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:se).toAttribute(e,i.type);this._$Em=t,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const a=i.getPropertyOptions(r),o=typeof a.converter=="function"?{fromAttribute:a.converter}:((s=a.converter)==null?void 0:s.fromAttribute)!==void 0?a.converter:se;this._$Em=r,this[r]=o.fromAttribute(e,a.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??qe)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,a]of i)a.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],a)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};dt.elementStyles=[],dt.shadowRootOptions={mode:"open"},dt[Ot("elementProperties")]=new Map,dt[Ot("finalized")]=new Map,bs==null||bs({ReactiveElement:dt}),(mt.reactiveElementVersions??(mt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ie=globalThis,ne=ie.trustedTypes,ys=ne?ne.createPolicy("lit-html",{createHTML:n=>n}):void 0,ei="$lit$",B=`lit$${Math.random().toFixed(9).slice(2)}$`,si="?"+B,cn=`<${si}>`,et=document,Mt=()=>et.createComment(""),Ut=n=>n===null||typeof n!="object"&&typeof n!="function",ii=Array.isArray,dn=n=>ii(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",xe=`[ 	
\f\r]`,Et=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$s=/-->/g,xs=/>/g,Z=RegExp(`>|${xe}(?:([^\\s"'>=/]+)(${xe}*=${xe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ws=/'/g,ks=/"/g,ni=/^(?:script|style|textarea|title)$/i,hn=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),we=hn(1),gt=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),Ss=new WeakMap,Q=et.createTreeWalker(et,129);function ri(n,t){if(!Array.isArray(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return ys!==void 0?ys.createHTML(t):t}const pn=(n,t)=>{const e=n.length-1,s=[];let i,r=t===2?"<svg>":"",a=Et;for(let o=0;o<e;o++){const l=n[o];let u,m,h=-1,c=0;for(;c<l.length&&(a.lastIndex=c,m=a.exec(l),m!==null);)c=a.lastIndex,a===Et?m[1]==="!--"?a=$s:m[1]!==void 0?a=xs:m[2]!==void 0?(ni.test(m[2])&&(i=RegExp("</"+m[2],"g")),a=Z):m[3]!==void 0&&(a=Z):a===Z?m[0]===">"?(a=i??Et,h=-1):m[1]===void 0?h=-2:(h=a.lastIndex-m[2].length,u=m[1],a=m[3]===void 0?Z:m[3]==='"'?ks:ws):a===ks||a===ws?a=Z:a===$s||a===xs?a=Et:(a=Z,i=void 0);const d=a===Z&&n[o+1].startsWith("/>")?" ":"";r+=a===Et?l+cn:h>=0?(s.push(u),l.slice(0,h)+ei+l.slice(h)+B+d):l+B+(h===-2?o:d)}return[ri(n,r+(n[e]||"<?>")+(t===2?"</svg>":"")),s]};let Re=class ai{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,a=0;const o=t.length-1,l=this.parts,[u,m]=pn(t,e);if(this.el=ai.createElement(u,s),Q.currentNode=this.el.content,e===2){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=Q.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(const h of i.getAttributeNames())if(h.endsWith(ei)){const c=m[a++],d=i.getAttribute(h).split(B),p=/([.?@])?(.*)/.exec(c);l.push({type:1,index:r,name:p[2],strings:d,ctor:p[1]==="."?fn:p[1]==="?"?mn:p[1]==="@"?gn:me}),i.removeAttribute(h)}else h.startsWith(B)&&(l.push({type:6,index:r}),i.removeAttribute(h));if(ni.test(i.tagName)){const h=i.textContent.split(B),c=h.length-1;if(c>0){i.textContent=ne?ne.emptyScript:"";for(let d=0;d<c;d++)i.append(h[d],Mt()),Q.nextNode(),l.push({type:2,index:++r});i.append(h[c],Mt())}}}else if(i.nodeType===8)if(i.data===si)l.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf(B,h+1))!==-1;)l.push({type:7,index:r}),h+=B.length-1}r++}}static createElement(t,e){const s=et.createElement("template");return s.innerHTML=t,s}};function vt(n,t,e=n,s){var i,r;if(t===gt)return t;let a=s!==void 0?(i=e._$Co)==null?void 0:i[s]:e._$Cl;const o=Ut(t)?void 0:t._$litDirective$;return(a==null?void 0:a.constructor)!==o&&((r=a==null?void 0:a._$AO)==null||r.call(a,!1),o===void 0?a=void 0:(a=new o(n),a._$AT(n,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=a:e._$Cl=a),a!==void 0&&(t=vt(n,a._$AS(n,t.values),a,s)),t}let un=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??et).importNode(e,!0);Q.currentNode=i;let r=Q.nextNode(),a=0,o=0,l=s[0];for(;l!==void 0;){if(a===l.index){let u;l.type===2?u=new Ye(r,r.nextSibling,this,t):l.type===1?u=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(u=new vn(r,this,t)),this._$AV.push(u),l=s[++o]}a!==(l==null?void 0:l.index)&&(r=Q.nextNode(),a++)}return Q.currentNode=et,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},Ye=class oi{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=vt(this,t,e),Ut(t)?t===z||t==null||t===""?(this._$AH!==z&&this._$AR(),this._$AH=z):t!==this._$AH&&t!==gt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):dn(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==z&&Ut(this._$AH)?this._$AA.nextSibling.data=t:this.T(et.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Re.createElement(ri(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===r)this._$AH.p(s);else{const a=new un(r,this),o=a.u(this.options);a.p(s),this.T(o),this._$AH=a}}_$AC(t){let e=Ss.get(t.strings);return e===void 0&&Ss.set(t.strings,e=new Re(t)),e}k(t){ii(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new oi(this.S(Mt()),this.S(Mt()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},me=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=z,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=z}_$AI(t,e=this,s,i){const r=this.strings;let a=!1;if(r===void 0)t=vt(this,t,e,0),a=!Ut(t)||t!==this._$AH&&t!==gt,a&&(this._$AH=t);else{const o=t;let l,u;for(t=r[0],l=0;l<r.length-1;l++)u=vt(this,o[s+l],e,l),u===gt&&(u=this._$AH[l]),a||(a=!Ut(u)||u!==this._$AH[l]),u===z?t=z:t!==z&&(t+=(u??"")+r[l+1]),this._$AH[l]=u}a&&!i&&this.j(t)}j(t){t===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},fn=class extends me{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===z?void 0:t}},mn=class extends me{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==z)}},gn=class extends me{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=vt(this,t,e,0)??z)===gt)return;const s=this._$AH,i=t===z&&s!==z||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==z&&(s===z||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},vn=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){vt(this,t)}};const As=ie.litHtmlPolyfillSupport;As==null||As(Re,Ye),(ie.litHtmlVersions??(ie.litHtmlVersions=[])).push("3.1.3");const bn=(n,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const r=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new Ye(t.insertBefore(Mt(),r),r,void 0,e??{})}return i._$AI(n),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let pt=class extends dt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=bn(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return gt}};pt._$litElement$=!0,pt.finalized=!0,(hs=globalThis.litElementHydrateSupport)==null||hs.call(globalThis,{LitElement:pt});const Es=globalThis.litElementPolyfillSupport;Es==null||Es({LitElement:pt});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _n={attribute:!0,type:String,converter:se,reflect:!1,hasChanged:qe},yn=(n=_n,t,e)=>{const{kind:s,metadata:i}=e;let r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),r.set(e.name,n),s==="accessor"){const{name:a}=e;return{set(o){const l=t.get.call(this);t.set.call(this,o),this.requestUpdate(a,l,n)},init(o){return o!==void 0&&this.P(a,void 0,n),o}}}if(s==="setter"){const{name:a}=e;return function(o){const l=this[a];t.call(this,o),this.requestUpdate(a,l,n)}}throw Error("Unsupported decorator location: "+s)};function li(n){return(t,e)=>typeof e=="object"?yn(n,t,e):((s,i,r)=>{const a=i.hasOwnProperty(r);return i.constructor.createProperty(r,a?{...s,wrapped:!0}:s),a?Object.getOwnPropertyDescriptor(i,r):void 0})(n,t,e)}function $n(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}function xn(n){throw new Error('Could not dynamically require "'+n+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var ci={};(function(n){var t=function(){var e=function(h,c,d,p){for(d=d||{},p=h.length;p--;d[h[p]]=c);return d},s=[1,9],i=[1,10],r=[1,11],a=[1,12],o=[5,11,12,13,14,15],l={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,d,p,b,_,k,G){var T=k.length-1;switch(_){case 1:return new b.Root({},[k[T-1]]);case 2:return new b.Root({},[new b.Literal({value:""})]);case 3:this.$=new b.Concat({},[k[T-1],k[T]]);break;case 4:case 5:this.$=k[T];break;case 6:this.$=new b.Literal({value:k[T]});break;case 7:this.$=new b.Splat({name:k[T]});break;case 8:this.$=new b.Param({name:k[T]});break;case 9:this.$=new b.Optional({},[k[T-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:a},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:a},{1:[2,2]},e(o,[2,4]),e(o,[2,5]),e(o,[2,6]),e(o,[2,7]),e(o,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:a},e(o,[2,10]),e(o,[2,11]),e(o,[2,12]),{1:[2,1]},e(o,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:r,15:a},e(o,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,d){if(d.recoverable)this.trace(c);else{let p=function(b,_){this.message=b,this.hash=_};throw p.prototype=Error,new p(c,d)}},parse:function(c){var d=this,p=[0],b=[null],_=[],k=this.table,G="",T=0,at=0,St=2,S=1,A=_.slice.call(arguments,1),g=Object.create(this.lexer),y={yy:{}};for(var $ in this.yy)Object.prototype.hasOwnProperty.call(this.yy,$)&&(y.yy[$]=this.yy[$]);g.setInput(c,y.yy),y.yy.lexer=g,y.yy.parser=this,typeof g.yylloc>"u"&&(g.yylloc={});var N=g.yylloc;_.push(N);var j=g.options&&g.options.ranges;typeof y.yy.parseError=="function"?this.parseError=y.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var F=function(){var lt;return lt=g.lex()||S,typeof lt!="number"&&(lt=d.symbols_[lt]||lt),lt},w,x,P,_e,ot={},Gt,Y,ds,Zt;;){if(x=p[p.length-1],this.defaultActions[x]?P=this.defaultActions[x]:((w===null||typeof w>"u")&&(w=F()),P=k[x]&&k[x][w]),typeof P>"u"||!P.length||!P[0]){var ye="";Zt=[];for(Gt in k[x])this.terminals_[Gt]&&Gt>St&&Zt.push("'"+this.terminals_[Gt]+"'");g.showPosition?ye="Parse error on line "+(T+1)+`:
`+g.showPosition()+`
Expecting `+Zt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":ye="Parse error on line "+(T+1)+": Unexpected "+(w==S?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(ye,{text:g.match,token:this.terminals_[w]||w,line:g.yylineno,loc:N,expected:Zt})}if(P[0]instanceof Array&&P.length>1)throw new Error("Parse Error: multiple actions possible at state: "+x+", token: "+w);switch(P[0]){case 1:p.push(w),b.push(g.yytext),_.push(g.yylloc),p.push(P[1]),w=null,at=g.yyleng,G=g.yytext,T=g.yylineno,N=g.yylloc;break;case 2:if(Y=this.productions_[P[1]][1],ot.$=b[b.length-Y],ot._$={first_line:_[_.length-(Y||1)].first_line,last_line:_[_.length-1].last_line,first_column:_[_.length-(Y||1)].first_column,last_column:_[_.length-1].last_column},j&&(ot._$.range=[_[_.length-(Y||1)].range[0],_[_.length-1].range[1]]),_e=this.performAction.apply(ot,[G,at,T,y.yy,P[1],b,_].concat(A)),typeof _e<"u")return _e;Y&&(p=p.slice(0,-1*Y*2),b=b.slice(0,-1*Y),_=_.slice(0,-1*Y)),p.push(this.productions_[P[1]][0]),b.push(ot.$),_.push(ot._$),ds=k[p[p.length-2]][p[p.length-1]],p.push(ds);break;case 3:return!0}}return!0}},u=function(){var h={EOF:1,parseError:function(d,p){if(this.yy.parser)this.yy.parser.parseError(d,p);else throw new Error(d)},setInput:function(c,d){return this.yy=d||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var d=c.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var d=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var b=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var _=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===b.length?this.yylloc.first_column:0)+b[b.length-p.length].length-p[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[_[0],_[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),d=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+d+"^"},test_match:function(c,d){var p,b,_;if(this.options.backtrack_lexer&&(_={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(_.yylloc.range=this.yylloc.range.slice(0))),b=c[0].match(/(?:\r\n?|\n).*/g),b&&(this.yylineno+=b.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:b?b[b.length-1].length-b[b.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var k in _)this[k]=_[k];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,d,p,b;this._more||(this.yytext="",this.match="");for(var _=this._currentRules(),k=0;k<_.length;k++)if(p=this._input.match(this.rules[_[k]]),p&&(!d||p[0].length>d[0].length)){if(d=p,b=k,this.options.backtrack_lexer){if(c=this.test_match(p,_[k]),c!==!1)return c;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(c=this.test_match(d,_[b]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var d=this.next();return d||this.lex()},begin:function(d){this.conditionStack.push(d)},popState:function(){var d=this.conditionStack.length-1;return d>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(d){return d=this.conditionStack.length-1-Math.abs(d||0),d>=0?this.conditionStack[d]:"INITIAL"},pushState:function(d){this.begin(d)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(d,p,b,_){switch(b){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return h}();l.lexer=u;function m(){this.yy={}}return m.prototype=l,l.Parser=m,new m}();typeof xn<"u"&&(n.parser=t,n.Parser=t.Parser,n.parse=function(){return t.parse.apply(t,arguments)})})(ci);function ct(n){return function(t,e){return{displayName:n,props:t,children:e||[]}}}var di={Root:ct("Root"),Concat:ct("Concat"),Literal:ct("Literal"),Splat:ct("Splat"),Param:ct("Param"),Optional:ct("Optional")},hi=ci.parser;hi.yy=di;var wn=hi,kn=Object.keys(di);function Sn(n){return kn.forEach(function(t){if(typeof n[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:n}}var pi=Sn,An=pi,En=/[\-{}\[\]+?.,\\\^$|#\s]/g;function ui(n){this.captures=n.captures,this.re=n.re}ui.prototype.match=function(n){var t=this.re.exec(n),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Pn=An({Concat:function(n){return n.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(n){return{re:n.props.value.replace(En,"\\$&"),captures:[]}},Splat:function(n){return{re:"([^?]*?)",captures:[n.props.name]}},Param:function(n){return{re:"([^\\/\\?]+)",captures:[n.props.name]}},Optional:function(n){var t=this.visit(n.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(n){var t=this.visit(n.children[0]);return new ui({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Cn=Pn,zn=pi,On=zn({Concat:function(n,t){var e=n.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(n){return decodeURI(n.props.value)},Splat:function(n,t){return t[n.props.name]?t[n.props.name]:!1},Param:function(n,t){return t[n.props.name]?t[n.props.name]:!1},Optional:function(n,t){var e=this.visit(n.children[0],t);return e||""},Root:function(n,t){t=t||{};var e=this.visit(n.children[0],t);return e?encodeURI(e):!1}}),Tn=On,Rn=wn,Mn=Cn,Un=Tn;Bt.prototype=Object.create(null);Bt.prototype.match=function(n){var t=Mn.visit(this.ast),e=t.match(n);return e||!1};Bt.prototype.reverse=function(n){return Un.visit(this.ast,n)};function Bt(n){var t;if(this?t=this:t=Object.create(Bt.prototype),typeof n>"u")throw new Error("A route spec is required");return t.spec=n,t.ast=Rn.parse(n),t}var In=Bt,Nn=In,jn=Nn;const Ln=$n(jn);var Dn=Object.defineProperty,Hn=(n,t,e,s)=>{for(var i=void 0,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=a(t,e,i)||i);return i&&Dn(t,e,i),i};class re extends pt{constructor(t,e){super(),this._cases=[],this._fallback=()=>we`
      <h1>Not Found</h1>
    `,this._cases=t.map(s=>({...s,route:new Ln(s.path)})),this._historyObserver=new Yt(this,e)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match),we`
      <main>${(()=>{if(this._match){if("view"in this._match)return this._match.view(this._match.params||{});if("redirect"in this._match){const e=this._match.redirect;if(typeof e=="string")return this.redirect(e),we`
              <h1>Redirecting to ${e}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),r=s+e;for(const a of this._cases){const o=a.route.match(r);if(o)return{...a,path:s,params:o,query:i}}}redirect(t){Le(this,"history/redirect",{href:t})}}re.styles=Qi`
    :host,
    main {
      display: contents;
    }
  `;Hn([li()],re.prototype,"_match");const Fn=Object.freeze(Object.defineProperty({__proto__:null,Element:re,Switch:re},Symbol.toStringTag,{value:"Module"})),Xn=class fi extends HTMLElement{constructor(){if(super(),fe(fi.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Xn.template=qt`
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
  `;const mi=class gi extends HTMLElement{constructor(){super(),this._array=[],fe(gi.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(vi("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,r=e.closest("label");if(r){const a=Array.from(this.children).indexOf(r);this._array[a]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Oe(t,"button.add")?ee(t,"input-array:add"):Oe(t,"button.remove")&&ee(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Yn(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};mi.template=qt`
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
  `;let qn=mi;function Yn(n,t){t.replaceChildren(),n.forEach((e,s)=>t.append(vi(e)))}function vi(n,t){const e=n===void 0?"":`value="${n}"`;return qt`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}const Bn=Object.freeze(Object.defineProperty({__proto__:null,Element:qn},Symbol.toStringTag,{value:"Module"}));function rt(n){return Object.entries(n).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Wn=Object.defineProperty,Jn=Object.getOwnPropertyDescriptor,Vn=(n,t,e,s)=>{for(var i=Jn(t,e),r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=a(t,e,i)||i);return i&&Wn(t,e,i),i};class D extends pt{constructor(t){super(),this._pending=[],this._observer=new Yt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Vn([li()],D.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Qt=globalThis,Be=Qt.ShadowRoot&&(Qt.ShadyCSS===void 0||Qt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,We=Symbol(),Ps=new WeakMap;let bi=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==We)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Be&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ps.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ps.set(e,t))}return t}toString(){return this.cssText}};const Gn=n=>new bi(typeof n=="string"?n:n+"",void 0,We),C=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((s,i,r)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new bi(e,n,We)},Zn=(n,t)=>{if(Be)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Qt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},Cs=Be?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Gn(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Kn,defineProperty:Qn,getOwnPropertyDescriptor:tr,getOwnPropertyNames:er,getOwnPropertySymbols:sr,getPrototypeOf:ir}=Object,J=globalThis,zs=J.trustedTypes,nr=zs?zs.emptyScript:"",ke=J.reactiveElementPolyfillSupport,Tt=(n,t)=>n,ae={toAttribute(n,t){switch(t){case Boolean:n=n?nr:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},Je=(n,t)=>!Kn(n,t),Os={attribute:!0,type:String,converter:ae,reflect:!1,hasChanged:Je};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),J.litPropertyMetadata??(J.litPropertyMetadata=new WeakMap);class ht extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Os){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Qn(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=tr(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get(){return i==null?void 0:i.call(this)},set(a){const o=i==null?void 0:i.call(this);r.call(this,a),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Os}static _$Ei(){if(this.hasOwnProperty(Tt("elementProperties")))return;const t=ir(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Tt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Tt("properties"))){const e=this.properties,s=[...er(e),...sr(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Cs(i))}else t!==void 0&&e.push(Cs(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Zn(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var r;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const a=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:ae).toAttribute(e,s.type);this._$Em=t,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,e){var r;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const a=s.getPropertyOptions(i),o=typeof a.converter=="function"?{fromAttribute:a.converter}:((r=a.converter)==null?void 0:r.fromAttribute)!==void 0?a.converter:ae;this._$Em=i,this[i]=o.fromAttribute(e,a.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??Je)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,a]of i)a.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],a)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}ht.elementStyles=[],ht.shadowRootOptions={mode:"open"},ht[Tt("elementProperties")]=new Map,ht[Tt("finalized")]=new Map,ke==null||ke({ReactiveElement:ht}),(J.reactiveElementVersions??(J.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rt=globalThis,oe=Rt.trustedTypes,Ts=oe?oe.createPolicy("lit-html",{createHTML:n=>n}):void 0,_i="$lit$",W=`lit$${Math.random().toFixed(9).slice(2)}$`,yi="?"+W,rr=`<${yi}>`,st=document,It=()=>st.createComment(""),Nt=n=>n===null||typeof n!="object"&&typeof n!="function",$i=Array.isArray,ar=n=>$i(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",Se=`[ 	
\f\r]`,Pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Rs=/-->/g,Ms=/>/g,K=RegExp(`>|${Se}(?:([^\\s"'>=/]+)(${Se}*=${Se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Us=/'/g,Is=/"/g,xi=/^(?:script|style|textarea|title)$/i,or=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),f=or(1),bt=Symbol.for("lit-noChange"),O=Symbol.for("lit-nothing"),Ns=new WeakMap,tt=st.createTreeWalker(st,129);function wi(n,t){if(!Array.isArray(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ts!==void 0?Ts.createHTML(t):t}const lr=(n,t)=>{const e=n.length-1,s=[];let i,r=t===2?"<svg>":"",a=Pt;for(let o=0;o<e;o++){const l=n[o];let u,m,h=-1,c=0;for(;c<l.length&&(a.lastIndex=c,m=a.exec(l),m!==null);)c=a.lastIndex,a===Pt?m[1]==="!--"?a=Rs:m[1]!==void 0?a=Ms:m[2]!==void 0?(xi.test(m[2])&&(i=RegExp("</"+m[2],"g")),a=K):m[3]!==void 0&&(a=K):a===K?m[0]===">"?(a=i??Pt,h=-1):m[1]===void 0?h=-2:(h=a.lastIndex-m[2].length,u=m[1],a=m[3]===void 0?K:m[3]==='"'?Is:Us):a===Is||a===Us?a=K:a===Rs||a===Ms?a=Pt:(a=K,i=void 0);const d=a===K&&n[o+1].startsWith("/>")?" ":"";r+=a===Pt?l+rr:h>=0?(s.push(u),l.slice(0,h)+_i+l.slice(h)+W+d):l+W+(h===-2?o:d)}return[wi(n,r+(n[e]||"<?>")+(t===2?"</svg>":"")),s]};class jt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,a=0;const o=t.length-1,l=this.parts,[u,m]=lr(t,e);if(this.el=jt.createElement(u,s),tt.currentNode=this.el.content,e===2){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=tt.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(const h of i.getAttributeNames())if(h.endsWith(_i)){const c=m[a++],d=i.getAttribute(h).split(W),p=/([.?@])?(.*)/.exec(c);l.push({type:1,index:r,name:p[2],strings:d,ctor:p[1]==="."?dr:p[1]==="?"?hr:p[1]==="@"?pr:ge}),i.removeAttribute(h)}else h.startsWith(W)&&(l.push({type:6,index:r}),i.removeAttribute(h));if(xi.test(i.tagName)){const h=i.textContent.split(W),c=h.length-1;if(c>0){i.textContent=oe?oe.emptyScript:"";for(let d=0;d<c;d++)i.append(h[d],It()),tt.nextNode(),l.push({type:2,index:++r});i.append(h[c],It())}}}else if(i.nodeType===8)if(i.data===yi)l.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf(W,h+1))!==-1;)l.push({type:7,index:r}),h+=W.length-1}r++}}static createElement(t,e){const s=st.createElement("template");return s.innerHTML=t,s}}function _t(n,t,e=n,s){var a,o;if(t===bt)return t;let i=s!==void 0?(a=e._$Co)==null?void 0:a[s]:e._$Cl;const r=Nt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==r&&((o=i==null?void 0:i._$AO)==null||o.call(i,!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=_t(n,i._$AS(n,t.values),i,s)),t}class cr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??st).importNode(e,!0);tt.currentNode=i;let r=tt.nextNode(),a=0,o=0,l=s[0];for(;l!==void 0;){if(a===l.index){let u;l.type===2?u=new Wt(r,r.nextSibling,this,t):l.type===1?u=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(u=new ur(r,this,t)),this._$AV.push(u),l=s[++o]}a!==(l==null?void 0:l.index)&&(r=tt.nextNode(),a++)}return tt.currentNode=st,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Wt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=O,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=_t(this,t,e),Nt(t)?t===O||t==null||t===""?(this._$AH!==O&&this._$AR(),this._$AH=O):t!==this._$AH&&t!==bt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ar(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==O&&Nt(this._$AH)?this._$AA.nextSibling.data=t:this.T(st.createTextNode(t)),this._$AH=t}$(t){var r;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=jt.createElement(wi(s.h,s.h[0]),this.options)),s);if(((r=this._$AH)==null?void 0:r._$AD)===i)this._$AH.p(e);else{const a=new cr(i,this),o=a.u(this.options);a.p(e),this.T(o),this._$AH=a}}_$AC(t){let e=Ns.get(t.strings);return e===void 0&&Ns.set(t.strings,e=new jt(t)),e}k(t){$i(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new Wt(this.S(It()),this.S(It()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class ge{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=O,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=O}_$AI(t,e=this,s,i){const r=this.strings;let a=!1;if(r===void 0)t=_t(this,t,e,0),a=!Nt(t)||t!==this._$AH&&t!==bt,a&&(this._$AH=t);else{const o=t;let l,u;for(t=r[0],l=0;l<r.length-1;l++)u=_t(this,o[s+l],e,l),u===bt&&(u=this._$AH[l]),a||(a=!Nt(u)||u!==this._$AH[l]),u===O?t=O:t!==O&&(t+=(u??"")+r[l+1]),this._$AH[l]=u}a&&!i&&this.j(t)}j(t){t===O?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class dr extends ge{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===O?void 0:t}}class hr extends ge{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==O)}}class pr extends ge{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=_t(this,t,e,0)??O)===bt)return;const s=this._$AH,i=t===O&&s!==O||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==O&&(s===O||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class ur{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){_t(this,t)}}const Ae=Rt.litHtmlPolyfillSupport;Ae==null||Ae(jt,Wt),(Rt.litHtmlVersions??(Rt.litHtmlVersions=[])).push("3.1.3");const fr=(n,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const r=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new Wt(t.insertBefore(It(),r),r,void 0,e??{})}return i._$AI(n),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class X extends ht{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=fr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return bt}}var Ds;X._$litElement$=!0,X.finalized=!0,(Ds=globalThis.litElementHydrateSupport)==null||Ds.call(globalThis,{LitElement:X});const Ee=globalThis.litElementPolyfillSupport;Ee==null||Ee({LitElement:X});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");const mr={};function gr(n,t,e){switch(n[0]){case"properties/save":vr(n[1],e).then(i=>t(r=>({...r,property:i}))).then(()=>{const{onSuccess:i}=n[1];i&&i()}).catch(i=>{const{onFailure:r}=n[1];r&&r(i)});break;case"properties/select":br(n[1],e).then(i=>t(r=>({...r,property:i})));break;case"properties/":_r(n[1],e).then(i=>t(r=>({...r,properties:i})));break;case"roles/save":yr(n[1],e).then(i=>t(r=>({...r,role:i})));break;case"roles/select":$r(n[1],e).then(i=>t(r=>({...r,role:i})));break;case"roles/":xr(e).then(i=>t(r=>({...r,roles:i})));break;case"appointments/select":wr(n[1],e).then(i=>t(r=>({...r,appointment:i})));break;case"appointments/":kr(n[1],e).then(i=>t(r=>({...r,appointments:i})));break;case"plans/select":Jt(n[1],e).then(i=>t(r=>({...r,plan:i})));break;case"plans/":Sr(n[1],e).then(i=>t(r=>({...r,plans:i})));break;case"plans/staff/add":Ar(n[1],e).then(i=>t(r=>({...r,plan:i})));break;case"plans/staff/remove":Er(n[1],e).then(i=>t(r=>({...r,plan:i})));break;case"plans/appointment/add":Pr(n[1],e).then(i=>t(r=>({...r,plan:i})));break;case"plans/appointment/remove":Cr(n[1],e).then(i=>t(r=>({...r,plan:i})));break;case"plans/build":zr(n[1],e).then(i=>{t(r=>({...r,build_error:i}))});break;case"plans/send":Or(n[1],e).then(i=>{t(r=>({...r,build_error:i}))});break;case"plans/add":Tr(n[1],e).then(i=>{t(r=>({...r,build_error:i}))});break;case"staff/select":Rr(n[1],e).then(i=>t(r=>({...r,staff_member:i})));break;case"staff/":Mr(n[1],e).then(i=>t(r=>({...r,staff:i})));break;case"services/":Ur(e).then(i=>t(r=>({...r,services:i})));break;case"available/save":t(i=>({...i,available:n[1].available}));break;case"omissions/save":t(i=>({...i,omissions:n[1].omissions}));break;default:const s=n[0];throw new Error(`Unhandled Auth message "${s}"`)}}function vr(n,t){return fetch(`/api/properties/${n.properties_id}`,{method:"PUT",headers:{"Content-Type":"application/json",...E.headers(t)},body:JSON.stringify(n.property)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function br(n,t){return fetch(`/api/properties/${n.properties_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Property:",e),e})}function _r(n,t){let e="/api/properties";if(n.filter_status_ids&&n.filter_status_ids.length>0){const s=n.filter_status_ids.map(i=>`filter_status_id=${i}`).join("&");e+=`?${s}`}return fetch(e,{headers:E.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Properties:",s),s})}function yr(n,t){return fetch(`/api/roles/${n.role_id}`,{method:"PUT",headers:{"Content-Type":"application/json",...E.headers(t)},body:JSON.stringify(n.role)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function $r(n,t){return fetch(`/api/roles/${n.role_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Role:",e),e})}function xr(n){return fetch("/api/roles",{headers:E.headers(n)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Roles:",t),t})}function wr(n,t){return fetch(`/api/appointments/${n.appointment_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Appointment:",e),e})}function kr(n,t){let e=`/api/appointments?from_service_date=${n.from_service_date}&to_service_date=${n.to_service_date}`;if(n.per_page&&(e+=`&per_page=${n.per_page}`),n.page&&(e+=`&page=${n.page}`),n.filter_status_ids&&n.filter_status_ids.length>0){const s=n.filter_status_ids.map(i=>`filter_status_id=${i}`).join("&");e+=`&${s}`}if(n.filter_service_ids&&n.filter_service_ids.length>0){const s=n.filter_service_ids.map(i=>`filter_service_id=${i}`).join("&");e+=`&${s}`}return fetch(e,{headers:E.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Appointments:",s),s})}function Jt(n,t){return fetch(`/api/plans/${n.plan_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Plan:",e),e})}function Sr(n,t){let e=`/api/plans?from_plan_date=${n.from_plan_date}`;return n.to_plan_date&&(e+=`&to_plan_date=${n.to_plan_date}`),n.per_page&&(e+=`&per_page=${n.per_page}`),n.page&&(e+=`&page=${n.page}`),fetch(e,{headers:E.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Plans:",s),s})}function Ar(n,t){return fetch(`/api/plans/${n.plan_id}/staff/${n.user_id}`,{method:"POST",headers:E.headers(t)}).then(e=>{if(e.status===204)return Jt(n,t)})}function Er(n,t){return fetch(`/api/plans/${n.plan_id}/staff/${n.user_id}`,{method:"DELETE",headers:E.headers(t)}).then(e=>{if(e.status===204)return Jt(n,t)})}function Pr(n,t){return fetch(`/api/plans/${n.plan_id}/appointment/${n.appointment_id}`,{method:"POST",headers:E.headers(t)}).then(e=>{if(e.status===204)return Jt(n,t)})}function Cr(n,t){return fetch(`/api/plans/${n.plan_id}/appointment/${n.appointment_id}`,{method:"DELETE",headers:E.headers(t)}).then(e=>{if(e.status===204)return Jt(n,t)})}function zr(n,t){return fetch(`/api/plans/build/${n.plan_date}`,{method:"POST",headers:{"Content-Type":"application/json",...E.headers(t)},body:JSON.stringify(n.build_options)}).then(e=>{if(e.status===400)return e.json()}).then(e=>{if(e){const s=e;return s.details?s:void 0}})}function Or(n,t){return fetch(`/api/plans/send/${n.plan_date}`,{method:"POST",headers:E.headers(t)}).then(e=>{if(e.status===400)return e.json()}).then(e=>{if(e){const s=e;return s.details?s:void 0}})}function Tr(n,t){return fetch(`/api/plans/add/${n.plan_date}`,{method:"POST",headers:E.headers(t)}).then(e=>{if(e.status===400)return e.json()}).then(e=>{if(e){const s=e;return s.details?s:void 0}})}function Rr(n,t){return fetch(`/api/staff/${n.user_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Staff Member:",e),e})}function Mr(n,t){let e="/api/staff";if(n.filter_status_ids&&n.filter_status_ids.length>0){const s=n.filter_status_ids.map(i=>`filter_status_id=${i}`).join("&");e+=`?${s}`,n.filter_can_clean&&(e+="&filter_can_clean=true")}else n.filter_can_clean&&(e+="?filter_can_clean=true");return fetch(e,{headers:E.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Staff:",s),s})}function Ur(n){return fetch("/api/services",{headers:E.headers(n)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Services:",t),t})}class zt extends Error{}zt.prototype.name="InvalidTokenError";function Ir(n){return decodeURIComponent(atob(n).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Nr(n){let t=n.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Ir(t)}catch{return atob(t)}}function jr(n,t){if(typeof n!="string")throw new zt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=n.split(".")[e];if(typeof s!="string")throw new zt(`Invalid token specified: missing part #${e+1}`);let i;try{i=Nr(s)}catch(r){throw new zt(`Invalid token specified: invalid base64 for part #${e+1} (${r.message})`)}try{return JSON.parse(i)}catch(r){throw new zt(`Invalid token specified: invalid json for part #${e+1} (${r.message})`)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Lr={attribute:!0,type:String,converter:ae,reflect:!1,hasChanged:Je},Dr=(n=Lr,t,e)=>{const{kind:s,metadata:i}=e;let r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),r.set(e.name,n),s==="accessor"){const{name:a}=e;return{set(o){const l=t.get.call(this);t.set.call(this,o),this.requestUpdate(a,l,n)},init(o){return o!==void 0&&this.P(a,void 0,n),o}}}if(s==="setter"){const{name:a}=e;return function(o){const l=this[a];t.call(this,o),this.requestUpdate(a,l,n)}}throw Error("Unsupported decorator location: "+s)};function I(n){return(t,e)=>typeof e=="object"?Dr(n,t,e):((s,i,r)=>{const a=i.hasOwnProperty(r);return i.constructor.createProperty(r,a?{...s,wrapped:!0}:s),a?Object.getOwnPropertyDescriptor(i,r):void 0})(n,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function v(n){return I({...n,state:!0,attribute:!1})}var Hr=Object.defineProperty,Fr=(n,t,e,s)=>{for(var i=void 0,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=a(t,e,i)||i);return i&&Hr(t,e,i),i};const Ke=class Ke extends X{constructor(){super(...arguments),this.display_name="Status: 401",this._authObserver=new Yt(this,"acorn:auth")}displayNameTemplate(){return this.display_name==="Status: 401"||this.display_name==="Status: 403"?f`
                <box-icon name='user-circle' type='solid' color="var(--accent-color-red)" size="var(--icon-size)" ></box-icon>
                <span>Please <a href="/login.html?next=${window.location.href}" style="color: var(--text-color-link);" @click=${js}>login</a></span>
            `:this.display_name===""?f`
                <box-icon name='user-circle' type='solid' color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
                <span>Hello, user</span>
            `:f`
                <box-icon name='user-circle' type='solid' color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
                <span>${this.display_name}</span>
            `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{const e=t;if(e&&e.token){const s=jr(e.token);s&&(s.exp&&s.exp<Math.round(Date.now()/1e3)||s.role&&s.role==="anon"?this.display_name="Status: 403":this.display_name=s.user_metadata.display_name||"")}})}toggleDarkMode(t){this.classList.toggle("dark-mode"),Xt.relay(t,"dark-mode:toggle",{})}toggleActive(){this.classList.toggle("active")}render(){return f`
        <nav class="sidebar">
            <box-icon id="sidebar-btn" name='menu' color="var(--text-color-header)" size="var(--icon-size)" @click=${this.toggleActive} ></box-icon>
            <div class="top">
                <div class="logo">
                    <img src="/images/AcornArranger Logo.png" alt="AcornArranger Logo">
                    <span>AcornArranger</span>
                </div>
            </div>
            <div class="user">
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
                    <a href="/login.html?next=${window.location.href}" @click=${js}>
                        <box-icon name='log-out' color="var(--text-color-header)" size="var(--icon-size)"></box-icon>
                        <span class="nav-item">Logout</span>
                    </a>
                    <span class="tooltip">Logout</span>
                </li>
            </ul>
        </nav>
    `}};Ke.styles=C`
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
  `;let le=Ke;Fr([I({attribute:!1})],le.prototype,"display_name");function js(n){Xt.relay(n,"auth:message",["auth/signout"])}rt({"restful-form":He.FormElement});class Xr extends X{render(){return f`
      <restful-form new src="/auth/login">
        <slot></slot>
      </restful-form>
    `}get next(){return new URLSearchParams(document.location.search).get("next")}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:s}={token:e.created.session.access_token},i=this.next||"/";console.log("Login successful",e,i),Xt.relay(t,"auth:message",["auth/signin",{token:s,redirect:i}])})}}rt({"restful-form":He.FormElement});class qr extends X{render(){return f`
      <restful-form new src="/auth/signup">
        <slot></slot>
      </restful-form>
    `}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:s}={token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxa2NneGZhcWhwcXJ5dGNpeHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAyNzU3ODQsImV4cCI6MjAyNTg1MTc4NH0.f2OUbu37RF-NMV1iSj16rBOgmcarmjnntUMNGLZm7Xc"},i="/";console.log("Signup successful",e,i),Xt.relay(t,"auth:message",["auth/signin",{token:s,redirect:i}])})}}const M=C`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
img {
  max-width: 100%;
}
`,U=C`
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

.align-center {
    display: flex;
    justify-content: center;
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

dialog {
    box-shadow: 0 0.5rem 0.8rem var(--background-color-dark);
    background-color: var(--background-color);
    border: none;
    border-radius: var(--border-size-radius);
    color: var(--text-color-body);
    padding: var(--spacing-size-medium) var(--spacing-size-large);
}

dialog button {
    background-color: var(--background-color-dark);
}

dialog button:hover {
    background-color: var(--background-color-accent); 
}

.modal {
    top: 50%;
    left: 50%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    -moz-transform: translateX(-50%) translateY(-50%);
    -ms-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
}

::backdrop {
  background-color: var(--background-color-dark);
  opacity: 0.55;
}

.modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-size-medium);
}

.modal-header {
    gap: var(--spacing-size-xlarge);
}

.modal .clear-select {
    max-width: calc(var(--spacing-size-medium) * 16);
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

.filters {
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

.filters::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
}

.filters::-webkit-scrollbar-thumb {
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

button box-icon {
    pointer-events: none;
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
`;var Yr={exports:{}};(function(n,t){(function(e,s,i,r,a){if("customElements"in i)a();else{if(i.AWAITING_WEB_COMPONENTS_POLYFILL)return void i.AWAITING_WEB_COMPONENTS_POLYFILL.then(a);var o=i.AWAITING_WEB_COMPONENTS_POLYFILL=m();o.then(a);var l=i.WEB_COMPONENTS_POLYFILL||"//cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.0.2/webcomponents-bundle.js",u=i.ES6_CORE_POLYFILL||"//cdnjs.cloudflare.com/ajax/libs/core-js/2.5.3/core.min.js";"Promise"in i?h(l).then(function(){o.isDone=!0,o.exec()}):h(u).then(function(){h(l).then(function(){o.isDone=!0,o.exec()})})}function m(){var c=[];return c.isDone=!1,c.exec=function(){c.splice(0).forEach(function(d){d()})},c.then=function(d){return c.isDone?d():c.push(d),c},c}function h(c){var d=m(),p=r.createElement("script");return p.type="text/javascript",p.readyState?p.onreadystatechange=function(){p.readyState!="loaded"&&p.readyState!="complete"||(p.onreadystatechange=null,d.isDone=!0,d.exec())}:p.onload=function(){d.isDone=!0,d.exec()},p.src=c,r.getElementsByTagName("head")[0].appendChild(p),p.then=d.then,p}})(0,0,window,document,function(){var e;e=function(){return function(s){var i={};function r(a){if(i[a])return i[a].exports;var o=i[a]={i:a,l:!1,exports:{}};return s[a].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=s,r.c=i,r.d=function(a,o,l){r.o(a,o)||Object.defineProperty(a,o,{enumerable:!0,get:l})},r.r=function(a){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(a,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(a,"__esModule",{value:!0})},r.t=function(a,o){if(1&o&&(a=r(a)),8&o||4&o&&typeof a=="object"&&a&&a.__esModule)return a;var l=Object.create(null);if(r.r(l),Object.defineProperty(l,"default",{enumerable:!0,value:a}),2&o&&typeof a!="string")for(var u in a)r.d(l,u,(function(m){return a[m]}).bind(null,u));return l},r.n=function(a){var o=a&&a.__esModule?function(){return a.default}:function(){return a};return r.d(o,"a",o),o},r.o=function(a,o){return Object.prototype.hasOwnProperty.call(a,o)},r.p="",r(r.s=5)}([function(s,i){s.exports=function(r){var a=[];return a.toString=function(){return this.map(function(o){var l=function(u,m){var h,c=u[1]||"",d=u[3];if(!d)return c;if(m&&typeof btoa=="function"){var p=(h=d,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(h))))+" */"),b=d.sources.map(function(_){return"/*# sourceURL="+d.sourceRoot+_+" */"});return[c].concat(b).concat([p]).join(`
`)}return[c].join(`
`)}(o,r);return o[2]?"@media "+o[2]+"{"+l+"}":l}).join("")},a.i=function(o,l){typeof o=="string"&&(o=[[null,o,""]]);for(var u={},m=0;m<this.length;m++){var h=this[m][0];typeof h=="number"&&(u[h]=!0)}for(m=0;m<o.length;m++){var c=o[m];typeof c[0]=="number"&&u[c[0]]||(l&&!c[2]?c[2]=l:l&&(c[2]="("+c[2]+") and ("+l+")"),a.push(c))}},a}},function(s,i,r){var a=r(3);s.exports=typeof a=="string"?a:a.toString()},function(s,i,r){var a=r(4);s.exports=typeof a=="string"?a:a.toString()},function(s,i,r){(s.exports=r(0)(!1)).push([s.i,"@-webkit-keyframes spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@keyframes spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@-webkit-keyframes burst{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}90%{-webkit-transform:scale(1.5);transform:scale(1.5);opacity:0}}@keyframes burst{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}90%{-webkit-transform:scale(1.5);transform:scale(1.5);opacity:0}}@-webkit-keyframes flashing{0%{opacity:1}45%{opacity:0}90%{opacity:1}}@keyframes flashing{0%{opacity:1}45%{opacity:0}90%{opacity:1}}@-webkit-keyframes fade-left{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(-20px);transform:translateX(-20px);opacity:0}}@keyframes fade-left{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(-20px);transform:translateX(-20px);opacity:0}}@-webkit-keyframes fade-right{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(20px);transform:translateX(20px);opacity:0}}@keyframes fade-right{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(20px);transform:translateX(20px);opacity:0}}@-webkit-keyframes fade-up{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(-20px);transform:translateY(-20px);opacity:0}}@keyframes fade-up{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(-20px);transform:translateY(-20px);opacity:0}}@-webkit-keyframes fade-down{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(20px);transform:translateY(20px);opacity:0}}@keyframes fade-down{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(20px);transform:translateY(20px);opacity:0}}@-webkit-keyframes tada{0%{-webkit-transform:scaleX(1);transform:scaleX(1)}10%,20%{-webkit-transform:scale3d(.95,.95,.95) rotate(-10deg);transform:scale3d(.95,.95,.95) rotate(-10deg)}30%,50%,70%,90%{-webkit-transform:scaleX(1) rotate(10deg);transform:scaleX(1) rotate(10deg)}40%,60%,80%{-webkit-transform:scaleX(1) rotate(-10deg);transform:scaleX(1) rotate(-10deg)}to{-webkit-transform:scaleX(1);transform:scaleX(1)}}@keyframes tada{0%{-webkit-transform:scaleX(1);transform:scaleX(1)}10%,20%{-webkit-transform:scale3d(.95,.95,.95) rotate(-10deg);transform:scale3d(.95,.95,.95) rotate(-10deg)}30%,50%,70%,90%{-webkit-transform:scaleX(1) rotate(10deg);transform:scaleX(1) rotate(10deg)}40%,60%,80%{-webkit-transform:rotate(-10deg);transform:rotate(-10deg)}to{-webkit-transform:scaleX(1);transform:scaleX(1)}}.bx-spin,.bx-spin-hover:hover{-webkit-animation:spin 2s linear infinite;animation:spin 2s linear infinite}.bx-tada,.bx-tada-hover:hover{-webkit-animation:tada 1.5s ease infinite;animation:tada 1.5s ease infinite}.bx-flashing,.bx-flashing-hover:hover{-webkit-animation:flashing 1.5s infinite linear;animation:flashing 1.5s infinite linear}.bx-burst,.bx-burst-hover:hover{-webkit-animation:burst 1.5s infinite linear;animation:burst 1.5s infinite linear}.bx-fade-up,.bx-fade-up-hover:hover{-webkit-animation:fade-up 1.5s infinite linear;animation:fade-up 1.5s infinite linear}.bx-fade-down,.bx-fade-down-hover:hover{-webkit-animation:fade-down 1.5s infinite linear;animation:fade-down 1.5s infinite linear}.bx-fade-left,.bx-fade-left-hover:hover{-webkit-animation:fade-left 1.5s infinite linear;animation:fade-left 1.5s infinite linear}.bx-fade-right,.bx-fade-right-hover:hover{-webkit-animation:fade-right 1.5s infinite linear;animation:fade-right 1.5s infinite linear}",""])},function(s,i,r){(s.exports=r(0)(!1)).push([s.i,'.bx-rotate-90{transform:rotate(90deg);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)"}.bx-rotate-180{transform:rotate(180deg);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)"}.bx-rotate-270{transform:rotate(270deg);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)"}.bx-flip-horizontal{transform:scaleX(-1);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)"}.bx-flip-vertical{transform:scaleY(-1);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)"}',""])},function(s,i,r){r.r(i),r.d(i,"BoxIconElement",function(){return St});var a,o,l,u,m=r(1),h=r.n(m),c=r(2),d=r.n(c),p=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(S){return typeof S}:function(S){return S&&typeof Symbol=="function"&&S.constructor===Symbol&&S!==Symbol.prototype?"symbol":typeof S},b=function(){function S(A,g){for(var y=0;y<g.length;y++){var $=g[y];$.enumerable=$.enumerable||!1,$.configurable=!0,"value"in $&&($.writable=!0),Object.defineProperty(A,$.key,$)}}return function(A,g,y){return g&&S(A.prototype,g),y&&S(A,y),A}}(),_=(o=(a=Object).getPrototypeOf||function(S){return S.__proto__},l=a.setPrototypeOf||function(S,A){return S.__proto__=A,S},u=(typeof Reflect>"u"?"undefined":p(Reflect))==="object"?Reflect.construct:function(S,A,g){var y,$=[null];return $.push.apply($,A),y=S.bind.apply(S,$),l(new y,g.prototype)},function(S){var A=o(S);return l(S,l(function(){return u(A,arguments,o(this).constructor)},A))}),k=window,G={},T=document.createElement("template"),at=function(){return!!k.ShadyCSS};T.innerHTML=`
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
<div id="icon"></div>`;var St=_(function(S){function A(){(function(y,$){if(!(y instanceof $))throw new TypeError("Cannot call a class as a function")})(this,A);var g=function(y,$){if(!y)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!$||typeof $!="object"&&typeof $!="function"?y:$}(this,(A.__proto__||Object.getPrototypeOf(A)).call(this));return g.$ui=g.attachShadow({mode:"open"}),g.$ui.appendChild(g.ownerDocument.importNode(T.content,!0)),at()&&k.ShadyCSS.styleElement(g),g._state={$iconHolder:g.$ui.getElementById("icon"),type:g.getAttribute("type")},g}return function(g,y){if(typeof y!="function"&&y!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof y);g.prototype=Object.create(y&&y.prototype,{constructor:{value:g,enumerable:!1,writable:!0,configurable:!0}}),y&&(Object.setPrototypeOf?Object.setPrototypeOf(g,y):g.__proto__=y)}(A,HTMLElement),b(A,null,[{key:"getIconSvg",value:function(g,y){var $=this.cdnUrl+"/regular/bx-"+g+".svg";return y==="solid"?$=this.cdnUrl+"/solid/bxs-"+g+".svg":y==="logo"&&($=this.cdnUrl+"/logos/bxl-"+g+".svg"),$&&G[$]||(G[$]=new Promise(function(N,j){var F=new XMLHttpRequest;F.addEventListener("load",function(){this.status<200||this.status>=300?j(new Error(this.status+" "+this.responseText)):N(this.responseText)}),F.onerror=j,F.onabort=j,F.open("GET",$),F.send()})),G[$]}},{key:"define",value:function(g){g=g||this.tagName,at()&&k.ShadyCSS.prepareTemplate(T,g),customElements.define(g,this)}},{key:"cdnUrl",get:function(){return"//unpkg.com/boxicons@2.1.4/svg"}},{key:"tagName",get:function(){return"box-icon"}},{key:"observedAttributes",get:function(){return["type","name","color","size","rotate","flip","animation","border","pull"]}}]),b(A,[{key:"attributeChangedCallback",value:function(g,y,$){var N=this._state.$iconHolder;switch(g){case"type":(function(j,F,w){var x=j._state;x.$iconHolder.textContent="",x.type&&(x.type=null),x.type=!w||w!=="solid"&&w!=="logo"?"regular":w,x.currentName!==void 0&&j.constructor.getIconSvg(x.currentName,x.type).then(function(P){x.type===w&&(x.$iconHolder.innerHTML=P)}).catch(function(P){console.error("Failed to load icon: "+x.currentName+`
`+P)})})(this,0,$);break;case"name":(function(j,F,w){var x=j._state;x.currentName=w,x.$iconHolder.textContent="",w&&x.type!==void 0&&j.constructor.getIconSvg(w,x.type).then(function(P){x.currentName===w&&(x.$iconHolder.innerHTML=P)}).catch(function(P){console.error("Failed to load icon: "+w+`
`+P)})})(this,0,$);break;case"color":N.style.fill=$||"";break;case"size":(function(j,F,w){var x=j._state;x.size&&(x.$iconHolder.style.width=x.$iconHolder.style.height="",x.size=x.sizeType=null),w&&!/^(xs|sm|md|lg)$/.test(x.size)&&(x.size=w.trim(),x.$iconHolder.style.width=x.$iconHolder.style.height=x.size)})(this,0,$);break;case"rotate":y&&N.classList.remove("bx-rotate-"+y),$&&N.classList.add("bx-rotate-"+$);break;case"flip":y&&N.classList.remove("bx-flip-"+y),$&&N.classList.add("bx-flip-"+$);break;case"animation":y&&N.classList.remove("bx-"+y),$&&N.classList.add("bx-"+$)}}},{key:"connectedCallback",value:function(){at()&&k.ShadyCSS.styleElement(this)}}]),A}());i.default=St,St.define()}])},n.exports=e()})})(Yr);const Qe=class Qe extends D{constructor(){super("acorn:model")}render(){return f`
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
                    <a href="/login.html?next=/app/appointments" @click=${Pe}>
                        <box-icon name='log-in' color="var(--text-color-body)" ></box-icon>
                        <span>Login</span>
                    </a>
                </nav>
                <section>
                    <h4>
                        Returning user?
                    </h4>
                    <p>
                        Feel free to <a href="/login.html?next=/app/appointments" @click=${Pe}>login</a>
                    </p>
                </section>
                <section>
                    <h4>
                        New to AcornArranger?
                    </h4>
                    <p>
                        If you are new here, please <a href="/login.html?next=/app/appointments" @click=${Pe}>create an account</a> and request access from your administrator.
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
    `}};Qe.styles=[M,U,C`
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
        `];let Me=Qe;function Pe(n){Xt.relay(n,"auth:message",["auth/signout"])}var Br=Object.defineProperty,Wr=Object.getOwnPropertyDescriptor,Ve=(n,t,e,s)=>{for(var i=s>1?void 0:s?Wr(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&Br(t,e,i),i};const Jr=[{id:1,label:"Active"},{id:2,label:"Inactive"},{id:3,label:"Unverified"}],ts=class ts extends D{constructor(){super("acorn:model"),this.filter_status_ids=[1,3]}get staff(){return this.model.staff}get showing_total(){return this.staff?this.staff.length:0}connectedCallback(){super.connectedCallback(),this.updateStaff()}updateStaff(){this.dispatchMessage(["staff/",{filter_status_ids:this.filter_status_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateStaff()}handleInputChange(t){const e=t.target,{name:s,value:i,type:r}=e;r==="checkbox"?this.handleCheckboxChange(t):this[s]=i}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,r=parseInt(e.value);switch(i){case"staff_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,r]:this.filter_status_ids=this.filter_status_ids.filter(o=>o!==r);break;default:const a=i;throw new Error(`Unhandled Auth message "${a}"`)}}render(){const t=(i,r)=>{var a;switch(r){case"staff_status":a=this.filter_status_ids;break;default:const o=r;throw new Error(`Unhandled Auth message "${o}"`)}return f`
            <label>
            <input
                name=${r}
                type="checkbox"
                .value=${i.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${a.includes(i.id)}
            />
            ${i.label}
            </label>
        `},e=i=>{var r,a;return f`
            <tr>
                <td class="center">
                    <span>
                    ${i.user_id}
                    </span>
                </td>
                <td>
                    <span>
                    ${i.name}
                    </span>
                </td>
                <td>
                    <span>
                    ${(r=i.role)==null?void 0:r.title}
                    </span>
                </td>
                <td class="center">
                    <span>
                    ${(a=i.status)==null?void 0:a.status}
                    </span>
                </td>
            </tr>
        `},s=this.staff||[];return f`
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
                            ${Jr.map(i=>t(i,"staff_status"))}
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
                    ${s.map(i=>e(i))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};ts.styles=[M,U,C`
            
        `];let yt=ts;Ve([v()],yt.prototype,"staff",1);Ve([v()],yt.prototype,"showing_total",1);Ve([v()],yt.prototype,"filter_status_ids",2);function Ls(n){const t=new Date(n),e={month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0,timeZone:"UTC"};return new Intl.DateTimeFormat("en-US",e).format(t)}function Vr(n){const t=new Date(n),e={month:"2-digit",day:"2-digit",year:"numeric"};return new Intl.DateTimeFormat("en-US",e).format(t)}function Ue(n){var t=r=>("0"+r).slice(-2),e=r=>("00"+r).slice(-3),s=n.getTimezoneOffset(),i=s>0?"-":"+";return s=Math.abs(s),n.getFullYear()+"-"+t(n.getMonth()+1)+"-"+t(n.getDate())+"T"+t(n.getHours())+":"+t(n.getMinutes())+":"+t(n.getSeconds())+"."+e(n.getMilliseconds())+i+t(s/60|0)+":"+t(s%60)}var Gr=Object.defineProperty,Zr=Object.getOwnPropertyDescriptor,q=(n,t,e,s)=>{for(var i=s>1?void 0:s?Zr(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&Gr(t,e,i),i};const Kr=[{id:1,label:"Unconfirmed"},{id:2,label:"Confirmed"},{id:3,label:"Completed"},{id:4,label:"Completed (Invoiced)"},{id:5,label:"Cancelled"}],es=class es extends D{constructor(){super("acorn:model"),this.from_service_date=Ue(new Date).split("T")[0],this.to_service_date=Ue(new Date).split("T")[0],this.per_page=50,this.page=1,this.filter_status_ids=[1,2,3,4],this.filter_service_ids=[21942,23044]}get appointments(){return this.model.appointments}get services(){return this.model.services}get showing_total(){return this.appointments?this.appointments.length:0}get service_options(){return this.services?this.services.map(t=>({id:t.service_id,label:t.service_name})):[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["services/",{}]),this.updateAppointments()}updateAppointments(){const t=new Date(this.from_service_date),e=new Date(this.to_service_date);t>e&&(this.to_service_date=this.from_service_date),this.dispatchMessage(["appointments/",{from_service_date:this.from_service_date,to_service_date:this.to_service_date,per_page:this.per_page,page:this.page-1,filter_status_ids:this.filter_status_ids,filter_service_ids:this.filter_service_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateAppointments()}handleInputChange(t){const e=t.target,{name:s,value:i,type:r}=e;r==="checkbox"?this.handleCheckboxChange(t):this[s]=i}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,r=parseInt(e.value);switch(i){case"app_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,r]:this.filter_status_ids=this.filter_status_ids.filter(o=>o!==r);break;case"app_service":e.checked?this.filter_service_ids=[...this.filter_service_ids,r]:this.filter_service_ids=this.filter_service_ids.filter(o=>o!==r);break;default:const a=i;throw new Error(`Unhandled Auth message "${a}"`)}}previousPage(){this.page>1&&(this.page--,this.updateAppointments())}nextPage(){this.page++,this.updateAppointments()}render(){const t=(r,a)=>{var o;switch(a){case"app_status":o=this.filter_status_ids;break;case"app_service":o=this.filter_service_ids;break;default:const l=a;throw new Error(`Unhandled Auth message "${l}"`)}return f`
            <label>
            <input
                name=${a}
                type="checkbox"
                .value=${r.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${o.includes(r.id)}
            />
            ${r.label}
            </label>
        `},e=r=>f`
            <li>
                <span>${r.name}</span>
            </li>
        `,s=r=>{var a,o;return f`
            <tr>
                <td class="center">
                    <span>
                    ${r.appointment_id}
                    </span>
                </td>
                <td>
                    <span>
                    ${Ls(r.service_time)}
                    </span>
                </td>
                <td>
                    <span>
                    ${r.property_info.property_name}
                    </span>
                </td>
                <td>
                    <ul class="staff">
                        ${(a=r.staff)==null?void 0:a.map(l=>e(l.staff_info))}
                    </ul>
                </td>
                <td class="center">
                    <span>
                        ${r.turn_around?f`<box-icon name='revision' color="var(--text-color-body)" ></box-icon>`:f``}
                    </span>
                </td>
                <td>
                    <span>
                    ${Ls(r.next_arrival_time)}
                    </span>
                </td>
                <td>
                    <span>
                    ${r.service.service_name}
                    </span>
                </td>
                <td>
                    <span>
                    ${(o=r.status)==null?void 0:o.status}
                    </span>
                </td>
            </tr>
        `},i=this.appointments||[];return f`
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
                            ${Kr.map(r=>t(r,"app_status"))}
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
                    ${i.map(r=>s(r))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};es.styles=[M,U,C`
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
        `];let L=es;q([v()],L.prototype,"appointments",1);q([v()],L.prototype,"services",1);q([v()],L.prototype,"showing_total",1);q([v()],L.prototype,"service_options",1);q([v()],L.prototype,"from_service_date",2);q([v()],L.prototype,"to_service_date",2);q([v()],L.prototype,"per_page",2);q([v()],L.prototype,"page",2);q([v()],L.prototype,"filter_status_ids",2);q([v()],L.prototype,"filter_service_ids",2);var Qr=Object.defineProperty,ta=Object.getOwnPropertyDescriptor,ki=(n,t,e,s)=>{for(var i=ta(t,e),r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=a(t,e,i)||i);return i&&Qr(t,e,i),i};const ss=class ss extends D{get roles(){return this.model.roles}get showing_total(){return this.roles?this.roles.length:0}constructor(){super("acorn:model")}connectedCallback(){super.connectedCallback(),this.updateRoles()}updateRoles(){this.dispatchMessage(["roles/",{}])}handleInputChange(t,e,s){const i=t.target;if(s==="priority")if(i.value)e[s]=parseInt(i.value);else return;else if(s==="can_lead_team"||s==="can_clean")e[s]=i.checked;else{if(s==="role_id")return;e[s]=i.value}this.dispatchMessage(["roles/save",{role_id:e.role_id,role:e}])}render(){const t=s=>f`
            <tr>
                <td class="center">
                    <input
                    type="number"
                    .value=${s.priority.toString()}
                    @input=${i=>this.handleInputChange(i,s,"priority")}
                    />
                </td>
                <td>
                    <span>
                        ${s.title}
                    </span>
                </td>
                <td class="center">
                    <input
                    type="checkbox"
                    .checked=${s.can_lead_team}
                    @change=${i=>this.handleInputChange(i,s,"can_lead_team")}
                    />
                </td>
                <td class="center">
                    <input
                    type="checkbox"
                    .checked=${s.can_clean}
                    @change=${i=>this.handleInputChange(i,s,"can_clean")}
                    />
                </td>
            </tr>
        `,e=this.roles||[];return f`
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
                        ${e.map(s=>t(s))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};ss.styles=[M,U,C`
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
        `];let Lt=ss;ki([v()],Lt.prototype,"roles");ki([v()],Lt.prototype,"showing_total");var ea=Object.defineProperty,sa=Object.getOwnPropertyDescriptor,Ge=(n,t,e,s)=>{for(var i=s>1?void 0:s?sa(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&ea(t,e,i),i};const ia=[{id:1,label:"Active"},{id:2,label:"Inactive"}];function na(n){const t=Math.floor(n/60),e=n%60;return!t&&!n?"":t?e&&t===1?`${t} Hour ${e} Minutes`:e?`${t} Hours ${e} Minutes`:t===1?`${t} Hour`:`${t} Hours`:`${e} Minutes`}const is=class is extends D{constructor(){super("acorn:model"),this.filter_status_ids=[1]}get properties(){return this.model.properties}get showing_total(){return this.properties?this.properties.length:0}connectedCallback(){super.connectedCallback(),this.updateProperties()}updateProperties(){this.dispatchMessage(["properties/",{filter_status_ids:this.filter_status_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateProperties()}handleInputChange(t){const e=t.target,{name:s,value:i,type:r}=e;r==="checkbox"?this.handleCheckboxChange(t):this[s]=i}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,r=parseInt(e.value);switch(i){case"property_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,r]:this.filter_status_ids=this.filter_status_ids.filter(o=>o!==r);break;default:const a=i;throw new Error(`Unhandled Auth message "${a}"`)}}render(){const t=(r,a)=>{var o;switch(a){case"property_status":o=this.filter_status_ids;break;default:const l=a;throw new Error(`Unhandled Auth message "${l}"`)}return f`
            <label>
            <input
                name=${a}
                type="checkbox"
                .value=${r.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${o.includes(r.id)}
            />
            ${r.label}
            </label>
        `},e=r=>f`
            <li>
                <span>${r}</span>
            </li>
        `,s=r=>{var a,o;return f`
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
                    ${na(r.estimated_cleaning_mins)}
                    </span>
                </td>
                <td>
                    <ul>
                    ${(a=r.double_unit)==null?void 0:a.map(l=>e(l))}
                    </ul>
                </td>
                <td class="center">
                    <span>
                    ${(o=r.status)==null?void 0:o.status}
                    </span>
                </td>
                <td>
                    <a href="/app/property/${r.properties_id}/edit">
                        <box-icon name='edit-alt' type='solid' color="var(--text-color-body)" ></box-icon>
                    </a>
                </td>
            </tr>
        `},i=this.properties||[];return f`
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
                            ${ia.map(r=>t(r,"property_status"))}
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
                    ${i.map(r=>s(r))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};is.styles=[M,U,C`
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
        `];let $t=is;Ge([v()],$t.prototype,"properties",1);Ge([v()],$t.prototype,"showing_total",1);Ge([v()],$t.prototype,"filter_status_ids",2);var ra=Object.defineProperty,aa=Object.getOwnPropertyDescriptor,ve=(n,t,e,s)=>{for(var i=s>1?void 0:s?aa(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&ra(t,e,i),i};const ns=class ns extends D{get staff(){return this.model.staff}get staff_options(){return this.staff&&this.plan&&this.plan.staff?this.staff.filter(t=>!this.plan.staff.map(e=>e.staff_info.user_id).includes(t.user_id)).map(t=>({id:t.user_id,label:t.name})):this.staff?this.staff.map(t=>({id:t.user_id,label:t.name})):[]}constructor(){super("acorn:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["staff/",{filter_status_ids:[1],filter_can_clean:!0}])}handleInputChange(t){const e=t.target,{name:s,value:i}=e;this[s]=i}addPlanStaff(){this.plan&&this.staff_to_add&&this.dispatchMessage(["plans/staff/add",{plan_id:this.plan.plan_id,user_id:this.staff_to_add}]),this.closeDialog()}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){const t=e=>f`
            <option value=${e.id}>${e.label}</option>
        `;return f`
        <div class="add-one">
            <button @click=${this.showModal}>
                <box-icon name='plus' color='var(--text-color-body)'></box-icon>
                <span>Add Staff</span>
            </button>
        </div>
        <dialog class="modal">
            <div class="modal-content">
                <div class="spread-apart modal-header">
                    <h5>Select Staff to Add</h5>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
                </div>
                <div>
                    <label>
                        <span>Add: </span>
                        <select name="staff_to_add" .value=${this.staff_to_add?this.staff_to_add.toString():"0"} @change=${this.handleInputChange} >
                            <option value='0'></option>
                            ${this.staff_options.map(e=>t(e))}
                        </select>
                    </label>
                </div>
                <div>
                    <button @click=${this.addPlanStaff}>
                        <span>Confirm</span>
                    </button>
                </div>
            </div>
        </dialog>
    `}};ns.styles=[M,U,C`

            .add-one button {
                width: 100%;
                padding: var(--spacing-size-xsmall);
                font-size: var(--text-font-size-small);
                gap: var(--spacing-size-xsmall);
                background-color: var(--background-color-accent);
            }

            .add-one button:hover {
                background-color: var(--background-color);
            }
        `];let it=ns;ve([v()],it.prototype,"staff",1);ve([I({attribute:!1})],it.prototype,"plan",2);ve([v()],it.prototype,"staff_options",1);ve([v()],it.prototype,"staff_to_add",2);var oa=Object.defineProperty,la=Object.getOwnPropertyDescriptor,be=(n,t,e,s)=>{for(var i=s>1?void 0:s?la(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&oa(t,e,i),i};const rs=class rs extends D{get appointments(){return this.model.appointments}get appointment_options(){return this.appointments&&this.plan&&this.plan.appointments?this.appointments.filter(t=>!this.plan.appointments.map(e=>e.appointment_info.appointment_id).includes(t.appointment_id)).map(t=>({id:t.appointment_id,label:t.property_info.property_name})):this.appointments?this.appointments.map(t=>({id:t.appointment_id,label:t.property_info.property_name})):[]}constructor(){super("acorn:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["staff/",{filter_status_ids:[1],filter_can_clean:!0}])}handleInputChange(t){const e=t.target,{name:s,value:i}=e;this[s]=i}addPlanAppointment(){this.plan&&this.app_to_add&&this.dispatchMessage(["plans/appointment/add",{plan_id:this.plan.plan_id,appointment_id:this.app_to_add}]),this.closeDialog()}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){const t=e=>f`
            <option value=${e.id}>${e.label}</option>
        `;return f`
        <div class="add-one">
            <button @click=${this.showModal}>
                <box-icon name='plus' color='var(--text-color-body)'></box-icon>
                <span>Add Appointment</span>
            </button>
        </div>
        <dialog class="modal">
            <div class="modal-content">
                <div class="spread-apart modal-header">
                    <h5>Select Appointment to Add</h5>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
                </div>
                <div>
                    <label>
                        <span>Add: </span>
                        <select name="app_to_add" .value=${this.app_to_add?this.app_to_add.toString():"0"} @change=${this.handleInputChange} >
                            <option value='0'></option>
                            ${this.appointment_options.map(e=>t(e))}
                        </select>
                    </label>
                </div>
                <div>
                    <button @click=${this.addPlanAppointment}>
                        <span>Confirm</span>
                    </button>
                </div>
            </div>
        </dialog>
    `}};rs.styles=[M,U,C`

            .add-one button {
                width: 100%;
                padding: var(--spacing-size-xsmall);
                font-size: var(--text-font-size-small);
                gap: var(--spacing-size-xsmall);
                background-color: var(--background-color-accent);
            }

            .add-one button:hover {
                background-color: var(--background-color);
            }
        `];let nt=rs;be([v()],nt.prototype,"appointments",1);be([I({attribute:!1})],nt.prototype,"plan",2);be([v()],nt.prototype,"appointment_options",1);be([v()],nt.prototype,"app_to_add",2);var ca=Object.defineProperty,da=Object.getOwnPropertyDescriptor,Si=(n,t,e,s)=>{for(var i=s>1?void 0:s?da(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&ca(t,e,i),i};const de=class de extends D{get model_plan(){return this.model.plan}constructor(){super("acorn:model")}updated(t){super.updated(t);var e=this.model_plan;e&&(!this.plan||e.plan_id===this.plan.plan_id)&&(this.plan=e)}handleStaffRemove(t){const e=t.target,{name:s}=e;s!==void 0&&this.dispatchMessage(["plans/staff/remove",{plan_id:this.plan.plan_id,user_id:parseInt(s)}])}handleAppointmentRemove(t){const e=t.target,{name:s}=e;s!==void 0&&this.dispatchMessage(["plans/appointment/remove",{plan_id:this.plan.plan_id,appointment_id:parseInt(s)}])}render(){if(!this.plan)return f`<section><p>Loading...</p></section>`;const t=s=>f`
            <li>
                <span>${s.name}</span>
                <button class="trash" name=${s.user_id} @click=${this.handleStaffRemove}> 
                    <box-icon name='trash' size="var(--text-font-size-body)" color="var(--accent-color-red)"></box-icon>
                </button>
            </li>
        `,e=s=>f`
            <li>
                <span>${s.property_info.property_name}</span>
                <button class="trash" name=${s.appointment_id} @click=${this.handleAppointmentRemove}> 
                    <box-icon name='trash' size="var(--text-font-size-body)" color="var(--accent-color-red)"></box-icon>
                </button>
            </li>
        `;return f`
        <section>
            <div>
                <p>ID: ${this.plan.plan_id}</p>
                <p>${Vr(this.plan.plan_date)}</p>
            </div>
            <h4>Team ${this.plan.team}</h4>
            <h5>Staff</h5>
            <ul>
                ${this.plan.staff.map(s=>t(s.staff_info))}
                <add-staff-modal .plan=${this.plan}></add-staff-modal>
            </ul>
            <h5>Appointments</h5>
            <ul>
                ${this.plan.appointments.map(s=>e(s.appointment_info))}
                <add-appointment-modal .plan=${this.plan}></add-appointment-modal>
            </ul>
        </section>
    `}};de.uses=rt({"add-staff-modal":it,"add-appointment-modal":nt}),de.styles=[M,U,C`
            section {
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
                padding: var(--spacing-size-small) var(--spacing-size-medium);
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                min-width: calc(var(--spacing-size-medium) * 18);
                width: fit-content;
            }

            ul {
                list-style-type: none;
                padding: var(--spacing-size-small);
                width: 100%;
            }

            ul li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: var(--spacing-size-medium);
                width: 100%;
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

            button.trash {
                background-color: var(--background-color);
            }

            button.trash:hover {
                background-color: var(--background-color-accent);
            }
        `];let Dt=de;Si([v()],Dt.prototype,"model_plan",1);Si([I({attribute:!1})],Dt.prototype,"plan",2);var ha=Object.defineProperty,pa=Object.getOwnPropertyDescriptor,Ze=(n,t,e,s)=>{for(var i=s>1?void 0:s?pa(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&ha(t,e,i),i};const as=class as extends D{constructor(){super("acorn:model"),this.init_load=!0,this.available_staff=[]}get staff(){return this.init_load&&this.model.staff&&(this.init_load=!1,this.selectAll(),this.updateAvailable()),this.model.staff}get staff_options(){return this.staff?this.staff.map(t=>({id:t.user_id,label:t.name})):[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["staff/",{filter_status_ids:[1],filter_can_clean:!0}])}updateAvailable(){this.dispatchMessage(["available/save",{available:this.available_staff}])}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,r=parseInt(e.value);switch(i){case"available_staff":e.checked?this.available_staff=[...this.available_staff,r]:this.available_staff=this.available_staff.filter(o=>o!==r),this.updateAvailable();break;default:const a=i;throw new Error(`Unhandled Auth message "${a}"`)}}selectAll(){this.available_staff=this.staff.map(t=>t.user_id),this.updateAvailable()}clearSelection(){this.available_staff=[],this.updateAvailable()}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){const t=(i,r)=>{var a;switch(r){case"available_staff":a=this.available_staff;break;default:const o=r;throw new Error(`Unhandled Auth message "${o}"`)}return f`
            <label>
            <input
                name=${r}
                type="checkbox"
                .value=${i.id.toString()}
                @change=${this.handleCheckboxChange}
                ?checked=${a.includes(i.id)}
            />
            ${i.label}
            </label>
        `},e=i=>this.available_staff.includes(i.user_id)?f`
            <li>
                <span>${i.name}</span>
            </li>
        `:f``,s=this.staff||[];return f`
        <div class="multi-select">
        <button @click=${this.showModal}>
            <box-icon name='select-multiple' color='var(--text-color-body)'></box-icon>
            <span>Select Available Staff</span>
        </button>
        <ul class="staff">
            ${s.map(i=>e(i))}
        </ul>
        </div>
        <dialog class="modal">
            <div class="modal-content">
            <div class="spread-apart modal-header">
                <h4>Select Available Staff</h4>
                <button @click=${this.closeDialog} class="close">
                    <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                </button>
            </div>
            <div class="spread-apart clear-select">
                <button @click=${this.clearSelection}>Clear Selection</button>
                <button @click=${this.selectAll}>Select All</button>
            </div>
            <div class="filters checkboxes">
                ${this.staff_options.map(i=>t(i,"available_staff"))}
            </div>
            </div>
        </dialog>
    `}};as.styles=[M,U,C`

            .staff {
                max-width: calc(var(--text-font-size-large) * 36);
            }

            .checkboxes {
                max-height: calc(var(--text-font-size-large) * 19.5);
                min-width: calc(var(--text-font-size-large) * 10);
            }
        `];let xt=as;Ze([v()],xt.prototype,"staff",1);Ze([v()],xt.prototype,"available_staff",2);Ze([v()],xt.prototype,"staff_options",1);var ua=Object.defineProperty,fa=Object.getOwnPropertyDescriptor,Vt=(n,t,e,s)=>{for(var i=s>1?void 0:s?fa(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&ua(t,e,i),i};const os=class os extends D{constructor(){super("acorn:model"),this.appointment_omissions=[]}get appointments(){return this.model.appointments}get appointment_options(){return this.appointments&&this.date?this.appointments.map(t=>({id:t.appointment_id,label:t.property_info.property_name})):[]}connectedCallback(){super.connectedCallback(),this.updateAppointments()}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="date"&&e!==s&&s&&this.updateAppointments()}updateAppointments(){this.dispatchMessage(["appointments/",{from_service_date:this.date,to_service_date:this.date,per_page:100,page:0,filter_status_ids:[1,2],filter_service_ids:this.services}])}updateOmissions(){this.dispatchMessage(["omissions/save",{omissions:this.appointment_omissions}])}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,r=parseInt(e.value);switch(i){case"app_omissions":e.checked?this.appointment_omissions=[...this.appointment_omissions,r]:this.appointment_omissions=this.appointment_omissions.filter(o=>o!==r),this.updateOmissions();break;default:const a=i;throw new Error(`Unhandled Auth message "${a}"`)}}selectAll(){this.appointment_omissions=this.appointments.map(t=>t.appointment_id)}clearSelection(){this.appointment_omissions=[]}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){const t=(i,r)=>{var a;switch(r){case"app_omissions":a=this.appointment_omissions;break;default:const o=r;throw new Error(`Unhandled Auth message "${o}"`)}return f`
            <label>
            <input
                name=${r}
                type="checkbox"
                .value=${i.id.toString()}
                @change=${this.handleCheckboxChange}
                ?checked=${a.includes(i.id)}
            />
            ${i.label}
            </label>
        `},e=i=>this.appointment_omissions.includes(i.appointment_id)?f`
            <li>
                <span>${i.property_info.property_name}</span>
            </li>
        `:f``,s=this.appointments||[];return f`
        <div class="multi-select">
        <button @click=${this.showModal}>
            <box-icon name='select-multiple' color='var(--text-color-body)'></box-icon>
            <span>Select Omissions</span>
        </button>
        <ul class="appointments">
            ${s.map(i=>e(i))}
        </ul>
        </div>
        <dialog class="modal">
            <div class="modal-content">
                <div class="spread-apart modal-header">
                    <h4>Select Appointments to Omit</h4>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
                </div>
                <div class="spread-apart clear-select">
                    <button @click=${this.clearSelection}>Clear Selection</button>
                    <button @click=${this.selectAll}>Select All</button>
                </div>
                <div class="filters checkboxes">
                    ${this.appointment_options.map(i=>t(i,"app_omissions"))}
                </div>
            </div>
        </dialog>
    `}};os.styles=[M,U,C`

            .appointments {
                max-width: calc(var(--spacing-size-medium) * 22);
            }

            .checkboxes {
                max-height: calc(var(--text-font-size-large) * 9.5);
                min-width: calc(var(--text-font-size-large) * 12);
            }
        `];let V=os;Vt([I({attribute:!1})],V.prototype,"services",2);Vt([I()],V.prototype,"date",2);Vt([v()],V.prototype,"appointments",1);Vt([v()],V.prototype,"appointment_omissions",2);Vt([v()],V.prototype,"appointment_options",1);var ma=Object.defineProperty,Ai=(n,t,e,s)=>{for(var i=void 0,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=a(t,e,i)||i);return i&&ma(t,e,i),i};const ls=class ls extends X{attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="code"&&e!==s&&s&&(s.split(":")[0]==="no-error"?this.requestPlanUpdate():this.show())}requestPlanUpdate(){const t=new CustomEvent("build-error-dialog:no-error",{bubbles:!0,composed:!0,detail:{}});this.dispatchEvent(t)}closeDialog(){this.shadowRoot.querySelector("dialog").close()}show(){this.shadowRoot.querySelector("dialog").show()}render(){const t=s=>s?f`
                <button @click=${this.show}>
                    <box-icon name='error-alt' type='solid' color="var(--accent-color-red)" size="var(--text-font-size-large)"></box-icon>
                </button>
            `:f`
                <button @click=${this.show} disabled>
                    <box-icon name='error-alt' color="var(--text-color-body)" size="var(--text-font-size-large)"></box-icon>
                </button>
            `,e=s=>s?f`
                <div class="spread-apart">
                    <h6>Code: ${s.code}</h6>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
                </div>
                <p>Error: ${s.details}</p>
                <P>Message: ${s.message}</P>
                <p>Hint: ${s.hint}</p>
            `:f``;return f`
        <div>
            ${t(this.error)}
        </div>
        <dialog class="error">
            <div class="dialog-content">
                ${e(this.error)}
            </div>
        </dialog>
    `}};ls.styles=[M,U,C`

            button[disabled] {
                cursor: default;
            }

            button[disabled]:hover {
                background-color: var(--background-color-accent);
            }

            dialog.error {
                background-color: var(--background-color-red);
                border: 3px solid var(--accent-color-red);
                top: 15%;
                left: 50%;
                -webkit-transform: translateX(-50%) translateY(-50%);
                -moz-transform: translateX(-50%) translateY(-50%);
                -ms-transform: translateX(-50%) translateY(-50%);
                transform: translateX(-50%) translateY(-50%);
            }

            .close {
                padding: 0;
                background-color: var(--accent-color-red);
            }

            .close:hover {
                background-color: var(--accent-color-red);
            }

            h6, p {
                color: var(--accent-color-red);
            }

        `];let Ht=ls;Ai([I({attribute:!1})],Ht.prototype,"error");Ai([I()],Ht.prototype,"code");var ga=Object.defineProperty,va=Object.getOwnPropertyDescriptor,H=(n,t,e,s)=>{for(var i=s>1?void 0:s?va(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&ga(t,e,i),i};const he=class he extends D{constructor(){super("acorn:model"),this.build_count=0,this.from_plan_date=Ue(new Date).split("T")[0],this.per_page=10,this.page=1,this.filter_service_ids=[21942,23044],this.routing_type=1,this.cleaning_window=6,this.max_hours=8,this.addEventListener("build-error-dialog:no-error",()=>{this.updatePlans()})}get plans(){return this.model.plans}get services(){return this.model.services}get build_error(){return this.model.build_error}get showing_total(){return this.plans?this.plans.length:0}get service_options(){return this.services?this.services.map(t=>({id:t.service_id,label:t.service_name})):[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["services/",{}]),this.updatePlans()}updatePlans(){this.dispatchMessage(["plans/",{from_plan_date:this.from_plan_date,per_page:this.per_page,page:this.page-1}])}buildSchedule(){this.build_count++,this.dispatchMessage(["plans/build",{plan_date:this.from_plan_date,build_options:{available_staff:this.model.available?this.model.available:[],services:this.filter_service_ids,omissions:this.model.omissions?this.model.omissions:[],routing_type:this.routing_type,cleaning_window:this.cleaning_window,max_hours:this.max_hours,target_staff_count:this.target_staff_count}}])}sendSchedule(){this.build_count++,this.dispatchMessage(["plans/send",{plan_date:this.from_plan_date}]),this.closeSendModal()}addPlan(){this.build_count++,this.dispatchMessage(["plans/add",{plan_date:this.from_plan_date}])}handleTableOptionChange(t){this.handleInputChange(t);const e=t.target,{name:s}=e;(s==="per_page"||s==="from_plan_date")&&this.updatePlans()}handleInputChange(t){const e=t.target,{name:s,value:i,type:r}=e;r==="checkbox"?this.handleCheckboxChange(t):this[s]=i}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,r=parseInt(e.value);switch(i){case"app_service":e.checked?this.filter_service_ids=[...this.filter_service_ids,r]:this.filter_service_ids=this.filter_service_ids.filter(o=>o!==r);break;default:const a=i;throw new Error(`Unhandled Auth message "${a}"`)}}previousPage(){this.page>1&&(this.page--,this.updatePlans())}nextPage(){this.page++,this.updatePlans()}closeSendModal(){this.shadowRoot.querySelector("dialog.send-modal").close()}showSendModal(){this.shadowRoot.querySelector("dialog.send-modal").showModal()}render(){const t=(i,r)=>{var a;switch(r){case"app_service":a=this.filter_service_ids;break;default:const o=r;throw new Error(`Unhandled Auth message "${o}"`)}return f`
            <label>
            <input
                name=${r}
                type="checkbox"
                .value=${i.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${a.includes(i.id)}
            />
            ${i.label}
            </label>
        `},e=i=>f`
            <plan-view .plan=${i}></plan-view>
        `,s=this.plans||[];return f`
        <dialog class="send-modal modal">
            <div class="modal-content">
                <div class="align-center">
                    <h4>Confirm Send</h4>
                </div>
                <div>
                    <p>Are you sure you want to send this plan to ResortCleaning?</p>
                </div>
                <div class="spread-apart cancel-send">
                    <button @click=${this.closeSendModal}>Cancel</button>
                    <button @click=${this.sendSchedule}>Send</button>
                </div>
            </div>
        </dialog>
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
                            ${this.service_options.map(i=>t(i,"app_service"))}
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
                    ${s.map(i=>e(i))}
                    <div class="add-one">
                        <button @click=${this.addPlan}> 
                            <box-icon name='plus' size="var(--text-font-size-xlarge)" color="var(--text-color-body)"></box-icon>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    `}};he.uses=rt({"plan-view":Dt,"available-modal":xt,"omissions-modal":V,"build-error-dialog":Ht}),he.styles=[M,U,C`

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
                justify-content: flex-start;
                gap: var(--spacing-size-xxlarge);
            }

            .add-one {
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: calc(var(--spacing-size-medium) * 18);
                min-height: calc(var(--spacing-size-medium) * 14);
            }

            .add-one button {
                padding: var(--spacing-size-medium);
            }

            .cancel-send {
                max-width: calc(var(--spacing-size-medium) * 10);
            }
        `];let R=he;H([v()],R.prototype,"plans",1);H([v()],R.prototype,"services",1);H([v()],R.prototype,"build_error",1);H([v()],R.prototype,"showing_total",1);H([v()],R.prototype,"service_options",1);H([v()],R.prototype,"from_plan_date",2);H([v()],R.prototype,"per_page",2);H([v()],R.prototype,"page",2);H([v()],R.prototype,"filter_service_ids",2);H([v()],R.prototype,"routing_type",2);H([v()],R.prototype,"cleaning_window",2);H([v()],R.prototype,"max_hours",2);H([v()],R.prototype,"target_staff_count",2);var ba=Object.defineProperty,_a=Object.getOwnPropertyDescriptor,kt=(n,t,e,s)=>{for(var i=s>1?void 0:s?_a(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&ba(t,e,i),i};const Ei=C`
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
`,cs=class cs extends X{render(){return f`
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
    `}};cs.styles=[M,U,Ei,C`
    ::slotted(ul) {
        list-style-type: none;
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-size-small);
        max-width: calc(var(--spacing-size-medium) * 16);
    }
    `];let ce=cs;kt([I()],ce.prototype,"property",2);const pe=class pe extends X{render(){return f`
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
    `}};pe.uses=rt({"mu-form":qi.Element,"input-array":Bn.Element}),pe.styles=[M,U,Ei,C`
        mu-form {
        grid-column: key / end;
        }
        mu-form input {
        grid-column: input;
        }

        a.close {
            gap: 0;
        }
    `];let Ft=pe;kt([I()],Ft.prototype,"property",2);kt([I({attribute:!1})],Ft.prototype,"init",2);const ue=class ue extends D{constructor(){super("acorn:model"),this.edit=!1,this.properties_id=0}get property(){return this.model.property}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="properties-id"&&e!==s&&s&&(console.log("Property Page:",s),this.dispatchMessage(["properties/select",{properties_id:parseInt(s)}]))}render(){const{properties_id:t,property_name:e,address:s,status:i,estimated_cleaning_mins:r,double_unit:a=[]}=this.property||{properties_id:0},o=a.map(u=>f`
        <li>${u}</li>
        `),l=f`
    <span slot="properties_id">${t}</span>
    <span slot="property_name_header">${e}</span>
    <span slot="property_name">${e}</span>
    <span slot="address">${s==null?void 0:s.address}</span>
    <span slot="city">${s==null?void 0:s.city}</span>
    <span slot="state_name">${s==null?void 0:s.state_name}</span>
    <span slot="postal_code">${s==null?void 0:s.postal_code}</span>
    <span slot="country">${s==null?void 0:s.country}</span>
    <span slot="status_id">${i==null?void 0:i.status_id}</span>
    <span slot="status">${i==null?void 0:i.status}</span>
    `;return this.edit?f`
        <property-editor
            property=${t}
            .init=${this.property}
            @mu-form:submit=${u=>this._handleSubmit(u)}>
            ${l}
        </property-editor>
        `:f`
        <property-viewer property=${t}>
            ${l}
            <span slot="estimated_cleaning_mins">${r}</span>
            <ul slot="double_unit">
            ${o}
            </ul>
        </property-viewer>
        `}_handleSubmit(t){console.log("Handling submit of mu-form"),this.dispatchMessage(["properties/save",{properties_id:this.properties_id,property:t.detail,onSuccess:()=>Vs.dispatch(this,"history/navigate",{href:`/app/property/${this.properties_id}`}),onFailure:e=>console.log("ERROR:",e)}])}};ue.uses=rt({"property-viewer":ce,"property-editor":Ft}),ue.styles=[M,U,C`
        li {
            width: max-content;
            background-color: var(--background-color);
            border-radius: var(--border-size-radius);
            padding: 0 var(--spacing-size-small);
        }
    `];let wt=ue;kt([I({type:Boolean,reflect:!0})],wt.prototype,"edit",2);kt([I({attribute:"properties-id",reflect:!0,type:Number})],wt.prototype,"properties_id",2);kt([v()],wt.prototype,"property",1);const ya=[{path:"/app/appointments",view:()=>f`
      <appointments-view></appointments-view>
    `},{path:"/app/staff",view:()=>f`
      <staff-view></staff-view>
    `},{path:"/app/roles",view:()=>f`
      <roles-view></roles-view>
    `},{path:"/app/properties",view:()=>f`
      <properties-view></properties-view>
    `},{path:"/app/property/:id/edit",view:n=>f`
      <property-view edit properties-id=${n.id}></property-view>
    `},{path:"/app/property/:id",view:n=>f`
      <property-view properties-id=${n.id}></property-view>
    `},{path:"/app/schedule",view:()=>f`
      <plans-view></plans-view>
    `},{path:"/app",view:()=>f`
      <landing-view></landing-view>
    `},{path:"/",redirect:"/app"}];rt({"mu-auth":E.Provider,"mu-store":class extends Zi.Provider{constructor(){super(gr,mr,"acorn:auth")}},"mu-history":Vs.Provider,"mu-switch":class extends Fn.Element{constructor(){super(ya,"acorn:history")}},"side-bar":le,"login-form":Xr,"signup-form":qr,"restful-form":He.FormElement,"landing-view":Me,"staff-view":yt,"appointments-view":L,"roles-view":Lt,"properties-view":$t,"plans-view":R,"property-view":wt});export{E as a,rt as d,Xt as e};
