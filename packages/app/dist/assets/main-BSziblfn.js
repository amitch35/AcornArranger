(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();var ps;let Ot=class extends Error{};Ot.prototype.name="InvalidTokenError";function Ui(n){return decodeURIComponent(atob(n).replace(/(.)/g,(t,e)=>{let i=e.charCodeAt(0).toString(16).toUpperCase();return i.length<2&&(i="0"+i),"%"+i}))}function Ii(n){let t=n.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Ui(t)}catch{return atob(t)}}function Hs(n,t){if(typeof n!="string")throw new Ot("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,i=n.split(".")[e];if(typeof i!="string")throw new Ot(`Invalid token specified: missing part #${e+1}`);let s;try{s=Ii(i)}catch(r){throw new Ot(`Invalid token specified: invalid base64 for part #${e+1} (${r.message})`)}try{return JSON.parse(s)}catch(r){throw new Ot(`Invalid token specified: invalid json for part #${e+1} (${r.message})`)}}const Mi="mu:context",Ce=`${Mi}:change`;class ji{constructor(t,e){this._proxy=Ni(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Me extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new ji(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Ce,t),t}detach(t){this.removeEventListener(Ce,t)}}function Ni(n,t){return new Proxy(n,{get:(i,s,r)=>{if(s==="then")return;const a=Reflect.get(i,s,r);return console.log(`Context['${s}'] => `,a),a},set:(i,s,r,a)=>{const o=n[s];console.log(`Context['${s.toString()}'] <= `,r);const l=Reflect.set(i,s,r,a);if(l){let f=new CustomEvent(Ce,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(f,{property:s,oldValue:o,value:r}),t.dispatchEvent(f)}else console.log(`Context['${s}] was not set to ${r}`);return l}})}function Li(n,t){const e=qs(t,n);return new Promise((i,s)=>{if(e){const r=e.localName;customElements.whenDefined(r).then(()=>i(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function qs(n,t){const e=`[provides="${n}"]`;if(!t||t===document.getRootNode())return;const i=t.closest(e);if(i)return i;const s=t.getRootNode();if(s instanceof ShadowRoot)return qs(n,s.host)}class Di extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Fs(n="mu:message"){return(t,...e)=>t.dispatchEvent(new Di(e,n))}class je{constructor(t,e,i="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=i,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const i=e.detail;this.consume(i)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Hi(n){return t=>({...t,...n})}const ze="mu:auth:jwt",Xs=class Ys extends je{constructor(t,e){super((i,s)=>this.update(i,s),t,Ys.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:i,redirect:s}=t[1];return e(Fi(i)),xe(s);case"auth/signout":return e(Xi()),xe(this._redirectForLogin);case"auth/redirect":return xe(this._redirectForLogin,{next:window.location.href});default:const r=t[0];throw new Error(`Unhandled Auth message "${r}"`)}}};Xs.EVENT_TYPE="auth:message";let Bs=Xs;const Ws=Fs(Bs.EVENT_TYPE);function xe(n,t={}){if(!n)return;const e=window.location.href,i=new URL(n,e);return Object.entries(t).forEach(([s,r])=>i.searchParams.set(s,r)),()=>{console.log("Redirecting to ",n),window.location.assign(i)}}class qi extends Me{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:mt.authenticateFromLocalStorage()})}connectedCallback(){new Bs(this.context,this.redirect).attach(this)}}class ft{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ze),t}}class mt extends ft{constructor(t){super();const e=Hs(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new mt(t);return localStorage.setItem(ze,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ze);return t?mt.authenticate(t):new ft}}function Fi(n){return Hi({user:mt.authenticate(n),token:n})}function Xi(){return n=>{const t=n.user;return{user:t&&t.authenticated?ft.deauthenticate(t):t,token:""}}}function Yi(n){return n.authenticated?{Authorization:`Bearer ${n.token||"NO_TOKEN"}`}:{}}function Bi(n){return n.authenticated?Hs(n.token||""):{}}const E=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:mt,Provider:qi,User:ft,dispatch:Ws,headers:Yi,payload:Bi},Symbol.toStringTag,{value:"Module"}));function ie(n,t,e){const i=n.target,s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${n.type}:`,s),i.dispatchEvent(s),n.stopPropagation()}function Oe(n,t="*"){return n.composedPath().find(i=>{const s=i;return s.tagName&&s.matches(t)})}const Wt=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:Oe,relay:ie},Symbol.toStringTag,{value:"Module"})),Wi=new DOMParser;function Jt(n,...t){const e=n.map((a,o)=>o?[t[o-1],a]:[a]).flat().join(""),i=Wi.parseFromString(e,"text/html"),s=i.head.childElementCount?i.head.children:i.body.children,r=new DocumentFragment;return r.replaceChildren(...s),r}function me(n){const t=n.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:i};function i(s,r={mode:"open"}){const a=s.attachShadow(r);return e&&a.appendChild(e.content.cloneNode(!0)),a}}const Js=class Vs extends HTMLElement{constructor(){super(),this._state={},me(Vs.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const i=e.name,s=e.value;i&&(this._state[i]=s)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),ie(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},Vi(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};Js.template=Jt`
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
  `;let Ji=Js;function Vi(n,t){const e=Object.entries(n);for(const[i,s]of e){const r=t.querySelector(`[name="${i}"]`);if(r){const a=r;switch(a.type){case"checkbox":const o=a;o.checked=!!s;break;case"date":a.value=s.toISOString().substr(0,10);break;default:a.value=s;break}}}return n}const Gi=Object.freeze(Object.defineProperty({__proto__:null,Element:Ji},Symbol.toStringTag,{value:"Module"})),Gs=class Zs extends je{constructor(t){super((e,i)=>this.update(e,i),t,Zs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:i,state:s}=t[1];e(Ki(i,s));break}case"history/redirect":{const{href:i,state:s}=t[1];e(Qi(i,s));break}}}};Gs.EVENT_TYPE="history:message";let Ne=Gs;class us extends Me{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Zi(t);if(e){const i=new URL(e.href);i.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),Le(e,"history/navigate",{href:i.pathname+i.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new Ne(this.context).attach(this)}}function Zi(n){const t=n.currentTarget,e=i=>i.tagName=="A"&&i.href;if(n.button===0)if(n.composed){const s=n.composedPath().find(e);return s||void 0}else{for(let i=n.target;i;i===t?null:i.parentElement)if(e(i))return i;return}}function Ki(n,t={}){return history.pushState(t,"",n),()=>({location:document.location,state:history.state})}function Qi(n,t={}){return history.replaceState(t,"",n),()=>({location:document.location,state:history.state})}const Le=Fs(Ne.EVENT_TYPE),Ks=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:us,Provider:us,Service:Ne,dispatch:Le},Symbol.toStringTag,{value:"Module"}));class et{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,i)=>{if(this._provider){const s=new fs(this._provider,t);this._effects.push(s),e(s)}else Li(this._target,this._contextLabel).then(s=>{const r=new fs(s,t);this._provider=s,this._effects.push(r),s.attach(a=>this._handleChange(a)),e(r)}).catch(s=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class fs{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const De=class Qs extends HTMLElement{constructor(){super(),this._state={},this._user=new ft,this._authObserver=new et(this,"blazing:auth"),me(Qs.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",i=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;en(s,this._state,e,this.authorization).then(r=>Et(r,this)).then(r=>{const a=`mu-rest-form:${i}`,o=new CustomEvent(a,{bubbles:!0,composed:!0,detail:{method:e,[i]:r,url:s}});this.dispatchEvent(o)}).catch(r=>{const a="mu-rest-form:error",o=new CustomEvent(a,{bubbles:!0,composed:!0,detail:{method:e,error:r,url:s,request:this._state}});this.dispatchEvent(o)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const i=e.name,s=e.value;i&&(this._state[i]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},Et(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Te(this.src,this.authorization).then(e=>{this._state=e,Et(e,this)}))})}attributeChangedCallback(t,e,i){switch(t){case"src":this.src&&i&&i!==e&&!this.isNew&&Te(this.src,this.authorization).then(s=>{this._state=s,Et(s,this)});break;case"new":i&&(this._state={},Et({},this));break}}};De.observedAttributes=["src","new","action"];De.template=Jt`
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
  `;let tn=De;function Te(n,t){return fetch(n,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${n}:`,e))}function Et(n,t){const e=Object.entries(n);for(const[i,s]of e){const r=t.querySelector(`[name="${i}"]`);if(r){const a=r;switch(a.type){case"checkbox":const o=a;o.checked=!!s;break;default:a.value=s;break}}}return n}function en(n,t,e="PUT",i={}){return fetch(n,{method:e,headers:{"Content-Type":"application/json",...i},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const He=Object.freeze(Object.defineProperty({__proto__:null,FormElement:tn,fetchData:Te},Symbol.toStringTag,{value:"Module"})),ti=class ei extends je{constructor(t,e){super(e,t,ei.EVENT_TYPE,!1)}};ti.EVENT_TYPE="mu:message";let si=ti;class sn extends Me{constructor(t,e,i){super(e),this._user=new ft,this._updateFn=t,this._authObserver=new et(this,i)}connectedCallback(){const t=new si(this.context,(e,i)=>this._updateFn(e,i,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const nn=Object.freeze(Object.defineProperty({__proto__:null,Provider:sn,Service:si},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ee=globalThis,qe=ee.ShadowRoot&&(ee.ShadyCSS===void 0||ee.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Fe=Symbol(),ms=new WeakMap;let ii=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==Fe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(qe&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=ms.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&ms.set(e,t))}return t}toString(){return this.cssText}};const rn=n=>new ii(typeof n=="string"?n:n+"",void 0,Fe),an=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((i,s,r)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new ii(e,n,Fe)},on=(n,t)=>{if(qe)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=ee.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,n.appendChild(i)}},gs=qe?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return rn(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ln,defineProperty:cn,getOwnPropertyDescriptor:dn,getOwnPropertyNames:hn,getOwnPropertySymbols:pn,getPrototypeOf:un}=Object,gt=globalThis,vs=gt.trustedTypes,fn=vs?vs.emptyScript:"",bs=gt.reactiveElementPolyfillSupport,Rt=(n,t)=>n,ne={toAttribute(n,t){switch(t){case Boolean:n=n?fn:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},Xe=(n,t)=>!ln(n,t),_s={attribute:!0,type:String,converter:ne,reflect:!1,hasChanged:Xe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),gt.litPropertyMetadata??(gt.litPropertyMetadata=new WeakMap);let ht=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_s){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&cn(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=dn(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get(){return s==null?void 0:s.call(this)},set(a){const o=s==null?void 0:s.call(this);r.call(this,a),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_s}static _$Ei(){if(this.hasOwnProperty(Rt("elementProperties")))return;const t=un(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Rt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Rt("properties"))){const e=this.properties,i=[...hn(e),...pn(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(gs(s))}else t!==void 0&&e.push(gs(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return on(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){var i;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const a=(((i=s.converter)==null?void 0:i.toAttribute)!==void 0?s.converter:ne).toAttribute(e,s.type);this._$Em=t,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(t,e){var i;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const a=s.getPropertyOptions(r),o=typeof a.converter=="function"?{fromAttribute:a.converter}:((i=a.converter)==null?void 0:i.fromAttribute)!==void 0?a.converter:ne;this._$Em=r,this[r]=o.fromAttribute(e,a.type),this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){if(i??(i=this.constructor.getPropertyOptions(t)),!(i.hasChanged??Xe)(this[t],e))return;this.P(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,a]of s)a.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],a)}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostUpdate)==null?void 0:r.call(s)}),this.update(i)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};ht.elementStyles=[],ht.shadowRootOptions={mode:"open"},ht[Rt("elementProperties")]=new Map,ht[Rt("finalized")]=new Map,bs==null||bs({ReactiveElement:ht}),(gt.reactiveElementVersions??(gt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const re=globalThis,ae=re.trustedTypes,ys=ae?ae.createPolicy("lit-html",{createHTML:n=>n}):void 0,ni="$lit$",B=`lit$${Math.random().toFixed(9).slice(2)}$`,ri="?"+B,mn=`<${ri}>`,st=document,Mt=()=>st.createComment(""),jt=n=>n===null||typeof n!="object"&&typeof n!="function",ai=Array.isArray,gn=n=>ai(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",we=`[ 	
\f\r]`,Pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$s=/-->/g,xs=/>/g,Z=RegExp(`>|${we}(?:([^\\s"'>=/]+)(${we}*=${we}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ws=/'/g,ks=/"/g,oi=/^(?:script|style|textarea|title)$/i,vn=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),Ct=vn(1),vt=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),Ss=new WeakMap,Q=st.createTreeWalker(st,129);function li(n,t){if(!Array.isArray(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return ys!==void 0?ys.createHTML(t):t}const bn=(n,t)=>{const e=n.length-1,i=[];let s,r=t===2?"<svg>":"",a=Pt;for(let o=0;o<e;o++){const l=n[o];let f,m,h=-1,c=0;for(;c<l.length&&(a.lastIndex=c,m=a.exec(l),m!==null);)c=a.lastIndex,a===Pt?m[1]==="!--"?a=$s:m[1]!==void 0?a=xs:m[2]!==void 0?(oi.test(m[2])&&(s=RegExp("</"+m[2],"g")),a=Z):m[3]!==void 0&&(a=Z):a===Z?m[0]===">"?(a=s??Pt,h=-1):m[1]===void 0?h=-2:(h=a.lastIndex-m[2].length,f=m[1],a=m[3]===void 0?Z:m[3]==='"'?ks:ws):a===ks||a===ws?a=Z:a===$s||a===xs?a=Pt:(a=Z,s=void 0);const d=a===Z&&n[o+1].startsWith("/>")?" ":"";r+=a===Pt?l+mn:h>=0?(i.push(f),l.slice(0,h)+ni+l.slice(h)+B+d):l+B+(h===-2?o:d)}return[li(n,r+(n[e]||"<?>")+(t===2?"</svg>":"")),i]};let Re=class ci{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,a=0;const o=t.length-1,l=this.parts,[f,m]=bn(t,e);if(this.el=ci.createElement(f,i),Q.currentNode=this.el.content,e===2){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=Q.nextNode())!==null&&l.length<o;){if(s.nodeType===1){if(s.hasAttributes())for(const h of s.getAttributeNames())if(h.endsWith(ni)){const c=m[a++],d=s.getAttribute(h).split(B),p=/([.?@])?(.*)/.exec(c);l.push({type:1,index:r,name:p[2],strings:d,ctor:p[1]==="."?yn:p[1]==="?"?$n:p[1]==="@"?xn:ge}),s.removeAttribute(h)}else h.startsWith(B)&&(l.push({type:6,index:r}),s.removeAttribute(h));if(oi.test(s.tagName)){const h=s.textContent.split(B),c=h.length-1;if(c>0){s.textContent=ae?ae.emptyScript:"";for(let d=0;d<c;d++)s.append(h[d],Mt()),Q.nextNode(),l.push({type:2,index:++r});s.append(h[c],Mt())}}}else if(s.nodeType===8)if(s.data===ri)l.push({type:2,index:r});else{let h=-1;for(;(h=s.data.indexOf(B,h+1))!==-1;)l.push({type:7,index:r}),h+=B.length-1}r++}}static createElement(t,e){const i=st.createElement("template");return i.innerHTML=t,i}};function bt(n,t,e=n,i){var s,r;if(t===vt)return t;let a=i!==void 0?(s=e._$Co)==null?void 0:s[i]:e._$Cl;const o=jt(t)?void 0:t._$litDirective$;return(a==null?void 0:a.constructor)!==o&&((r=a==null?void 0:a._$AO)==null||r.call(a,!1),o===void 0?a=void 0:(a=new o(n),a._$AT(n,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=a:e._$Cl=a),a!==void 0&&(t=bt(n,a._$AS(n,t.values),a,i)),t}let _n=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=((t==null?void 0:t.creationScope)??st).importNode(e,!0);Q.currentNode=s;let r=Q.nextNode(),a=0,o=0,l=i[0];for(;l!==void 0;){if(a===l.index){let f;l.type===2?f=new Ye(r,r.nextSibling,this,t):l.type===1?f=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(f=new wn(r,this,t)),this._$AV.push(f),l=i[++o]}a!==(l==null?void 0:l.index)&&(r=Q.nextNode(),a++)}return Q.currentNode=st,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},Ye=class di{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=bt(this,t,e),jt(t)?t===z||t==null||t===""?(this._$AH!==z&&this._$AR(),this._$AH=z):t!==this._$AH&&t!==vt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):gn(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==z&&jt(this._$AH)?this._$AA.nextSibling.data=t:this.T(st.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Re.createElement(li(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===r)this._$AH.p(i);else{const a=new _n(r,this),o=a.u(this.options);a.p(i),this.T(o),this._$AH=a}}_$AC(t){let e=Ss.get(t.strings);return e===void 0&&Ss.set(t.strings,e=new Re(t)),e}k(t){ai(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new di(this.S(Mt()),this.S(Mt()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},ge=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=z,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=z}_$AI(t,e=this,i,s){const r=this.strings;let a=!1;if(r===void 0)t=bt(this,t,e,0),a=!jt(t)||t!==this._$AH&&t!==vt,a&&(this._$AH=t);else{const o=t;let l,f;for(t=r[0],l=0;l<r.length-1;l++)f=bt(this,o[i+l],e,l),f===vt&&(f=this._$AH[l]),a||(a=!jt(f)||f!==this._$AH[l]),f===z?t=z:t!==z&&(t+=(f??"")+r[l+1]),this._$AH[l]=f}a&&!s&&this.j(t)}j(t){t===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},yn=class extends ge{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===z?void 0:t}},$n=class extends ge{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==z)}},xn=class extends ge{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=bt(this,t,e,0)??z)===vt)return;const i=this._$AH,s=t===z&&i!==z||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==z&&(i===z||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},wn=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){bt(this,t)}};const As=re.litHtmlPolyfillSupport;As==null||As(Re,Ye),(re.litHtmlVersions??(re.litHtmlVersions=[])).push("3.1.3");const kn=(n,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let s=i._$litPart$;if(s===void 0){const r=(e==null?void 0:e.renderBefore)??null;i._$litPart$=s=new Ye(t.insertBefore(Mt(),r),r,void 0,e??{})}return s._$AI(n),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ut=class extends ht{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=kn(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return vt}};ut._$litElement$=!0,ut.finalized=!0,(ps=globalThis.litElementHydrateSupport)==null||ps.call(globalThis,{LitElement:ut});const Es=globalThis.litElementPolyfillSupport;Es==null||Es({LitElement:ut});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Sn={attribute:!0,type:String,converter:ne,reflect:!1,hasChanged:Xe},An=(n=Sn,t,e)=>{const{kind:i,metadata:s}=e;let r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),r.set(e.name,n),i==="accessor"){const{name:a}=e;return{set(o){const l=t.get.call(this);t.set.call(this,o),this.requestUpdate(a,l,n)},init(o){return o!==void 0&&this.P(a,void 0,n),o}}}if(i==="setter"){const{name:a}=e;return function(o){const l=this[a];t.call(this,o),this.requestUpdate(a,l,n)}}throw Error("Unsupported decorator location: "+i)};function hi(n){return(t,e)=>typeof e=="object"?An(n,t,e):((i,s,r)=>{const a=s.hasOwnProperty(r);return s.constructor.createProperty(r,a?{...i,wrapped:!0}:i),a?Object.getOwnPropertyDescriptor(s,r):void 0})(n,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pi(n){return hi({...n,state:!0,attribute:!1})}function En(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}function Pn(n){throw new Error('Could not dynamically require "'+n+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var ui={};(function(n){var t=function(){var e=function(h,c,d,p){for(d=d||{},p=h.length;p--;d[h[p]]=c);return d},i=[1,9],s=[1,10],r=[1,11],a=[1,12],o=[5,11,12,13,14,15],l={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,d,p,b,_,k,G){var T=k.length-1;switch(_){case 1:return new b.Root({},[k[T-1]]);case 2:return new b.Root({},[new b.Literal({value:""})]);case 3:this.$=new b.Concat({},[k[T-1],k[T]]);break;case 4:case 5:this.$=k[T];break;case 6:this.$=new b.Literal({value:k[T]});break;case 7:this.$=new b.Splat({name:k[T]});break;case 8:this.$=new b.Param({name:k[T]});break;case 9:this.$=new b.Optional({},[k[T-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:i,13:s,14:r,15:a},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:i,13:s,14:r,15:a},{1:[2,2]},e(o,[2,4]),e(o,[2,5]),e(o,[2,6]),e(o,[2,7]),e(o,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:i,13:s,14:r,15:a},e(o,[2,10]),e(o,[2,11]),e(o,[2,12]),{1:[2,1]},e(o,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:i,12:[1,16],13:s,14:r,15:a},e(o,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,d){if(d.recoverable)this.trace(c);else{let p=function(b,_){this.message=b,this.hash=_};throw p.prototype=Error,new p(c,d)}},parse:function(c){var d=this,p=[0],b=[null],_=[],k=this.table,G="",T=0,ot=0,At=2,S=1,A=_.slice.call(arguments,1),g=Object.create(this.lexer),y={yy:{}};for(var $ in this.yy)Object.prototype.hasOwnProperty.call(this.yy,$)&&(y.yy[$]=this.yy[$]);g.setInput(c,y.yy),y.yy.lexer=g,y.yy.parser=this,typeof g.yylloc>"u"&&(g.yylloc={});var j=g.yylloc;_.push(j);var N=g.options&&g.options.ranges;typeof y.yy.parseError=="function"?this.parseError=y.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var F=function(){var ct;return ct=g.lex()||S,typeof ct!="number"&&(ct=d.symbols_[ct]||ct),ct},w,x,P,ye,lt={},Qt,Y,hs,te;;){if(x=p[p.length-1],this.defaultActions[x]?P=this.defaultActions[x]:((w===null||typeof w>"u")&&(w=F()),P=k[x]&&k[x][w]),typeof P>"u"||!P.length||!P[0]){var $e="";te=[];for(Qt in k[x])this.terminals_[Qt]&&Qt>At&&te.push("'"+this.terminals_[Qt]+"'");g.showPosition?$e="Parse error on line "+(T+1)+`:
`+g.showPosition()+`
Expecting `+te.join(", ")+", got '"+(this.terminals_[w]||w)+"'":$e="Parse error on line "+(T+1)+": Unexpected "+(w==S?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError($e,{text:g.match,token:this.terminals_[w]||w,line:g.yylineno,loc:j,expected:te})}if(P[0]instanceof Array&&P.length>1)throw new Error("Parse Error: multiple actions possible at state: "+x+", token: "+w);switch(P[0]){case 1:p.push(w),b.push(g.yytext),_.push(g.yylloc),p.push(P[1]),w=null,ot=g.yyleng,G=g.yytext,T=g.yylineno,j=g.yylloc;break;case 2:if(Y=this.productions_[P[1]][1],lt.$=b[b.length-Y],lt._$={first_line:_[_.length-(Y||1)].first_line,last_line:_[_.length-1].last_line,first_column:_[_.length-(Y||1)].first_column,last_column:_[_.length-1].last_column},N&&(lt._$.range=[_[_.length-(Y||1)].range[0],_[_.length-1].range[1]]),ye=this.performAction.apply(lt,[G,ot,T,y.yy,P[1],b,_].concat(A)),typeof ye<"u")return ye;Y&&(p=p.slice(0,-1*Y*2),b=b.slice(0,-1*Y),_=_.slice(0,-1*Y)),p.push(this.productions_[P[1]][0]),b.push(lt.$),_.push(lt._$),hs=k[p[p.length-2]][p[p.length-1]],p.push(hs);break;case 3:return!0}}return!0}},f=function(){var h={EOF:1,parseError:function(d,p){if(this.yy.parser)this.yy.parser.parseError(d,p);else throw new Error(d)},setInput:function(c,d){return this.yy=d||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var d=c.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var d=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var b=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var _=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===b.length?this.yylloc.first_column:0)+b[b.length-p.length].length-p[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[_[0],_[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),d=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+d+"^"},test_match:function(c,d){var p,b,_;if(this.options.backtrack_lexer&&(_={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(_.yylloc.range=this.yylloc.range.slice(0))),b=c[0].match(/(?:\r\n?|\n).*/g),b&&(this.yylineno+=b.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:b?b[b.length-1].length-b[b.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var k in _)this[k]=_[k];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,d,p,b;this._more||(this.yytext="",this.match="");for(var _=this._currentRules(),k=0;k<_.length;k++)if(p=this._input.match(this.rules[_[k]]),p&&(!d||p[0].length>d[0].length)){if(d=p,b=k,this.options.backtrack_lexer){if(c=this.test_match(p,_[k]),c!==!1)return c;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(c=this.test_match(d,_[b]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var d=this.next();return d||this.lex()},begin:function(d){this.conditionStack.push(d)},popState:function(){var d=this.conditionStack.length-1;return d>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(d){return d=this.conditionStack.length-1-Math.abs(d||0),d>=0?this.conditionStack[d]:"INITIAL"},pushState:function(d){this.begin(d)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(d,p,b,_){switch(b){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return h}();l.lexer=f;function m(){this.yy={}}return m.prototype=l,l.Parser=m,new m}();typeof Pn<"u"&&(n.parser=t,n.Parser=t.Parser,n.parse=function(){return t.parse.apply(t,arguments)})})(ui);function dt(n){return function(t,e){return{displayName:n,props:t,children:e||[]}}}var fi={Root:dt("Root"),Concat:dt("Concat"),Literal:dt("Literal"),Splat:dt("Splat"),Param:dt("Param"),Optional:dt("Optional")},mi=ui.parser;mi.yy=fi;var Cn=mi,zn=Object.keys(fi);function On(n){return zn.forEach(function(t){if(typeof n[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:n}}var gi=On,Tn=gi,Rn=/[\-{}\[\]+?.,\\\^$|#\s]/g;function vi(n){this.captures=n.captures,this.re=n.re}vi.prototype.match=function(n){var t=this.re.exec(n),e={};if(t)return this.captures.forEach(function(i,s){typeof t[s+1]>"u"?e[i]=void 0:e[i]=decodeURIComponent(t[s+1])}),e};var Un=Tn({Concat:function(n){return n.children.reduce((function(t,e){var i=this.visit(e);return{re:t.re+i.re,captures:t.captures.concat(i.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(n){return{re:n.props.value.replace(Rn,"\\$&"),captures:[]}},Splat:function(n){return{re:"([^?]*?)",captures:[n.props.name]}},Param:function(n){return{re:"([^\\/\\?]+)",captures:[n.props.name]}},Optional:function(n){var t=this.visit(n.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(n){var t=this.visit(n.children[0]);return new vi({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),In=Un,Mn=gi,jn=Mn({Concat:function(n,t){var e=n.children.map((function(i){return this.visit(i,t)}).bind(this));return e.some(function(i){return i===!1})?!1:e.join("")},Literal:function(n){return decodeURI(n.props.value)},Splat:function(n,t){return t[n.props.name]?t[n.props.name]:!1},Param:function(n,t){return t[n.props.name]?t[n.props.name]:!1},Optional:function(n,t){var e=this.visit(n.children[0],t);return e||""},Root:function(n,t){t=t||{};var e=this.visit(n.children[0],t);return e?encodeURI(e):!1}}),Nn=jn,Ln=Cn,Dn=In,Hn=Nn;Vt.prototype=Object.create(null);Vt.prototype.match=function(n){var t=Dn.visit(this.ast),e=t.match(n);return e||!1};Vt.prototype.reverse=function(n){return Hn.visit(this.ast,n)};function Vt(n){var t;if(this?t=this:t=Object.create(Vt.prototype),typeof n>"u")throw new Error("A route spec is required");return t.spec=n,t.ast=Ln.parse(n),t}var qn=Vt,Fn=qn,Xn=Fn;const Yn=En(Xn);var Bn=Object.defineProperty,bi=(n,t,e,i)=>{for(var s=void 0,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=a(t,e,s)||s);return s&&Bn(t,e,s),s};class Nt extends ut{constructor(t,e,i=""){super(),this._cases=[],this._fallback=()=>Ct`
      <h1>Not Found</h1>
    `,this._cases=t.map(s=>({...s,route:new Yn(s.path)})),this._historyObserver=new et(this,e),this._authObserver=new et(this,i)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),Ct`
      <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(Ws(this,"auth/redirect"),Ct`
              <h1>Redirecting for Login</h1>
            `):e.view(e.params||{}):Ct`
              <h1>Authenticating</h1>
            `;if("redirect"in e){const i=e.redirect;if(typeof i=="string")return this.redirect(i),Ct`
              <h1>Redirecting to ${i}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:i}=t,s=new URLSearchParams(e),r=i+e;for(const a of this._cases){const o=a.route.match(r);if(o)return{...a,path:i,params:o,query:s}}}redirect(t){Le(this,"history/redirect",{href:t})}}Nt.styles=an`
    :host,
    main {
      display: contents;
    }
  `;bi([pi()],Nt.prototype,"_user");bi([pi()],Nt.prototype,"_match");const Wn=Object.freeze(Object.defineProperty({__proto__:null,Element:Nt,Switch:Nt},Symbol.toStringTag,{value:"Module"})),Jn=class _i extends HTMLElement{constructor(){if(super(),me(_i.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Jn.template=Jt`
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
  `;const yi=class $i extends HTMLElement{constructor(){super(),this._array=[],me($i.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(xi("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const i=new Event("change",{bubbles:!0}),s=e.value,r=e.closest("label");if(r){const a=Array.from(this.children).indexOf(r);this._array[a]=s,this.dispatchEvent(i)}}}),this.addEventListener("click",t=>{Oe(t,"button.add")?ie(t,"input-array:add"):Oe(t,"button.remove")&&ie(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Gn(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const i=Array.from(this.children).indexOf(e);this._array.splice(i,1),e.remove()}}};yi.template=Jt`
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
  `;let Vn=yi;function Gn(n,t){t.replaceChildren(),n.forEach((e,i)=>t.append(xi(e)))}function xi(n,t){const e=n===void 0?"":`value="${n}"`;return Jt`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}const Zn=Object.freeze(Object.defineProperty({__proto__:null,Element:Vn},Symbol.toStringTag,{value:"Module"}));function at(n){return Object.entries(n).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Kn=Object.defineProperty,Qn=Object.getOwnPropertyDescriptor,tr=(n,t,e,i)=>{for(var s=Qn(t,e),r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=a(t,e,s)||s);return s&&Kn(t,e,s),s};class D extends ut{constructor(t){super(),this._pending=[],this._observer=new et(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([i,s])=>{console.log("Dispatching queued event",s,i),i.dispatchEvent(s)}),e.setEffect(()=>{var i;if(console.log("View effect",this,e,(i=this._context)==null?void 0:i.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const i=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",i),e.dispatchEvent(i)):(console.log("Queueing message event",i),this._pending.push([e,i]))}ref(t){return this.model?this.model[t]:void 0}}tr([hi()],D.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const se=globalThis,Be=se.ShadowRoot&&(se.ShadyCSS===void 0||se.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,We=Symbol(),Ps=new WeakMap;let wi=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==We)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Be&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=Ps.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Ps.set(e,t))}return t}toString(){return this.cssText}};const er=n=>new wi(typeof n=="string"?n:n+"",void 0,We),C=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((i,s,r)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new wi(e,n,We)},sr=(n,t)=>{if(Be)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=se.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,n.appendChild(i)}},Cs=Be?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return er(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ir,defineProperty:nr,getOwnPropertyDescriptor:rr,getOwnPropertyNames:ar,getOwnPropertySymbols:or,getPrototypeOf:lr}=Object,J=globalThis,zs=J.trustedTypes,cr=zs?zs.emptyScript:"",ke=J.reactiveElementPolyfillSupport,Ut=(n,t)=>n,oe={toAttribute(n,t){switch(t){case Boolean:n=n?cr:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},Je=(n,t)=>!ir(n,t),Os={attribute:!0,type:String,converter:oe,reflect:!1,hasChanged:Je};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),J.litPropertyMetadata??(J.litPropertyMetadata=new WeakMap);class pt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Os){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&nr(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=rr(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get(){return s==null?void 0:s.call(this)},set(a){const o=s==null?void 0:s.call(this);r.call(this,a),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Os}static _$Ei(){if(this.hasOwnProperty(Ut("elementProperties")))return;const t=lr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ut("properties"))){const e=this.properties,i=[...ar(e),...or(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(Cs(s))}else t!==void 0&&e.push(Cs(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return sr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){var r;const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){const a=(((r=i.converter)==null?void 0:r.toAttribute)!==void 0?i.converter:oe).toAttribute(e,i.type);this._$Em=t,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(t,e){var r;const i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const a=i.getPropertyOptions(s),o=typeof a.converter=="function"?{fromAttribute:a.converter}:((r=a.converter)==null?void 0:r.fromAttribute)!==void 0?a.converter:oe;this._$Em=s,this[s]=o.fromAttribute(e,a.type),this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){if(i??(i=this.constructor.getPropertyOptions(t)),!(i.hasChanged??Je)(this[t],e))return;this.P(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,a]of this._$Ep)this[r]=a;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,a]of s)a.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],a)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(s=>{var r;return(r=s.hostUpdate)==null?void 0:r.call(s)}),this.update(e)):this._$EU()}catch(s){throw t=!1,this._$EU(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}pt.elementStyles=[],pt.shadowRootOptions={mode:"open"},pt[Ut("elementProperties")]=new Map,pt[Ut("finalized")]=new Map,ke==null||ke({ReactiveElement:pt}),(J.reactiveElementVersions??(J.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const It=globalThis,le=It.trustedTypes,Ts=le?le.createPolicy("lit-html",{createHTML:n=>n}):void 0,ki="$lit$",W=`lit$${Math.random().toFixed(9).slice(2)}$`,Si="?"+W,dr=`<${Si}>`,it=document,Lt=()=>it.createComment(""),Dt=n=>n===null||typeof n!="object"&&typeof n!="function",Ai=Array.isArray,hr=n=>Ai(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",Se=`[ 	
\f\r]`,zt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Rs=/-->/g,Us=/>/g,K=RegExp(`>|${Se}(?:([^\\s"'>=/]+)(${Se}*=${Se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Is=/'/g,Ms=/"/g,Ei=/^(?:script|style|textarea|title)$/i,pr=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),u=pr(1),_t=Symbol.for("lit-noChange"),O=Symbol.for("lit-nothing"),js=new WeakMap,tt=it.createTreeWalker(it,129);function Pi(n,t){if(!Array.isArray(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ts!==void 0?Ts.createHTML(t):t}const ur=(n,t)=>{const e=n.length-1,i=[];let s,r=t===2?"<svg>":"",a=zt;for(let o=0;o<e;o++){const l=n[o];let f,m,h=-1,c=0;for(;c<l.length&&(a.lastIndex=c,m=a.exec(l),m!==null);)c=a.lastIndex,a===zt?m[1]==="!--"?a=Rs:m[1]!==void 0?a=Us:m[2]!==void 0?(Ei.test(m[2])&&(s=RegExp("</"+m[2],"g")),a=K):m[3]!==void 0&&(a=K):a===K?m[0]===">"?(a=s??zt,h=-1):m[1]===void 0?h=-2:(h=a.lastIndex-m[2].length,f=m[1],a=m[3]===void 0?K:m[3]==='"'?Ms:Is):a===Ms||a===Is?a=K:a===Rs||a===Us?a=zt:(a=K,s=void 0);const d=a===K&&n[o+1].startsWith("/>")?" ":"";r+=a===zt?l+dr:h>=0?(i.push(f),l.slice(0,h)+ki+l.slice(h)+W+d):l+W+(h===-2?o:d)}return[Pi(n,r+(n[e]||"<?>")+(t===2?"</svg>":"")),i]};class Ht{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,a=0;const o=t.length-1,l=this.parts,[f,m]=ur(t,e);if(this.el=Ht.createElement(f,i),tt.currentNode=this.el.content,e===2){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=tt.nextNode())!==null&&l.length<o;){if(s.nodeType===1){if(s.hasAttributes())for(const h of s.getAttributeNames())if(h.endsWith(ki)){const c=m[a++],d=s.getAttribute(h).split(W),p=/([.?@])?(.*)/.exec(c);l.push({type:1,index:r,name:p[2],strings:d,ctor:p[1]==="."?mr:p[1]==="?"?gr:p[1]==="@"?vr:ve}),s.removeAttribute(h)}else h.startsWith(W)&&(l.push({type:6,index:r}),s.removeAttribute(h));if(Ei.test(s.tagName)){const h=s.textContent.split(W),c=h.length-1;if(c>0){s.textContent=le?le.emptyScript:"";for(let d=0;d<c;d++)s.append(h[d],Lt()),tt.nextNode(),l.push({type:2,index:++r});s.append(h[c],Lt())}}}else if(s.nodeType===8)if(s.data===Si)l.push({type:2,index:r});else{let h=-1;for(;(h=s.data.indexOf(W,h+1))!==-1;)l.push({type:7,index:r}),h+=W.length-1}r++}}static createElement(t,e){const i=it.createElement("template");return i.innerHTML=t,i}}function yt(n,t,e=n,i){var a,o;if(t===_t)return t;let s=i!==void 0?(a=e._$Co)==null?void 0:a[i]:e._$Cl;const r=Dt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==r&&((o=s==null?void 0:s._$AO)==null||o.call(s,!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=s:e._$Cl=s),s!==void 0&&(t=yt(n,s._$AS(n,t.values),s,i)),t}class fr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=((t==null?void 0:t.creationScope)??it).importNode(e,!0);tt.currentNode=s;let r=tt.nextNode(),a=0,o=0,l=i[0];for(;l!==void 0;){if(a===l.index){let f;l.type===2?f=new Gt(r,r.nextSibling,this,t):l.type===1?f=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(f=new br(r,this,t)),this._$AV.push(f),l=i[++o]}a!==(l==null?void 0:l.index)&&(r=tt.nextNode(),a++)}return tt.currentNode=it,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Gt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=O,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=yt(this,t,e),Dt(t)?t===O||t==null||t===""?(this._$AH!==O&&this._$AR(),this._$AH=O):t!==this._$AH&&t!==_t&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):hr(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==O&&Dt(this._$AH)?this._$AA.nextSibling.data=t:this.T(it.createTextNode(t)),this._$AH=t}$(t){var r;const{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Ht.createElement(Pi(i.h,i.h[0]),this.options)),i);if(((r=this._$AH)==null?void 0:r._$AD)===s)this._$AH.p(e);else{const a=new fr(s,this),o=a.u(this.options);a.p(e),this.T(o),this._$AH=a}}_$AC(t){let e=js.get(t.strings);return e===void 0&&js.set(t.strings,e=new Ht(t)),e}k(t){Ai(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Gt(this.S(Lt()),this.S(Lt()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class ve{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=O,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=O}_$AI(t,e=this,i,s){const r=this.strings;let a=!1;if(r===void 0)t=yt(this,t,e,0),a=!Dt(t)||t!==this._$AH&&t!==_t,a&&(this._$AH=t);else{const o=t;let l,f;for(t=r[0],l=0;l<r.length-1;l++)f=yt(this,o[i+l],e,l),f===_t&&(f=this._$AH[l]),a||(a=!Dt(f)||f!==this._$AH[l]),f===O?t=O:t!==O&&(t+=(f??"")+r[l+1]),this._$AH[l]=f}a&&!s&&this.j(t)}j(t){t===O?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class mr extends ve{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===O?void 0:t}}class gr extends ve{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==O)}}class vr extends ve{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=yt(this,t,e,0)??O)===_t)return;const i=this._$AH,s=t===O&&i!==O||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==O&&(i===O||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class br{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){yt(this,t)}}const Ae=It.litHtmlPolyfillSupport;Ae==null||Ae(Ht,Gt),(It.litHtmlVersions??(It.litHtmlVersions=[])).push("3.1.3");const _r=(n,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let s=i._$litPart$;if(s===void 0){const r=(e==null?void 0:e.renderBefore)??null;i._$litPart$=s=new Gt(t.insertBefore(Lt(),r),r,void 0,e??{})}return s._$AI(n),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class q extends pt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=_r(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return _t}}var Ds;q._$litElement$=!0,q.finalized=!0,(Ds=globalThis.litElementHydrateSupport)==null||Ds.call(globalThis,{LitElement:q});const Ee=globalThis.litElementPolyfillSupport;Ee==null||Ee({LitElement:q});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");const yr={};function $r(n,t,e){switch(n[0]){case"properties/save":xr(n[1],e).then(s=>t(r=>({...r,property:s}))).then(()=>{const{onSuccess:s}=n[1];s&&s()}).catch(s=>{const{onFailure:r}=n[1];r&&r(s)});break;case"properties/select":wr(n[1],e).then(s=>t(r=>({...r,property:s})));break;case"properties/":kr(n[1],e).then(s=>t(r=>({...r,properties:s})));break;case"roles/save":Sr(n[1],e).then(s=>t(r=>({...r,role:s})));break;case"roles/select":Ar(n[1],e).then(s=>t(r=>({...r,role:s})));break;case"roles/":Er(e).then(s=>t(r=>({...r,roles:s})));break;case"appointments/select":Pr(n[1],e).then(s=>t(r=>({...r,appointment:s})));break;case"appointments/":Cr(n[1],e).then(s=>t(r=>({...r,appointments:s})));break;case"plans/select":Zt(n[1],e).then(s=>t(r=>({...r,plan:s})));break;case"plans/":zr(n[1],e).then(s=>t(r=>({...r,plans:s})));break;case"plans/staff/add":Or(n[1],e).then(s=>t(r=>({...r,plan:s})));break;case"plans/staff/remove":Tr(n[1],e).then(s=>t(r=>({...r,plan:s})));break;case"plans/appointment/add":Rr(n[1],e).then(s=>t(r=>({...r,plan:s})));break;case"plans/appointment/remove":Ur(n[1],e).then(s=>t(r=>({...r,plan:s})));break;case"plans/build":Ir(n[1],e).then(s=>{t(r=>({...r,build_error:s}))});break;case"plans/copy":Mr(n[1],e).then(s=>{t(r=>({...r,build_error:s}))});break;case"plans/send":jr(n[1],e).then(s=>{t(r=>({...r,build_error:s}))});break;case"plans/add":Nr(n[1],e).then(s=>{t(r=>({...r,build_error:s}))});break;case"staff/select":Lr(n[1],e).then(s=>t(r=>({...r,staff_member:s})));break;case"staff/":Dr(n[1],e).then(s=>t(r=>({...r,staff:s})));break;case"services/":Hr(e).then(s=>t(r=>({...r,services:s})));break;case"available/save":t(s=>({...s,available:n[1].available}));break;case"omissions/save":t(s=>({...s,omissions:n[1].omissions}));break;case"build_error/reset":t(s=>({...s,build_error:void 0}));break;default:const i=n[0];throw new Error(`Unhandled Auth message "${i}"`)}}function xr(n,t){return fetch(`/api/properties/${n.properties_id}`,{method:"PUT",headers:{"Content-Type":"application/json",...E.headers(t)},body:JSON.stringify(n.property)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function wr(n,t){return fetch(`/api/properties/${n.properties_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Property:",e),e})}function kr(n,t){let e="/api/properties";if(n.filter_status_ids&&n.filter_status_ids.length>0){const i=n.filter_status_ids.map(s=>`filter_status_id=${s}`).join("&");e+=`?${i}`}return fetch(e,{headers:E.headers(t)}).then(i=>{if(i.status===200)return i.json()}).then(i=>{if(i)return console.log("Properties:",i),i})}function Sr(n,t){return fetch(`/api/roles/${n.role_id}`,{method:"PUT",headers:{"Content-Type":"application/json",...E.headers(t)},body:JSON.stringify(n.role)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function Ar(n,t){return fetch(`/api/roles/${n.role_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Role:",e),e})}function Er(n){return fetch("/api/roles",{headers:E.headers(n)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Roles:",t),t})}function Pr(n,t){return fetch(`/api/appointments/${n.appointment_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Appointment:",e),e})}function Cr(n,t){let e=`/api/appointments?from_service_date=${n.from_service_date}&to_service_date=${n.to_service_date}`;if(n.per_page&&(e+=`&per_page=${n.per_page}`),n.page&&(e+=`&page=${n.page}`),n.filter_status_ids&&n.filter_status_ids.length>0){const i=n.filter_status_ids.map(s=>`filter_status_id=${s}`).join("&");e+=`&${i}`}if(n.filter_service_ids&&n.filter_service_ids.length>0){const i=n.filter_service_ids.map(s=>`filter_service_id=${s}`).join("&");e+=`&${i}`}return fetch(e,{headers:E.headers(t)}).then(i=>{if(i.status===200)return i.json()}).then(i=>{if(i)return console.log("Appointments:",i),i})}function Zt(n,t){return fetch(`/api/plans/${n.plan_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Plan:",e),e})}function zr(n,t){let e=`/api/plans?from_plan_date=${n.from_plan_date}`;return n.to_plan_date&&(e+=`&to_plan_date=${n.to_plan_date}`),n.per_page&&(e+=`&per_page=${n.per_page}`),n.page&&(e+=`&page=${n.page}`),fetch(e,{headers:E.headers(t)}).then(i=>{if(i.status===200)return i.json()}).then(i=>{if(i)return console.log("Plans:",i),i})}function Or(n,t){return fetch(`/api/plans/${n.plan_id}/staff/${n.user_id}`,{method:"POST",headers:E.headers(t)}).then(e=>{if(e.status===204)return Zt(n,t)})}function Tr(n,t){return fetch(`/api/plans/${n.plan_id}/staff/${n.user_id}`,{method:"DELETE",headers:E.headers(t)}).then(e=>{if(e.status===204)return Zt(n,t)})}function Rr(n,t){return fetch(`/api/plans/${n.plan_id}/appointment/${n.appointment_id}`,{method:"POST",headers:E.headers(t)}).then(e=>{if(e.status===204)return Zt(n,t)})}function Ur(n,t){return fetch(`/api/plans/${n.plan_id}/appointment/${n.appointment_id}`,{method:"DELETE",headers:E.headers(t)}).then(e=>{if(e.status===204)return Zt(n,t)})}function Ir(n,t){return fetch(`/api/plans/build/${n.plan_date}`,{method:"POST",headers:{"Content-Type":"application/json",...E.headers(t)},body:JSON.stringify(n.build_options)}).then(e=>{if(e.status===400)return e.json()}).then(e=>{if(e){const i=e;return i.details?i:void 0}})}function Mr(n,t){return fetch(`/api/plans/copy/${n.plan_date}`,{method:"POST",headers:E.headers(t)}).then(e=>{if(e.status===400)return e.json()}).then(e=>{if(e){const i=e;return i.details?i:void 0}})}function jr(n,t){return fetch(`/api/plans/send/${n.plan_date}`,{method:"POST",headers:E.headers(t)}).then(e=>{if(e.status===400)return e.json()}).then(e=>{if(e){const i=e;return i.details?i:void 0}})}function Nr(n,t){return fetch(`/api/plans/add/${n.plan_date}`,{method:"POST",headers:E.headers(t)}).then(e=>{if(e.status===400)return e.json()}).then(e=>{if(e){const i=e;return i.details?i:void 0}})}function Lr(n,t){return fetch(`/api/staff/${n.user_id}`,{headers:E.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Staff Member:",e),e})}function Dr(n,t){let e="/api/staff";if(n.filter_status_ids&&n.filter_status_ids.length>0){const i=n.filter_status_ids.map(s=>`filter_status_id=${s}`).join("&");e+=`?${i}`,n.filter_can_clean&&(e+="&filter_can_clean=true")}else n.filter_can_clean&&(e+="?filter_can_clean=true");return fetch(e,{headers:E.headers(t)}).then(i=>{if(i.status===200)return i.json()}).then(i=>{if(i)return console.log("Staff:",i),i})}function Hr(n){return fetch("/api/services",{headers:E.headers(n)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Services:",t),t})}class Tt extends Error{}Tt.prototype.name="InvalidTokenError";function qr(n){return decodeURIComponent(atob(n).replace(/(.)/g,(t,e)=>{let i=e.charCodeAt(0).toString(16).toUpperCase();return i.length<2&&(i="0"+i),"%"+i}))}function Fr(n){let t=n.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return qr(t)}catch{return atob(t)}}function Xr(n,t){if(typeof n!="string")throw new Tt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,i=n.split(".")[e];if(typeof i!="string")throw new Tt(`Invalid token specified: missing part #${e+1}`);let s;try{s=Fr(i)}catch(r){throw new Tt(`Invalid token specified: invalid base64 for part #${e+1} (${r.message})`)}try{return JSON.parse(s)}catch(r){throw new Tt(`Invalid token specified: invalid json for part #${e+1} (${r.message})`)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Yr={attribute:!0,type:String,converter:oe,reflect:!1,hasChanged:Je},Br=(n=Yr,t,e)=>{const{kind:i,metadata:s}=e;let r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),r.set(e.name,n),i==="accessor"){const{name:a}=e;return{set(o){const l=t.get.call(this);t.set.call(this,o),this.requestUpdate(a,l,n)},init(o){return o!==void 0&&this.P(a,void 0,n),o}}}if(i==="setter"){const{name:a}=e;return function(o){const l=this[a];t.call(this,o),this.requestUpdate(a,l,n)}}throw Error("Unsupported decorator location: "+i)};function U(n){return(t,e)=>typeof e=="object"?Br(n,t,e):((i,s,r)=>{const a=s.hasOwnProperty(r);return s.constructor.createProperty(r,a?{...i,wrapped:!0}:i),a?Object.getOwnPropertyDescriptor(s,r):void 0})(n,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function v(n){return U({...n,state:!0,attribute:!1})}var Wr=Object.defineProperty,Ci=(n,t,e,i)=>{for(var s=void 0,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=a(t,e,s)||s);return s&&Wr(t,e,s),s};const Ke=class Ke extends q{constructor(){super(...arguments),this.display_name="Status: 401",this.curr_href=window.location.href,this._authObserver=new et(this,"acorn:auth"),this._historyObserver=new et(this,"acorn:history")}displayNameTemplate(){return this.display_name==="Status: 401"||this.display_name==="Status: 403"?u`
                <box-icon name='user-circle' type='solid' color="var(--accent-color-red)" size="var(--icon-size)" ></box-icon>
                <span>Please <a href="/login.html?next=${this.curr_href}" style="color: var(--text-color-link);" @click=${Ns}>login</a></span>
            `:this.display_name===""?u`
                <box-icon name='user-circle' type='solid' color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
                <span>Hello, user</span>
            `:u`
                <box-icon name='user-circle' type='solid' color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
                <span>${this.display_name}</span>
            `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{const e=t;if(e&&e.token){const i=Xr(e.token);i&&(i.exp&&i.exp<Math.round(Date.now()/1e3)||i.role&&i.role==="anon"?this.display_name="Status: 403":this.display_name=i.user_metadata.display_name||"")}}),this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this.curr_href=t.href)})}toggleDarkMode(t){this.classList.toggle("dark-mode"),Wt.relay(t,"dark-mode:toggle",{})}toggleActive(){this.classList.toggle("active")}render(){return u`
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
                        <box-icon name='hard-hat' type='solid' color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
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
                    <a href="/login.html?next=${this.curr_href}" @click=${Ns}>
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
  `;let qt=Ke;Ci([U({attribute:!1})],qt.prototype,"display_name");Ci([U()],qt.prototype,"curr_href");function Ns(n){Wt.relay(n,"auth:message",["auth/signout"])}at({"restful-form":He.FormElement});class Jr extends q{render(){return u`
      <restful-form new src="/auth/login">
        <slot></slot>
      </restful-form>
    `}get next(){return new URLSearchParams(document.location.search).get("next")}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:i}={token:e.created.session.access_token},s=this.next||"/";console.log("Login successful",e,s),Wt.relay(t,"auth:message",["auth/signin",{token:i,redirect:s}])})}}at({"restful-form":He.FormElement});class Vr extends q{render(){return u`
      <restful-form new src="/auth/signup">
        <slot></slot>
      </restful-form>
    `}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:i}={token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxa2NneGZhcWhwcXJ5dGNpeHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAyNzU3ODQsImV4cCI6MjAyNTg1MTc4NH0.f2OUbu37RF-NMV1iSj16rBOgmcarmjnntUMNGLZm7Xc"},s="/";console.log("Signup successful",e,s),Wt.relay(t,"auth:message",["auth/signin",{token:i,redirect:s}])})}}const I=C`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
img {
  max-width: 100%;
}
`,M=C`
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

button[disabled] {
    opacity: 0.5;
    cursor: default;
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
`;var Gr={exports:{}};(function(n,t){(function(e,i,s,r,a){if("customElements"in s)a();else{if(s.AWAITING_WEB_COMPONENTS_POLYFILL)return void s.AWAITING_WEB_COMPONENTS_POLYFILL.then(a);var o=s.AWAITING_WEB_COMPONENTS_POLYFILL=m();o.then(a);var l=s.WEB_COMPONENTS_POLYFILL||"//cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.0.2/webcomponents-bundle.js",f=s.ES6_CORE_POLYFILL||"//cdnjs.cloudflare.com/ajax/libs/core-js/2.5.3/core.min.js";"Promise"in s?h(l).then(function(){o.isDone=!0,o.exec()}):h(f).then(function(){h(l).then(function(){o.isDone=!0,o.exec()})})}function m(){var c=[];return c.isDone=!1,c.exec=function(){c.splice(0).forEach(function(d){d()})},c.then=function(d){return c.isDone?d():c.push(d),c},c}function h(c){var d=m(),p=r.createElement("script");return p.type="text/javascript",p.readyState?p.onreadystatechange=function(){p.readyState!="loaded"&&p.readyState!="complete"||(p.onreadystatechange=null,d.isDone=!0,d.exec())}:p.onload=function(){d.isDone=!0,d.exec()},p.src=c,r.getElementsByTagName("head")[0].appendChild(p),p.then=d.then,p}})(0,0,window,document,function(){var e;e=function(){return function(i){var s={};function r(a){if(s[a])return s[a].exports;var o=s[a]={i:a,l:!1,exports:{}};return i[a].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=i,r.c=s,r.d=function(a,o,l){r.o(a,o)||Object.defineProperty(a,o,{enumerable:!0,get:l})},r.r=function(a){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(a,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(a,"__esModule",{value:!0})},r.t=function(a,o){if(1&o&&(a=r(a)),8&o||4&o&&typeof a=="object"&&a&&a.__esModule)return a;var l=Object.create(null);if(r.r(l),Object.defineProperty(l,"default",{enumerable:!0,value:a}),2&o&&typeof a!="string")for(var f in a)r.d(l,f,(function(m){return a[m]}).bind(null,f));return l},r.n=function(a){var o=a&&a.__esModule?function(){return a.default}:function(){return a};return r.d(o,"a",o),o},r.o=function(a,o){return Object.prototype.hasOwnProperty.call(a,o)},r.p="",r(r.s=5)}([function(i,s){i.exports=function(r){var a=[];return a.toString=function(){return this.map(function(o){var l=function(f,m){var h,c=f[1]||"",d=f[3];if(!d)return c;if(m&&typeof btoa=="function"){var p=(h=d,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(h))))+" */"),b=d.sources.map(function(_){return"/*# sourceURL="+d.sourceRoot+_+" */"});return[c].concat(b).concat([p]).join(`
`)}return[c].join(`
`)}(o,r);return o[2]?"@media "+o[2]+"{"+l+"}":l}).join("")},a.i=function(o,l){typeof o=="string"&&(o=[[null,o,""]]);for(var f={},m=0;m<this.length;m++){var h=this[m][0];typeof h=="number"&&(f[h]=!0)}for(m=0;m<o.length;m++){var c=o[m];typeof c[0]=="number"&&f[c[0]]||(l&&!c[2]?c[2]=l:l&&(c[2]="("+c[2]+") and ("+l+")"),a.push(c))}},a}},function(i,s,r){var a=r(3);i.exports=typeof a=="string"?a:a.toString()},function(i,s,r){var a=r(4);i.exports=typeof a=="string"?a:a.toString()},function(i,s,r){(i.exports=r(0)(!1)).push([i.i,"@-webkit-keyframes spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@keyframes spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@-webkit-keyframes burst{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}90%{-webkit-transform:scale(1.5);transform:scale(1.5);opacity:0}}@keyframes burst{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}90%{-webkit-transform:scale(1.5);transform:scale(1.5);opacity:0}}@-webkit-keyframes flashing{0%{opacity:1}45%{opacity:0}90%{opacity:1}}@keyframes flashing{0%{opacity:1}45%{opacity:0}90%{opacity:1}}@-webkit-keyframes fade-left{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(-20px);transform:translateX(-20px);opacity:0}}@keyframes fade-left{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(-20px);transform:translateX(-20px);opacity:0}}@-webkit-keyframes fade-right{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(20px);transform:translateX(20px);opacity:0}}@keyframes fade-right{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(20px);transform:translateX(20px);opacity:0}}@-webkit-keyframes fade-up{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(-20px);transform:translateY(-20px);opacity:0}}@keyframes fade-up{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(-20px);transform:translateY(-20px);opacity:0}}@-webkit-keyframes fade-down{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(20px);transform:translateY(20px);opacity:0}}@keyframes fade-down{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(20px);transform:translateY(20px);opacity:0}}@-webkit-keyframes tada{0%{-webkit-transform:scaleX(1);transform:scaleX(1)}10%,20%{-webkit-transform:scale3d(.95,.95,.95) rotate(-10deg);transform:scale3d(.95,.95,.95) rotate(-10deg)}30%,50%,70%,90%{-webkit-transform:scaleX(1) rotate(10deg);transform:scaleX(1) rotate(10deg)}40%,60%,80%{-webkit-transform:scaleX(1) rotate(-10deg);transform:scaleX(1) rotate(-10deg)}to{-webkit-transform:scaleX(1);transform:scaleX(1)}}@keyframes tada{0%{-webkit-transform:scaleX(1);transform:scaleX(1)}10%,20%{-webkit-transform:scale3d(.95,.95,.95) rotate(-10deg);transform:scale3d(.95,.95,.95) rotate(-10deg)}30%,50%,70%,90%{-webkit-transform:scaleX(1) rotate(10deg);transform:scaleX(1) rotate(10deg)}40%,60%,80%{-webkit-transform:rotate(-10deg);transform:rotate(-10deg)}to{-webkit-transform:scaleX(1);transform:scaleX(1)}}.bx-spin,.bx-spin-hover:hover{-webkit-animation:spin 2s linear infinite;animation:spin 2s linear infinite}.bx-tada,.bx-tada-hover:hover{-webkit-animation:tada 1.5s ease infinite;animation:tada 1.5s ease infinite}.bx-flashing,.bx-flashing-hover:hover{-webkit-animation:flashing 1.5s infinite linear;animation:flashing 1.5s infinite linear}.bx-burst,.bx-burst-hover:hover{-webkit-animation:burst 1.5s infinite linear;animation:burst 1.5s infinite linear}.bx-fade-up,.bx-fade-up-hover:hover{-webkit-animation:fade-up 1.5s infinite linear;animation:fade-up 1.5s infinite linear}.bx-fade-down,.bx-fade-down-hover:hover{-webkit-animation:fade-down 1.5s infinite linear;animation:fade-down 1.5s infinite linear}.bx-fade-left,.bx-fade-left-hover:hover{-webkit-animation:fade-left 1.5s infinite linear;animation:fade-left 1.5s infinite linear}.bx-fade-right,.bx-fade-right-hover:hover{-webkit-animation:fade-right 1.5s infinite linear;animation:fade-right 1.5s infinite linear}",""])},function(i,s,r){(i.exports=r(0)(!1)).push([i.i,'.bx-rotate-90{transform:rotate(90deg);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)"}.bx-rotate-180{transform:rotate(180deg);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)"}.bx-rotate-270{transform:rotate(270deg);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)"}.bx-flip-horizontal{transform:scaleX(-1);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)"}.bx-flip-vertical{transform:scaleY(-1);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)"}',""])},function(i,s,r){r.r(s),r.d(s,"BoxIconElement",function(){return At});var a,o,l,f,m=r(1),h=r.n(m),c=r(2),d=r.n(c),p=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(S){return typeof S}:function(S){return S&&typeof Symbol=="function"&&S.constructor===Symbol&&S!==Symbol.prototype?"symbol":typeof S},b=function(){function S(A,g){for(var y=0;y<g.length;y++){var $=g[y];$.enumerable=$.enumerable||!1,$.configurable=!0,"value"in $&&($.writable=!0),Object.defineProperty(A,$.key,$)}}return function(A,g,y){return g&&S(A.prototype,g),y&&S(A,y),A}}(),_=(o=(a=Object).getPrototypeOf||function(S){return S.__proto__},l=a.setPrototypeOf||function(S,A){return S.__proto__=A,S},f=(typeof Reflect>"u"?"undefined":p(Reflect))==="object"?Reflect.construct:function(S,A,g){var y,$=[null];return $.push.apply($,A),y=S.bind.apply(S,$),l(new y,g.prototype)},function(S){var A=o(S);return l(S,l(function(){return f(A,arguments,o(this).constructor)},A))}),k=window,G={},T=document.createElement("template"),ot=function(){return!!k.ShadyCSS};T.innerHTML=`
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
<div id="icon"></div>`;var At=_(function(S){function A(){(function(y,$){if(!(y instanceof $))throw new TypeError("Cannot call a class as a function")})(this,A);var g=function(y,$){if(!y)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!$||typeof $!="object"&&typeof $!="function"?y:$}(this,(A.__proto__||Object.getPrototypeOf(A)).call(this));return g.$ui=g.attachShadow({mode:"open"}),g.$ui.appendChild(g.ownerDocument.importNode(T.content,!0)),ot()&&k.ShadyCSS.styleElement(g),g._state={$iconHolder:g.$ui.getElementById("icon"),type:g.getAttribute("type")},g}return function(g,y){if(typeof y!="function"&&y!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof y);g.prototype=Object.create(y&&y.prototype,{constructor:{value:g,enumerable:!1,writable:!0,configurable:!0}}),y&&(Object.setPrototypeOf?Object.setPrototypeOf(g,y):g.__proto__=y)}(A,HTMLElement),b(A,null,[{key:"getIconSvg",value:function(g,y){var $=this.cdnUrl+"/regular/bx-"+g+".svg";return y==="solid"?$=this.cdnUrl+"/solid/bxs-"+g+".svg":y==="logo"&&($=this.cdnUrl+"/logos/bxl-"+g+".svg"),$&&G[$]||(G[$]=new Promise(function(j,N){var F=new XMLHttpRequest;F.addEventListener("load",function(){this.status<200||this.status>=300?N(new Error(this.status+" "+this.responseText)):j(this.responseText)}),F.onerror=N,F.onabort=N,F.open("GET",$),F.send()})),G[$]}},{key:"define",value:function(g){g=g||this.tagName,ot()&&k.ShadyCSS.prepareTemplate(T,g),customElements.define(g,this)}},{key:"cdnUrl",get:function(){return"//unpkg.com/boxicons@2.1.4/svg"}},{key:"tagName",get:function(){return"box-icon"}},{key:"observedAttributes",get:function(){return["type","name","color","size","rotate","flip","animation","border","pull"]}}]),b(A,[{key:"attributeChangedCallback",value:function(g,y,$){var j=this._state.$iconHolder;switch(g){case"type":(function(N,F,w){var x=N._state;x.$iconHolder.textContent="",x.type&&(x.type=null),x.type=!w||w!=="solid"&&w!=="logo"?"regular":w,x.currentName!==void 0&&N.constructor.getIconSvg(x.currentName,x.type).then(function(P){x.type===w&&(x.$iconHolder.innerHTML=P)}).catch(function(P){console.error("Failed to load icon: "+x.currentName+`
`+P)})})(this,0,$);break;case"name":(function(N,F,w){var x=N._state;x.currentName=w,x.$iconHolder.textContent="",w&&x.type!==void 0&&N.constructor.getIconSvg(w,x.type).then(function(P){x.currentName===w&&(x.$iconHolder.innerHTML=P)}).catch(function(P){console.error("Failed to load icon: "+w+`
`+P)})})(this,0,$);break;case"color":j.style.fill=$||"";break;case"size":(function(N,F,w){var x=N._state;x.size&&(x.$iconHolder.style.width=x.$iconHolder.style.height="",x.size=x.sizeType=null),w&&!/^(xs|sm|md|lg)$/.test(x.size)&&(x.size=w.trim(),x.$iconHolder.style.width=x.$iconHolder.style.height=x.size)})(this,0,$);break;case"rotate":y&&j.classList.remove("bx-rotate-"+y),$&&j.classList.add("bx-rotate-"+$);break;case"flip":y&&j.classList.remove("bx-flip-"+y),$&&j.classList.add("bx-flip-"+$);break;case"animation":y&&j.classList.remove("bx-"+y),$&&j.classList.add("bx-"+$)}}},{key:"connectedCallback",value:function(){ot()&&k.ShadyCSS.styleElement(this)}}]),A}());s.default=At,At.define()}])},n.exports=e()})})(Gr);const Qe=class Qe extends D{constructor(){super("acorn:model")}render(){return u`
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
    `}};Qe.styles=[I,M,C`
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
        `];let Ue=Qe;function Pe(n){Wt.relay(n,"auth:message",["auth/signout"])}var Zr=Object.defineProperty,Kr=Object.getOwnPropertyDescriptor,Ve=(n,t,e,i)=>{for(var s=i>1?void 0:i?Kr(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=(i?a(t,e,s):a(s))||s);return i&&s&&Zr(t,e,s),s};const Qr=[{id:1,label:"Active"},{id:2,label:"Inactive"},{id:3,label:"Unverified"}],ts=class ts extends D{constructor(){super("acorn:model"),this.filter_status_ids=[1,3]}get staff(){return this.model.staff}get showing_total(){return this.staff?this.staff.length:0}connectedCallback(){super.connectedCallback(),this.updateStaff()}updateStaff(){this.dispatchMessage(["staff/",{filter_status_ids:this.filter_status_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateStaff()}handleInputChange(t){const e=t.target,{name:i,value:s,type:r}=e;r==="checkbox"?this.handleCheckboxChange(t):this[i]=s}handleCheckboxChange(t){const e=t.target,{name:i}=e,s=i,r=parseInt(e.value);switch(s){case"staff_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,r]:this.filter_status_ids=this.filter_status_ids.filter(o=>o!==r);break;default:const a=s;throw new Error(`Unhandled Auth message "${a}"`)}}render(){const t=(s,r)=>{var a;switch(r){case"staff_status":a=this.filter_status_ids;break;default:const o=r;throw new Error(`Unhandled Auth message "${o}"`)}return u`
            <label>
            <input
                name=${r}
                type="checkbox"
                .value=${s.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${a.includes(s.id)}
            />
            ${s.label}
            </label>
        `},e=s=>{var r,a;return u`
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
                    ${(a=s.status)==null?void 0:a.status}
                    </span>
                </td>
            </tr>
        `},i=this.staff||[];return u`
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
                            ${Qr.map(s=>t(s,"staff_status"))}
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
    `}};ts.styles=[I,M,C`
            
        `];let $t=ts;Ve([v()],$t.prototype,"staff",1);Ve([v()],$t.prototype,"showing_total",1);Ve([v()],$t.prototype,"filter_status_ids",2);function Ls(n){const t=new Date(n),e={month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0,timeZone:"UTC"};return new Intl.DateTimeFormat("en-US",e).format(t)}function ta(n){const t=new Date(n),e={month:"2-digit",day:"2-digit",year:"numeric",timeZone:"UTC"};return new Intl.DateTimeFormat("en-US",e).format(t)}function Ie(n){var t=r=>("0"+r).slice(-2),e=r=>("00"+r).slice(-3),i=n.getTimezoneOffset(),s=i>0?"-":"+";return i=Math.abs(i),n.getFullYear()+"-"+t(n.getMonth()+1)+"-"+t(n.getDate())+"T"+t(n.getHours())+":"+t(n.getMinutes())+":"+t(n.getSeconds())+"."+e(n.getMilliseconds())+s+t(i/60|0)+":"+t(i%60)}var ea=Object.defineProperty,sa=Object.getOwnPropertyDescriptor,X=(n,t,e,i)=>{for(var s=i>1?void 0:i?sa(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=(i?a(t,e,s):a(s))||s);return i&&s&&ea(t,e,s),s};const ia=[{id:1,label:"Unconfirmed"},{id:2,label:"Confirmed"},{id:3,label:"Completed"},{id:4,label:"Completed (Invoiced)"},{id:5,label:"Cancelled"}],es=class es extends D{constructor(){super("acorn:model"),this.from_service_date=Ie(new Date).split("T")[0],this.to_service_date=Ie(new Date).split("T")[0],this.per_page=50,this.page=1,this.filter_status_ids=[1,2,3,4],this.filter_service_ids=[21942,23044]}get appointments(){return this.model.appointments}get services(){return this.model.services}get showing_total(){return this.appointments?this.appointments.length:0}get service_options(){return this.services?this.services.map(t=>({id:t.service_id,label:t.service_name})):[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["services/",{}]),this.updateAppointments()}updateAppointments(){const t=new Date(this.from_service_date),e=new Date(this.to_service_date);t>e&&(this.to_service_date=this.from_service_date),this.dispatchMessage(["appointments/",{from_service_date:this.from_service_date,to_service_date:this.to_service_date,per_page:this.per_page,page:this.page-1,filter_status_ids:this.filter_status_ids,filter_service_ids:this.filter_service_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateAppointments()}handleInputChange(t){const e=t.target,{name:i,value:s,type:r}=e;r==="checkbox"?this.handleCheckboxChange(t):this[i]=s}handleCheckboxChange(t){const e=t.target,{name:i}=e,s=i,r=parseInt(e.value);switch(s){case"app_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,r]:this.filter_status_ids=this.filter_status_ids.filter(o=>o!==r);break;case"app_service":e.checked?this.filter_service_ids=[...this.filter_service_ids,r]:this.filter_service_ids=this.filter_service_ids.filter(o=>o!==r);break;default:const a=s;throw new Error(`Unhandled Auth message "${a}"`)}}previousPage(){this.page>1&&(this.page--,this.updateAppointments())}nextPage(){this.page++,this.updateAppointments()}render(){const t=(r,a)=>{var o;switch(a){case"app_status":o=this.filter_status_ids;break;case"app_service":o=this.filter_service_ids;break;default:const l=a;throw new Error(`Unhandled Auth message "${l}"`)}return u`
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
        `},e=r=>u`
            <li>
                <span>${r.name}</span>
            </li>
        `,i=r=>{var a,o;return u`
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
                        ${r.turn_around?u`<box-icon name='revision' color="var(--text-color-body)" ></box-icon>`:u``}
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
        `},s=this.appointments||[];return u`
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
                            ${ia.map(r=>t(r,"app_status"))}
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
    `}};es.styles=[I,M,C`
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
        `];let L=es;X([v()],L.prototype,"appointments",1);X([v()],L.prototype,"services",1);X([v()],L.prototype,"showing_total",1);X([v()],L.prototype,"service_options",1);X([v()],L.prototype,"from_service_date",2);X([v()],L.prototype,"to_service_date",2);X([v()],L.prototype,"per_page",2);X([v()],L.prototype,"page",2);X([v()],L.prototype,"filter_status_ids",2);X([v()],L.prototype,"filter_service_ids",2);var na=Object.defineProperty,ra=Object.getOwnPropertyDescriptor,zi=(n,t,e,i)=>{for(var s=ra(t,e),r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=a(t,e,s)||s);return s&&na(t,e,s),s};const ss=class ss extends D{get roles(){return this.model.roles}get showing_total(){return this.roles?this.roles.length:0}constructor(){super("acorn:model")}connectedCallback(){super.connectedCallback(),this.updateRoles()}updateRoles(){this.dispatchMessage(["roles/",{}])}handleInputChange(t,e,i){const s=t.target;if(i==="priority")if(s.value)e[i]=parseInt(s.value);else return;else if(i==="can_lead_team"||i==="can_clean")e[i]=s.checked;else{if(i==="role_id")return;e[i]=s.value}this.dispatchMessage(["roles/save",{role_id:e.role_id,role:e}])}render(){const t=i=>u`
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
        `,e=this.roles||[];return u`
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
    `}};ss.styles=[I,M,C`
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
        `];let Ft=ss;zi([v()],Ft.prototype,"roles");zi([v()],Ft.prototype,"showing_total");var aa=Object.defineProperty,oa=Object.getOwnPropertyDescriptor,Ge=(n,t,e,i)=>{for(var s=i>1?void 0:i?oa(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=(i?a(t,e,s):a(s))||s);return i&&s&&aa(t,e,s),s};const la=[{id:1,label:"Active"},{id:2,label:"Inactive"}];function ca(n){const t=Math.floor(n/60),e=n%60;return!t&&!n?u`<box-icon name='error' color="var(--accent-color-red)"></box-icon>`:t?e&&t===1?`${t} Hour ${e} Minutes`:e?`${t} Hours ${e} Minutes`:t===1?`${t} Hour`:`${t} Hours`:`${e} Minutes`}const is=class is extends D{constructor(){super("acorn:model"),this.filter_status_ids=[1]}get properties(){return this.model.properties}get showing_total(){return this.properties?this.properties.length:0}connectedCallback(){super.connectedCallback(),this.updateProperties()}updateProperties(){this.dispatchMessage(["properties/",{filter_status_ids:this.filter_status_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateProperties()}handleInputChange(t){const e=t.target,{name:i,value:s,type:r}=e;r==="checkbox"?this.handleCheckboxChange(t):this[i]=s}handleCheckboxChange(t){const e=t.target,{name:i}=e,s=i,r=parseInt(e.value);switch(s){case"property_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,r]:this.filter_status_ids=this.filter_status_ids.filter(o=>o!==r);break;default:const a=s;throw new Error(`Unhandled Auth message "${a}"`)}}render(){const t=(r,a)=>{var o;switch(a){case"property_status":o=this.filter_status_ids;break;default:const l=a;throw new Error(`Unhandled Auth message "${l}"`)}return u`
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
        `},e=r=>u`
            <li>
                <span>${r}</span>
            </li>
        `,i=r=>{var a,o;return u`
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
                    ${ca(r.estimated_cleaning_mins)}
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
        `},s=this.properties||[];return u`
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
                            ${la.map(r=>t(r,"property_status"))}
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
    `}};is.styles=[I,M,C`
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
        `];let xt=is;Ge([v()],xt.prototype,"properties",1);Ge([v()],xt.prototype,"showing_total",1);Ge([v()],xt.prototype,"filter_status_ids",2);var da=Object.defineProperty,ha=Object.getOwnPropertyDescriptor,be=(n,t,e,i)=>{for(var s=i>1?void 0:i?ha(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=(i?a(t,e,s):a(s))||s);return i&&s&&da(t,e,s),s};const ns=class ns extends D{get staff(){return this.model.staff}get staff_options(){return this.staff&&this.plan&&this.plan.staff?this.staff.filter(t=>!this.plan.staff.map(e=>e.staff_info.user_id).includes(t.user_id)).map(t=>({id:t.user_id,label:t.name})):this.staff?this.staff.map(t=>({id:t.user_id,label:t.name})):[]}constructor(){super("acorn:model")}handleInputChange(t){const e=t.target,{name:i,value:s}=e;this[i]=s}addPlanStaff(){this.plan&&this.staff_to_add&&(this.dispatchMessage(["plans/staff/add",{plan_id:this.plan.plan_id,user_id:this.staff_to_add}]),this.requestPlanUpdate()),this.closeDialog(),this.staff_to_add=void 0}requestPlanUpdate(){const t=new CustomEvent("plan-view:update",{bubbles:!0,composed:!0,detail:{}});this.dispatchEvent(t)}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){const t=e=>u`
            <option value=${e.id}>${e.label}</option>
        `;return u`
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
    `}};ns.styles=[I,M,C`

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
        `];let nt=ns;be([v()],nt.prototype,"staff",1);be([U({attribute:!1})],nt.prototype,"plan",2);be([v()],nt.prototype,"staff_options",1);be([v()],nt.prototype,"staff_to_add",2);var pa=Object.defineProperty,ua=Object.getOwnPropertyDescriptor,_e=(n,t,e,i)=>{for(var s=i>1?void 0:i?ua(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=(i?a(t,e,s):a(s))||s);return i&&s&&pa(t,e,s),s};const rs=class rs extends D{get appointments(){return this.model.appointments}get appointment_options(){return this.appointments&&this.plan&&this.plan.appointments?this.appointments.filter(t=>!this.plan.appointments.map(e=>e.appointment_info.appointment_id).includes(t.appointment_id)).map(t=>({id:t.appointment_id,label:t.property_info.property_name})):this.appointments?this.appointments.map(t=>({id:t.appointment_id,label:t.property_info.property_name})):[]}constructor(){super("acorn:model")}handleInputChange(t){const e=t.target,{name:i,value:s}=e;this[i]=s}addPlanAppointment(){this.plan&&this.app_to_add&&(this.dispatchMessage(["plans/appointment/add",{plan_id:this.plan.plan_id,appointment_id:this.app_to_add}]),this.requestPlanUpdate()),this.closeDialog(),this.app_to_add=void 0}requestPlanUpdate(){const t=new CustomEvent("plan-view:update",{bubbles:!0,composed:!0,detail:{}});this.dispatchEvent(t)}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){const t=e=>u`
            <option value=${e.id}>${e.label}</option>
        `;return u`
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
    `}};rs.styles=[I,M,C`

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
        `];let rt=rs;_e([v()],rt.prototype,"appointments",1);_e([U({attribute:!1})],rt.prototype,"plan",2);_e([v()],rt.prototype,"appointment_options",1);_e([v()],rt.prototype,"app_to_add",2);var fa=Object.defineProperty,ma=Object.getOwnPropertyDescriptor,Oi=(n,t,e,i)=>{for(var s=i>1?void 0:i?ma(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=(i?a(t,e,s):a(s))||s);return i&&s&&fa(t,e,s),s};const he=class he extends D{get model_plan(){return this.model.plan}constructor(){super("acorn:model")}updated(t){super.updated(t);var e=this.model_plan;e&&(!this.plan||e.plan_id===this.plan.plan_id)&&(this.plan=e)}handleStaffRemove(t){const e=t.target,{name:i}=e;i!==void 0&&(this.dispatchMessage(["plans/staff/remove",{plan_id:this.plan.plan_id,user_id:parseInt(i)}]),this.requestPlanUpdate())}handleAppointmentRemove(t){const e=t.target,{name:i}=e;i!==void 0&&(this.dispatchMessage(["plans/appointment/remove",{plan_id:this.plan.plan_id,appointment_id:parseInt(i)}]),this.requestPlanUpdate())}requestPlanUpdate(){const t=new CustomEvent("plan-view:update",{bubbles:!0,composed:!0,detail:{}});this.dispatchEvent(t)}render(){if(!this.plan)return u`<section><p>Loading...</p></section>`;const t=i=>{var s,r;return u`
            <li>
                <span>${i.name}</span>
                <button class="trash" name=${i.user_id} @click=${this.handleStaffRemove} ?disabled=${((s=this.plan)==null?void 0:s.appointments[0])&&((r=this.plan)==null?void 0:r.appointments[0].sent_to_rc)!==null}> 
                    <box-icon name='trash' size="var(--text-font-size-body)" color="var(--accent-color-red)"></box-icon>
                </button>
            </li>
        `},e=i=>{var s,r;return u`
            <li>
                <span>${i.property_info.property_name}</span>
                <button class="trash" name=${i.appointment_id} @click=${this.handleAppointmentRemove} ?disabled=${((s=this.plan)==null?void 0:s.appointments[0])&&((r=this.plan)==null?void 0:r.appointments[0].sent_to_rc)!==null}> 
                    <box-icon name='trash' size="var(--text-font-size-body)" color="var(--accent-color-red)"></box-icon>
                </button>
            </li>
        `};return u`
        <section>
            <div>
                <p>ID: ${this.plan.plan_id}</p>
                <p>${this.plan.appointments[0]&&this.plan.appointments[0].sent_to_rc!==null?u`<box-icon name='upload' color="var(--text-color-body)" size="var(--text-font-size-body)"></box-icon>`:u``}</p>
                <p>${ta(this.plan.plan_date)}</p>
            </div>
            <h4>Team ${this.plan.team}</h4>
            <h5>Staff</h5>
            <ul>
                ${this.plan.staff.map(i=>t(i.staff_info))}
                <add-staff-modal .plan=${this.plan}></add-staff-modal>
            </ul>
            <h5>Appointments</h5>
            <ul>
                ${this.plan.appointments.map(i=>e(i.appointment_info))}
                <add-appointment-modal .plan=${this.plan}></add-appointment-modal>
            </ul>
        </section>
    `}};he.uses=at({"add-staff-modal":nt,"add-appointment-modal":rt}),he.styles=[I,M,C`
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

            button[disabled].trash:hover {
                background-color: var(--background-color);
            }
        `];let Xt=he;Oi([v()],Xt.prototype,"model_plan",1);Oi([U({attribute:!1})],Xt.prototype,"plan",2);var ga=Object.defineProperty,va=Object.getOwnPropertyDescriptor,Ze=(n,t,e,i)=>{for(var s=i>1?void 0:i?va(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=(i?a(t,e,s):a(s))||s);return i&&s&&ga(t,e,s),s};const as=class as extends D{constructor(){super("acorn:model"),this.init_load=!0,this.available_staff=[]}get staff(){return this.init_load&&this.model.staff&&(this.init_load=!1,this.selectAll(),this.updateAvailable()),this.model.staff}get staff_options(){return this.staff?this.staff.map(t=>({id:t.user_id,label:t.name})):[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["staff/",{filter_status_ids:[1],filter_can_clean:!0}])}updateAvailable(){this.dispatchMessage(["available/save",{available:this.available_staff}])}handleCheckboxChange(t){const e=t.target,{name:i}=e,s=i,r=parseInt(e.value);switch(s){case"available_staff":e.checked?this.available_staff=[...this.available_staff,r]:this.available_staff=this.available_staff.filter(o=>o!==r),this.updateAvailable();break;default:const a=s;throw new Error(`Unhandled Auth message "${a}"`)}}selectAll(){this.available_staff=this.staff.map(t=>t.user_id),this.updateAvailable()}clearSelection(){this.available_staff=[],this.updateAvailable()}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){const t=(s,r)=>{var a;switch(r){case"available_staff":a=this.available_staff;break;default:const o=r;throw new Error(`Unhandled Auth message "${o}"`)}return u`
            <label>
            <input
                name=${r}
                type="checkbox"
                .value=${s.id.toString()}
                @change=${this.handleCheckboxChange}
                ?checked=${a.includes(s.id)}
            />
            ${s.label}
            </label>
        `},e=s=>this.available_staff.includes(s.user_id)?u`
            <li>
                <span>${s.name}</span>
            </li>
        `:u``,i=this.staff||[];return u`
        <div class="multi-select">
        <button @click=${this.showModal}>
            <box-icon name='select-multiple' color='var(--text-color-body)'></box-icon>
            <span>Select Available Staff</span>
        </button>
        <ul class="staff">
            ${i.map(s=>e(s))}
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
                ${this.staff_options.map(s=>t(s,"available_staff"))}
            </div>
            </div>
        </dialog>
    `}};as.styles=[I,M,C`

            .staff {
                max-width: calc(var(--text-font-size-large) * 36);
            }

            .checkboxes {
                max-height: calc(var(--text-font-size-large) * 19.5);
                min-width: calc(var(--text-font-size-large) * 10);
            }
        `];let wt=as;Ze([v()],wt.prototype,"staff",1);Ze([v()],wt.prototype,"available_staff",2);Ze([v()],wt.prototype,"staff_options",1);var ba=Object.defineProperty,_a=Object.getOwnPropertyDescriptor,Kt=(n,t,e,i)=>{for(var s=i>1?void 0:i?_a(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=(i?a(t,e,s):a(s))||s);return i&&s&&ba(t,e,s),s};const os=class os extends D{constructor(){super("acorn:model"),this.appointment_omissions=[]}get appointments(){return this.model.appointments}get appointment_options(){return this.appointments&&this.date?this.appointments.map(t=>({id:t.appointment_id,label:t.property_info.property_name})):[]}connectedCallback(){super.connectedCallback()}attributeChangedCallback(t,e,i){super.attributeChangedCallback(t,e,i),t==="date"&&e!==i&&i&&this.updateAppointments()}updateAppointments(){this.dispatchMessage(["appointments/",{from_service_date:this.date,to_service_date:this.date,per_page:100,page:0,filter_status_ids:[1,2],filter_service_ids:this.services}])}updateOmissions(){this.dispatchMessage(["omissions/save",{omissions:this.appointment_omissions}])}handleCheckboxChange(t){const e=t.target,{name:i}=e,s=i,r=parseInt(e.value);switch(s){case"app_omissions":e.checked?this.appointment_omissions=[...this.appointment_omissions,r]:this.appointment_omissions=this.appointment_omissions.filter(o=>o!==r),this.updateOmissions();break;default:const a=s;throw new Error(`Unhandled Auth message "${a}"`)}}selectAll(){this.appointment_omissions=this.appointments.map(t=>t.appointment_id),this.updateOmissions}clearSelection(){this.appointment_omissions=[],this.updateOmissions}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){const t=(s,r)=>{var a;switch(r){case"app_omissions":a=this.appointment_omissions;break;default:const o=r;throw new Error(`Unhandled Auth message "${o}"`)}return u`
            <label>
            <input
                name=${r}
                type="checkbox"
                .value=${s.id.toString()}
                @change=${this.handleCheckboxChange}
                ?checked=${a.includes(s.id)}
            />
            ${s.label}
            </label>
        `},e=s=>this.appointment_omissions.includes(s.appointment_id)?u`
            <li>
                <span>${s.property_info.property_name}</span>
            </li>
        `:u``,i=this.appointments||[];return u`
        <div class="multi-select">
        <button @click=${this.showModal}>
            <box-icon name='select-multiple' color='var(--text-color-body)'></box-icon>
            <span>Select Omissions</span>
        </button>
        <ul class="appointments">
            ${i.map(s=>e(s))}
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
                    ${this.appointment_options.map(s=>t(s,"app_omissions"))}
                </div>
            </div>
        </dialog>
    `}};os.styles=[I,M,C`

            .appointments {
                max-width: calc(var(--spacing-size-medium) * 22);
            }

            .checkboxes {
                max-height: calc(var(--text-font-size-large) * 9.5);
                min-width: calc(var(--text-font-size-large) * 12);
            }
        `];let V=os;Kt([U({attribute:!1})],V.prototype,"services",2);Kt([U()],V.prototype,"date",2);Kt([v()],V.prototype,"appointments",1);Kt([v()],V.prototype,"appointment_omissions",2);Kt([v()],V.prototype,"appointment_options",1);var ya=Object.defineProperty,Ti=(n,t,e,i)=>{for(var s=void 0,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=a(t,e,s)||s);return s&&ya(t,e,s),s};const ls=class ls extends q{attributeChangedCallback(t,e,i){super.attributeChangedCallback(t,e,i),t==="code"&&e!==i&&i&&(i.split(":")[0]==="no-error"?e.split(":")[1]!==i.split(":")[1]&&this.requestPlanUpdate():this.show())}requestPlanUpdate(){const t=new CustomEvent("build-error-dialog:no-error",{bubbles:!0,composed:!0,detail:{}});this.dispatchEvent(t)}closeDialog(){this.shadowRoot.querySelector("dialog").close()}show(){this.shadowRoot.querySelector("dialog").show()}render(){const t=i=>i?u`
                <button @click=${this.show}>
                    <box-icon name='error-alt' type='solid' color="var(--accent-color-red)" size="var(--text-font-size-large)"></box-icon>
                </button>
            `:u`
                <button @click=${this.show} disabled>
                    <box-icon name='error-alt' color="var(--text-color-body)" size="var(--text-font-size-large)"></box-icon>
                </button>
            `,e=i=>i?u`
                <div class="spread-apart">
                    <h6>Code: ${i.code}</h6>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
                </div>
                <p>Error: ${i.details}</p>
                <P>Message: ${i.message}</P>
                <p>Hint: ${i.hint}</p>
            `:u``;return u`
        <div>
            ${t(this.error)}
        </div>
        <dialog class="error">
            <div class="dialog-content">
                ${e(this.error)}
            </div>
        </dialog>
    `}};ls.styles=[I,M,C`
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

        `];let Yt=ls;Ti([U({attribute:!1})],Yt.prototype,"error");Ti([U()],Yt.prototype,"code");var $a=Object.defineProperty,xa=(n,t,e,i)=>{for(var s=void 0,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=a(t,e,s)||s);return s&&$a(t,e,s),s};const cs=class cs extends q{closeDialog(){this.shadowRoot.querySelector("dialog").close()}show(){console.log("Showing Info ***"),this.shadowRoot.querySelector("dialog").show()}render(){return u`
        <div>
            <button @click=${this.show}>
                <box-icon name='info-circle' color="var(--text-color-body)" size="var(--text-font-size-body)"></box-icon>
            </button>
        </div>
        <dialog class="info">
            <div class="spread-apart info-header">
                    <h6>Info: ${this.name}</h6>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
            </div>
            <div class="dialog-content">
                <slot><p>Information Goes Here</p></slot>
            </div>
        </dialog>
    `}};cs.styles=[I,M,C`
            .info-header {
                gap: var(--spacing-size-large);
                margin-bottom: var(--spacing-size-medium);
            }

            dialog.info {
                top: 85%;
                left: 50%;
                -webkit-transform: translateX(-50%) translateY(-50%);
                -moz-transform: translateX(-50%) translateY(-50%);
                -ms-transform: translateX(-50%) translateY(-50%);
                transform: translateX(-50%) translateY(-50%);
                max-width: calc(var(--spacing-size-large) * 25);
            }

            .dialog-content {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-evenly;
                width: 100%;
                gap: var(--spacing-size-medium);
            }

            button {
                padding: 0;
            }

            .close {
                padding: 0;
            }

            p {
                color: var(--accent-color-red);
            }

        `];let ce=cs;xa([U()],ce.prototype,"name");var wa=Object.defineProperty,ka=Object.getOwnPropertyDescriptor,H=(n,t,e,i)=>{for(var s=i>1?void 0:i?ka(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=(i?a(t,e,s):a(s))||s);return i&&s&&wa(t,e,s),s};const pe=class pe extends D{constructor(){super("acorn:model"),this.build_count=0,this.from_plan_date=Ie(new Date).split("T")[0],this.per_page=10,this.page=1,this.filter_service_ids=[21942,23044],this.routing_type=1,this.cleaning_window=6,this.max_hours=8,this.addEventListener("build-error-dialog:no-error",()=>{this.updatePlans()}),this.addEventListener("plan-view:update",()=>{this.updatePlans()})}get plans(){return this.model.plans}get services(){return this.model.services}get build_error(){return this.model.build_error}get showing_total(){return this.plans?this.plans.length:0}get service_options(){return this.services?this.services.map(t=>({id:t.service_id,label:t.service_name})):[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["services/",{}]),this.updatePlans()}updatePlans(){this.dispatchMessage(["plans/",{from_plan_date:this.from_plan_date,per_page:this.per_page,page:this.page-1}])}buildSchedule(){this.build_error&&this.dispatchMessage(["build_error/reset",{}]),this.dispatchMessage(["plans/build",{plan_date:this.from_plan_date,build_options:{available_staff:this.model.available?this.model.available:[],services:this.filter_service_ids,omissions:this.model.omissions?this.model.omissions:[],routing_type:this.routing_type,cleaning_window:this.cleaning_window,max_hours:this.max_hours,target_staff_count:this.target_staff_count}}]),this.build_count++}copySchedule(){this.dispatchMessage(["plans/copy",{plan_date:this.from_plan_date}]),this.build_count++}sendSchedule(){this.dispatchMessage(["plans/send",{plan_date:this.from_plan_date}]),this.build_count++,this.closeSendModal()}addPlan(){this.dispatchMessage(["plans/add",{plan_date:this.from_plan_date}]),this.build_count++}handleTableOptionChange(t){this.handleInputChange(t);const e=t.target,{name:i}=e;(i==="per_page"||i==="from_plan_date")&&this.updatePlans()}handleInputChange(t){const e=t.target,{name:i,value:s,type:r}=e;r==="checkbox"?this.handleCheckboxChange(t):this[i]=s}handleCheckboxChange(t){const e=t.target,{name:i}=e,s=i,r=parseInt(e.value);switch(s){case"app_service":e.checked?this.filter_service_ids=[...this.filter_service_ids,r]:this.filter_service_ids=this.filter_service_ids.filter(o=>o!==r);break;default:const a=s;throw new Error(`Unhandled Auth message "${a}"`)}}previousPage(){this.page>1&&(this.page--,this.updatePlans())}nextPage(){this.page++,this.updatePlans()}closeSendModal(){this.shadowRoot.querySelector("dialog.send-modal").close()}showSendModal(){this.shadowRoot.querySelector("dialog.send-modal").showModal()}render(){const t=(s,r)=>{var a;switch(r){case"app_service":a=this.filter_service_ids;break;default:const o=r;throw new Error(`Unhandled Auth message "${o}"`)}return u`
            <label>
            <input
                name=${r}
                type="checkbox"
                .value=${s.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${a.includes(s.id)}
            />
            ${s.label}
            </label>
        `},e=s=>u`
            <plan-view .plan=${s}></plan-view>
        `,i=this.plans||[];return u`
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
                <menu class="table-menu options-menu">
                    <div>
                        <span>Services:</span>
                        <div class="filters">
                            ${this.service_options.map(s=>t(s,"app_service"))}
                        </div>
                    </div>
                    <omissions-modal date=${this.from_plan_date} .services=${this.filter_service_ids}></omissions-modal>
                    <div class="labeled-options">
                        <div>
                            <label>
                                <info-dialog name="Routing Type">
                                    <p>Determines start and end nodes used in Traveling Sales Person routing algorithm.</p>
                                </info-dialog>
                                <span>Routing Type:</span>
                                <select name="routing_type" .value=${this.routing_type.toString()} @change=${this.handleTableOptionChange} >
                                    <option value="1">Farthest to Office (Recommended)</option>
                                    <option value="2">Farthest to Anywhere</option>
                                    <option value="3">Office to Farthest</option>
                                    <option value="4">Office to Anywhere</option>
                                    <option value="4">Start and end Anywhere</option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>
                                <info-dialog name="Cleaning Window">
                                    <p>Assumed Cleaning Window (hours) used for estimating number of cleaners needed for a day.</p>
                                    <p>Lower this value to schedule more housekeepers</p>
                                    <p>Increase to be more optimistic and potentially schedule less housekeepers</p>
                                </info-dialog>
                                <span>Cleaning Window:</span>
                                <input name="cleaning_window" autocomplete="off" .value=${this.cleaning_window.toString()} type="number" @input=${this.handleTableOptionChange} />
                            </label>
                        </div>
                        <div>
                            <label>
                                <info-dialog name="Max Hours">
                                    <p>Max total field hours before a team times out (does not include travel to/from office).</p>
                                    <p>Lower this value if teams are getting too much to handle</p>                                </info-dialog>
                                <span>Max Hours:</span>
                                <input name="max_hours" autocomplete="off" .value=${this.max_hours.toString()} type="number" @input=${this.handleTableOptionChange} />
                            </label>
                        </div>
                        <div>
                            <label>
                                <info-dialog name="Target Staff Count">
                                    <p>Target number of staff to schedule.</p>
                                    <p>(Takes effect only if larger than calculated required number of staff)</p>
                                </info-dialog>
                                <span>Target Staff Count:</span>
                                <input name="target_staff_count" autocomplete="off" .value=${this.target_staff_count?this.target_staff_count.toString():""} type="number" @input=${this.handleTableOptionChange} />
                            </label>
                        </div>
                    </div>
                </menu>
                <div class="spread-apart">
                    <build-error-dialog code=${this.build_error?this.build_error.code:`no-error:${this.build_count}`} .error=${this.build_error}></build-error-dialog>
                    <button @click=${this.buildSchedule}>
                        <box-icon type='solid' name='wrench' color="var(--text-color-body)"></box-icon>
                        <span>Build</span>
                    </button>
                    <button class="copy" @click=${this.copySchedule} ?disabled=${!this.plans||this.plans.length<1||this.plans[0].appointments[0]&&this.plans[0].appointments[0].sent_to_rc===null}>
                        <box-icon name='copy' color="var(--text-color-body)"></box-icon>
                        <span>Copy</span>
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
                    ${i.map(s=>e(s))}
                    <div class="add-one">
                        <button @click=${this.addPlan}> 
                            <box-icon name='plus' size="var(--text-font-size-xlarge)" color="var(--text-color-body)"></box-icon>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    `}};pe.uses=at({"plan-view":Xt,"available-modal":wt,"omissions-modal":V,"build-error-dialog":Yt,"info-dialog":ce}),pe.styles=[I,M,C`

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

            menu.options-menu {
                gap: var(--spacing-size-xlarge);
            }

            .labeled-options {
                flex-grow: 1;
                max-width: calc(var(--spacing-size-large) * 30);
                width: 50%;
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-size-large);
            }

            .labeled-options > div > label {
                display: flex;
                align-items: center;
                gap: var(--spacing-size-xsmall);
            }

            .labeled-options > div > label > span {
                margin-right: var(--spacing-size-small);
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

            button[disabled].copy:hover {
                background-color: var(--background-color-accent);
            }
        `];let R=pe;H([v()],R.prototype,"plans",1);H([v()],R.prototype,"services",1);H([v()],R.prototype,"build_error",1);H([v()],R.prototype,"showing_total",1);H([v()],R.prototype,"service_options",1);H([v()],R.prototype,"from_plan_date",2);H([v()],R.prototype,"per_page",2);H([v()],R.prototype,"page",2);H([v()],R.prototype,"filter_service_ids",2);H([v()],R.prototype,"routing_type",2);H([v()],R.prototype,"cleaning_window",2);H([v()],R.prototype,"max_hours",2);H([v()],R.prototype,"target_staff_count",2);var Sa=Object.defineProperty,Aa=Object.getOwnPropertyDescriptor,St=(n,t,e,i)=>{for(var s=i>1?void 0:i?Aa(t,e):t,r=n.length-1,a;r>=0;r--)(a=n[r])&&(s=(i?a(t,e,s):a(s))||s);return i&&s&&Sa(t,e,s),s};const Ri=C`
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
`,ds=class ds extends q{render(){return u`
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
    `}};ds.styles=[I,M,Ri,C`
    ::slotted(ul) {
        list-style-type: none;
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-size-small);
        max-width: calc(var(--spacing-size-medium) * 16);
    }
    `];let de=ds;St([U()],de.prototype,"property",2);const ue=class ue extends q{render(){return u`
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
    `}};ue.uses=at({"mu-form":Gi.Element,"input-array":Zn.Element}),ue.styles=[I,M,Ri,C`
        mu-form {
        grid-column: key / end;
        }
        mu-form input {
        grid-column: input;
        }

        a.close {
            gap: 0;
        }
    `];let Bt=ue;St([U()],Bt.prototype,"property",2);St([U({attribute:!1})],Bt.prototype,"init",2);const fe=class fe extends D{constructor(){super("acorn:model"),this.edit=!1,this.properties_id=0}get property(){return this.model.property}attributeChangedCallback(t,e,i){super.attributeChangedCallback(t,e,i),t==="properties-id"&&e!==i&&i&&(console.log("Property Page:",i),this.dispatchMessage(["properties/select",{properties_id:parseInt(i)}]))}render(){const{properties_id:t,property_name:e,address:i,status:s,estimated_cleaning_mins:r,double_unit:a=[]}=this.property||{properties_id:0},o=a.map(f=>u`
        <li>${f}</li>
        `),l=u`
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
    `;return this.edit?u`
        <property-editor
            property=${t}
            .init=${this.property}
            @mu-form:submit=${f=>this._handleSubmit(f)}>
            ${l}
        </property-editor>
        `:u`
        <property-viewer property=${t}>
            ${l}
            <span slot="estimated_cleaning_mins">${r}</span>
            <ul slot="double_unit">
            ${o}
            </ul>
        </property-viewer>
        `}_handleSubmit(t){console.log("Handling submit of mu-form"),this.dispatchMessage(["properties/save",{properties_id:this.properties_id,property:t.detail,onSuccess:()=>Ks.dispatch(this,"history/navigate",{href:`/app/property/${this.properties_id}`}),onFailure:e=>console.log("ERROR:",e)}])}};fe.uses=at({"property-viewer":de,"property-editor":Bt}),fe.styles=[I,M,C`
        li {
            width: max-content;
            background-color: var(--background-color);
            border-radius: var(--border-size-radius);
            padding: 0 var(--spacing-size-small);
        }
    `];let kt=fe;St([U({type:Boolean,reflect:!0})],kt.prototype,"edit",2);St([U({attribute:"properties-id",reflect:!0,type:Number})],kt.prototype,"properties_id",2);St([v()],kt.prototype,"property",1);const Ea=[{path:"/app/appointments",view:()=>u`
      <appointments-view></appointments-view>
    `},{path:"/app/staff",view:()=>u`
      <staff-view></staff-view>
    `},{path:"/app/roles",view:()=>u`
      <roles-view></roles-view>
    `},{path:"/app/properties",view:()=>u`
      <properties-view></properties-view>
    `},{path:"/app/property/:id/edit",view:n=>u`
      <property-view edit properties-id=${n.id}></property-view>
    `},{path:"/app/property/:id",view:n=>u`
      <property-view properties-id=${n.id}></property-view>
    `},{path:"/app/schedule",view:()=>u`
      <plans-view></plans-view>
    `},{path:"/app",view:()=>u`
      <landing-view></landing-view>
    `},{path:"/",redirect:"/app"}];at({"mu-auth":E.Provider,"mu-store":class extends nn.Provider{constructor(){super($r,yr,"acorn:auth")}},"mu-history":Ks.Provider,"mu-switch":class extends Wn.Element{constructor(){super(Ea,"acorn:history","acorn:auth")}},"side-bar":qt,"login-form":Jr,"signup-form":Vr,"restful-form":He.FormElement,"landing-view":Ue,"staff-view":$t,"appointments-view":L,"roles-view":Ft,"properties-view":xt,"plans-view":R,"property-view":kt});export{E as a,at as d,Wt as e};
