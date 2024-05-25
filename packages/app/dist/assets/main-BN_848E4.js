(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();var je;let dt=class extends Error{};dt.prototype.name="InvalidTokenError";function ii(n){return decodeURIComponent(atob(n).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function ni(n){let t=n.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return ii(t)}catch{return atob(t)}}function ms(n,t){if(typeof n!="string")throw new dt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=n.split(".")[e];if(typeof s!="string")throw new dt(`Invalid token specified: missing part #${e+1}`);let i;try{i=ni(s)}catch(r){throw new dt(`Invalid token specified: invalid base64 for part #${e+1} (${r.message})`)}try{return JSON.parse(i)}catch(r){throw new dt(`Invalid token specified: invalid json for part #${e+1} (${r.message})`)}}const ri="mu:context",ce=`${ri}:change`;class oi{constructor(t,e){this._proxy=ai(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ge extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new oi(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ce,t),t}detach(t){this.removeEventListener(ce,t)}}function ai(n,t){return new Proxy(n,{get:(s,i,r)=>{if(i==="then")return;const o=Reflect.get(s,i,r);return console.log(`Context['${i}'] => `,o),o},set:(s,i,r,o)=>{const l=n[i];console.log(`Context['${i.toString()}'] <= `,r);const a=Reflect.set(s,i,r,o);if(a){let u=new CustomEvent(ce,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:i,oldValue:l,value:r}),t.dispatchEvent(u)}else console.log(`Context['${i}] was not set to ${r}`);return a}})}function li(n,t){const e=gs(t,n);return new Promise((s,i)=>{if(e){const r=e.localName;customElements.whenDefined(r).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function gs(n,t){const e=`[provides="${n}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return gs(n,i.host)}class ci extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function vs(n="mu:message"){return(t,...e)=>t.dispatchEvent(new ci(e,n))}class ve{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function hi(n){return t=>({...t,...n})}const he="mu:auth:jwt",Nt=class _s extends ve{constructor(t,e){super((s,i)=>this.update(s,i),t,_s.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(ui(s)),ee(i);case"auth/signout":return e(He()),ee(this._redirectForLogin);case"auth/redirect":return e(He()),ee(this._redirectForLogin,{next:window.location.href});default:const r=t[0];throw new Error(`Unhandled Auth message "${r}"`)}}};Nt.EVENT_TYPE="auth:message";Nt.dispatch=vs(Nt.EVENT_TYPE);let di=Nt;function ee(n,t={}){if(!n)return;const e=window.location.href,s=new URL(n,e);return Object.entries(t).forEach(([i,r])=>s.searchParams.set(i,r)),()=>{console.log("Redirecting to ",n),window.location.assign(s)}}class pi extends ge{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:et.authenticateFromLocalStorage()})}connectedCallback(){new di(this.context,this.redirect).attach(this)}}class tt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(he),t}}class et extends tt{constructor(t){super();const e=ms(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new et(t);return localStorage.setItem(he,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(he);return t?et.authenticate(t):new tt}}function ui(n){return hi({user:et.authenticate(n),token:n})}function He(){return n=>{const t=n.user;return{user:t&&t.authenticated?tt.deauthenticate(t):t,token:""}}}function fi(n){return n.authenticated?{Authorization:`Bearer ${n.token||"NO_TOKEN"}`}:{}}function mi(n){return n.authenticated?ms(n.token||""):{}}const y=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:et,Provider:pi,User:tt,headers:fi,payload:mi},Symbol.toStringTag,{value:"Module"}));function Mt(n,t,e){const s=n.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${n.type}:`,i),s.dispatchEvent(i),n.stopPropagation()}function de(n,t="*"){return n.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const Et=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:de,relay:Mt},Symbol.toStringTag,{value:"Module"})),gi=new DOMParser;function St(n,...t){const e=n.map((o,l)=>l?[t[l-1],o]:[o]).flat().join(""),s=gi.parseFromString(e,"text/html"),i=s.head.childElementCount?s.head.children:s.body.children,r=new DocumentFragment;return r.replaceChildren(...i),r}function qt(n){const t=n.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:s};function s(i,r={mode:"open"}){const o=i.attachShadow(r);return e&&o.appendChild(e.content.cloneNode(!0)),o}}const vi=class ys extends HTMLElement{constructor(){super(),this._state={},qt(ys.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),Mt(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},_i(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};vi.template=St`
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
  `;function _i(n,t){const e=Object.entries(n);for(const[s,i]of e){const r=t.querySelector(`[name="${s}"]`);if(r){const o=r;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return n}const bs=class $s extends ve{constructor(t){super((e,s)=>this.update(e,s),t,$s.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(bi(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e($i(s,i));break}}}};bs.EVENT_TYPE="history:message";let _e=bs;class De extends ge{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=yi(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ye(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new _e(this.context).attach(this)}}function yi(n){const t=n.currentTarget,e=s=>s.tagName=="A"&&s.href;if(n.button===0)if(n.composed){const i=n.composedPath().find(e);return i||void 0}else{for(let s=n.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function bi(n,t={}){return history.pushState(t,"",n),()=>({location:document.location,state:history.state})}function $i(n,t={}){return history.replaceState(t,"",n),()=>({location:document.location,state:history.state})}const ye=vs(_e.EVENT_TYPE),wi=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:De,Provider:De,Service:_e,dispatch:ye},Symbol.toStringTag,{value:"Module"}));class Pt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Fe(this._provider,t);this._effects.push(i),e(i)}else li(this._target,this._contextLabel).then(i=>{const r=new Fe(i,t);this._provider=i,this._effects.push(r),i.attach(o=>this._handleChange(o)),e(r)}).catch(i=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Fe{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const be=class ws extends HTMLElement{constructor(){super(),this._state={},this._user=new tt,this._authObserver=new Pt(this,"blazing:auth"),qt(ws.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;xi(i,this._state,e,this.authorization).then(r=>lt(r,this)).then(r=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:r,url:i}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},lt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&pe(this.src,this.authorization).then(e=>{this._state=e,lt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&pe(this.src,this.authorization).then(i=>{this._state=i,lt(i,this)});break;case"new":s&&(this._state={},lt({},this));break}}};be.observedAttributes=["src","new","action"];be.template=St`
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
  `;let Ai=be;function pe(n,t){return fetch(n,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${n}:`,e))}function lt(n,t){const e=Object.entries(n);for(const[s,i]of e){const r=t.querySelector(`[name="${s}"]`);if(r){const o=r;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return n}function xi(n,t,e="PUT",s={}){return fetch(n,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()}).catch(i=>console.log("Error submitting form:",i))}const $e=Object.freeze(Object.defineProperty({__proto__:null,FormElement:Ai,fetchData:pe},Symbol.toStringTag,{value:"Module"})),As=class xs extends ve{constructor(t,e){super(e,t,xs.EVENT_TYPE,!1)}};As.EVENT_TYPE="mu:message";let Es=As;class Ei extends ge{constructor(t,e,s){super(e),this._user=new tt,this._updateFn=t,this._authObserver=new Pt(this,s)}connectedCallback(){const t=new Es(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Si=Object.freeze(Object.defineProperty({__proto__:null,Provider:Ei,Service:Es},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rt=globalThis,we=Rt.ShadowRoot&&(Rt.ShadyCSS===void 0||Rt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ae=Symbol(),Be=new WeakMap;let Ss=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(we&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Be.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Be.set(e,t))}return t}toString(){return this.cssText}};const Pi=n=>new Ss(typeof n=="string"?n:n+"",void 0,Ae),ki=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new Ss(e,n,Ae)},Ci=(n,t)=>{if(we)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Rt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},Ve=we?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Pi(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ti,defineProperty:Oi,getOwnPropertyDescriptor:zi,getOwnPropertyNames:Ri,getOwnPropertySymbols:Ui,getPrototypeOf:Ni}=Object,st=globalThis,qe=st.trustedTypes,Mi=qe?qe.emptyScript:"",Ye=st.reactiveElementPolyfillSupport,ut=(n,t)=>n,Lt={toAttribute(n,t){switch(t){case Boolean:n=n?Mi:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},xe=(n,t)=>!Ti(n,t),Je={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:xe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),st.litPropertyMetadata??(st.litPropertyMetadata=new WeakMap);let K=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Je){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Oi(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=zi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);r.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Je}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=Ni(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,s=[...Ri(e),...Ui(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Ve(i))}else t!==void 0&&e.push(Ve(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ci(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Lt).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const o=i.getPropertyOptions(r),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Lt;this._$Em=r,this[r]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??xe)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,o]of i)o.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[ut("elementProperties")]=new Map,K[ut("finalized")]=new Map,Ye==null||Ye({ReactiveElement:K}),(st.reactiveElementVersions??(st.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const It=globalThis,jt=It.trustedTypes,We=jt?jt.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ps="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,ks="?"+O,Li=`<${ks}>`,B=document,gt=()=>B.createComment(""),vt=n=>n===null||typeof n!="object"&&typeof n!="function",Cs=Array.isArray,Ii=n=>Cs(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",se=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ze=/-->/g,Ge=/>/g,I=RegExp(`>|${se}(?:([^\\s"'>=/]+)(${se}*=${se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ke=/'/g,Xe=/"/g,Ts=/^(?:script|style|textarea|title)$/i,ji=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),ie=ji(1),it=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Qe=new WeakMap,H=B.createTreeWalker(B,129);function Os(n,t){if(!Array.isArray(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return We!==void 0?We.createHTML(t):t}const Hi=(n,t)=>{const e=n.length-1,s=[];let i,r=t===2?"<svg>":"",o=ct;for(let l=0;l<e;l++){const a=n[l];let u,f,d=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ct?f[1]==="!--"?o=Ze:f[1]!==void 0?o=Ge:f[2]!==void 0?(Ts.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=I):f[3]!==void 0&&(o=I):o===I?f[0]===">"?(o=i??ct,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,u=f[1],o=f[3]===void 0?I:f[3]==='"'?Xe:Ke):o===Xe||o===Ke?o=I:o===Ze||o===Ge?o=ct:(o=I,i=void 0);const h=o===I&&n[l+1].startsWith("/>")?" ":"";r+=o===ct?a+Li:d>=0?(s.push(u),a.slice(0,d)+Ps+a.slice(d)+O+h):a+O+(d===-2?l:h)}return[Os(n,r+(n[e]||"<?>")+(t===2?"</svg>":"")),s]};let ue=class zs{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const l=t.length-1,a=this.parts,[u,f]=Hi(t,e);if(this.el=zs.createElement(u,s),H.currentNode=this.el.content,e===2){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=H.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(Ps)){const c=f[o++],h=i.getAttribute(d).split(O),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:r,name:p[2],strings:h,ctor:p[1]==="."?Fi:p[1]==="?"?Bi:p[1]==="@"?Vi:Yt}),i.removeAttribute(d)}else d.startsWith(O)&&(a.push({type:6,index:r}),i.removeAttribute(d));if(Ts.test(i.tagName)){const d=i.textContent.split(O),c=d.length-1;if(c>0){i.textContent=jt?jt.emptyScript:"";for(let h=0;h<c;h++)i.append(d[h],gt()),H.nextNode(),a.push({type:2,index:++r});i.append(d[c],gt())}}}else if(i.nodeType===8)if(i.data===ks)a.push({type:2,index:r});else{let d=-1;for(;(d=i.data.indexOf(O,d+1))!==-1;)a.push({type:7,index:r}),d+=O.length-1}r++}}static createElement(t,e){const s=B.createElement("template");return s.innerHTML=t,s}};function nt(n,t,e=n,s){var i,r;if(t===it)return t;let o=s!==void 0?(i=e._$Co)==null?void 0:i[s]:e._$Cl;const l=vt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((r=o==null?void 0:o._$AO)==null||r.call(o,!1),l===void 0?o=void 0:(o=new l(n),o._$AT(n,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=nt(n,o._$AS(n,t.values),o,s)),t}let Di=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??B).importNode(e,!0);H.currentNode=i;let r=H.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new Ee(r,r.nextSibling,this,t):a.type===1?u=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(u=new qi(r,this,t)),this._$AV.push(u),a=s[++l]}o!==(a==null?void 0:a.index)&&(r=H.nextNode(),o++)}return H.currentNode=B,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},Ee=class Rs{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=nt(this,t,e),vt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==it&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ii(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==$&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(B.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ue.createElement(Os(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===r)this._$AH.p(s);else{const o=new Di(r,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Qe.get(t.strings);return e===void 0&&Qe.set(t.strings,e=new ue(t)),e}k(t){Cs(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new Rs(this.S(gt()),this.S(gt()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Yt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(r===void 0)t=nt(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==it,o&&(this._$AH=t);else{const l=t;let a,u;for(t=r[0],a=0;a<r.length-1;a++)u=nt(this,l[s+a],e,a),u===it&&(u=this._$AH[a]),o||(o=!vt(u)||u!==this._$AH[a]),u===$?t=$:t!==$&&(t+=(u??"")+r[a+1]),this._$AH[a]=u}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Fi=class extends Yt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}},Bi=class extends Yt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}},Vi=class extends Yt{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=nt(this,t,e,0)??$)===it)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},qi=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){nt(this,t)}};const ts=It.litHtmlPolyfillSupport;ts==null||ts(ue,Ee),(It.litHtmlVersions??(It.litHtmlVersions=[])).push("3.1.3");const Yi=(n,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const r=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new Ee(t.insertBefore(gt(),r),r,void 0,e??{})}return i._$AI(n),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Q=class extends K{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Yi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return it}};Q._$litElement$=!0,Q.finalized=!0,(je=globalThis.litElementHydrateSupport)==null||je.call(globalThis,{LitElement:Q});const es=globalThis.litElementPolyfillSupport;es==null||es({LitElement:Q});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ji={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:xe},Wi=(n=Ji,t,e)=>{const{kind:s,metadata:i}=e;let r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),r.set(e.name,n),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,n)},init(l){return l!==void 0&&this.P(o,void 0,n),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,n)}}throw Error("Unsupported decorator location: "+s)};function Us(n){return(t,e)=>typeof e=="object"?Wi(n,t,e):((s,i,r)=>{const o=i.hasOwnProperty(r);return i.constructor.createProperty(r,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,r):void 0})(n,t,e)}function Zi(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}function Gi(n){throw new Error('Could not dynamically require "'+n+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ns={};(function(n){var t=function(){var e=function(d,c,h,p){for(h=h||{},p=d.length;p--;h[d[p]]=c);return h},s=[1,9],i=[1,10],r=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,_,Gt){var x=_.length-1;switch(m){case 1:return new g.Root({},[_[x-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[_[x-1],_[x]]);break;case 4:case 5:this.$=_[x];break;case 6:this.$=new g.Literal({value:_[x]});break;case 7:this.$=new g.Splat({name:_[x]});break;case 8:this.$=new g.Param({name:_[x]});break;case 9:this.$=new g.Optional({},[_[x-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:r,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],_=this.table,Gt="",x=0,Me=0,Qs=2,Le=1,ti=m.slice.call(arguments,1),b=Object.create(this.lexer),M={yy:{}};for(var Kt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Kt)&&(M.yy[Kt]=this.yy[Kt]);b.setInput(c,M.yy),M.yy.lexer=b,M.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var Xt=b.yylloc;m.push(Xt);var ei=b.options&&b.options.ranges;typeof M.yy.parseError=="function"?this.parseError=M.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var si=function(){var Z;return Z=b.lex()||Le,typeof Z!="number"&&(Z=h.symbols_[Z]||Z),Z},A,L,E,Qt,W={},Ot,C,Ie,zt;;){if(L=p[p.length-1],this.defaultActions[L]?E=this.defaultActions[L]:((A===null||typeof A>"u")&&(A=si()),E=_[L]&&_[L][A]),typeof E>"u"||!E.length||!E[0]){var te="";zt=[];for(Ot in _[L])this.terminals_[Ot]&&Ot>Qs&&zt.push("'"+this.terminals_[Ot]+"'");b.showPosition?te="Parse error on line "+(x+1)+`:
`+b.showPosition()+`
Expecting `+zt.join(", ")+", got '"+(this.terminals_[A]||A)+"'":te="Parse error on line "+(x+1)+": Unexpected "+(A==Le?"end of input":"'"+(this.terminals_[A]||A)+"'"),this.parseError(te,{text:b.match,token:this.terminals_[A]||A,line:b.yylineno,loc:Xt,expected:zt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+L+", token: "+A);switch(E[0]){case 1:p.push(A),g.push(b.yytext),m.push(b.yylloc),p.push(E[1]),A=null,Me=b.yyleng,Gt=b.yytext,x=b.yylineno,Xt=b.yylloc;break;case 2:if(C=this.productions_[E[1]][1],W.$=g[g.length-C],W._$={first_line:m[m.length-(C||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(C||1)].first_column,last_column:m[m.length-1].last_column},ei&&(W._$.range=[m[m.length-(C||1)].range[0],m[m.length-1].range[1]]),Qt=this.performAction.apply(W,[Gt,Me,x,M.yy,E[1],g,m].concat(ti)),typeof Qt<"u")return Qt;C&&(p=p.slice(0,-1*C*2),g=g.slice(0,-1*C),m=m.slice(0,-1*C)),p.push(this.productions_[E[1]][0]),g.push(W.$),m.push(W._$),Ie=_[p[p.length-2]][p[p.length-1]],p.push(Ie);break;case 3:return!0}}return!0}},u=function(){var d={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var _ in m)this[_]=m[_];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),_=0;_<m.length;_++)if(p=this._input.match(this.rules[m[_]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=_,this.options.backtrack_lexer){if(c=this.test_match(p,m[_]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=u;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Gi<"u"&&(n.parser=t,n.Parser=t.Parser,n.parse=function(){return t.parse.apply(t,arguments)})})(Ns);function G(n){return function(t,e){return{displayName:n,props:t,children:e||[]}}}var Ms={Root:G("Root"),Concat:G("Concat"),Literal:G("Literal"),Splat:G("Splat"),Param:G("Param"),Optional:G("Optional")},Ls=Ns.parser;Ls.yy=Ms;var Ki=Ls,Xi=Object.keys(Ms);function Qi(n){return Xi.forEach(function(t){if(typeof n[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:n}}var Is=Qi,tn=Is,en=/[\-{}\[\]+?.,\\\^$|#\s]/g;function js(n){this.captures=n.captures,this.re=n.re}js.prototype.match=function(n){var t=this.re.exec(n),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var sn=tn({Concat:function(n){return n.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(n){return{re:n.props.value.replace(en,"\\$&"),captures:[]}},Splat:function(n){return{re:"([^?]*?)",captures:[n.props.name]}},Param:function(n){return{re:"([^\\/\\?]+)",captures:[n.props.name]}},Optional:function(n){var t=this.visit(n.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(n){var t=this.visit(n.children[0]);return new js({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),nn=sn,rn=Is,on=rn({Concat:function(n,t){var e=n.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(n){return decodeURI(n.props.value)},Splat:function(n,t){return t[n.props.name]?t[n.props.name]:!1},Param:function(n,t){return t[n.props.name]?t[n.props.name]:!1},Optional:function(n,t){var e=this.visit(n.children[0],t);return e||""},Root:function(n,t){t=t||{};var e=this.visit(n.children[0],t);return e?encodeURI(e):!1}}),an=on,ln=Ki,cn=nn,hn=an;kt.prototype=Object.create(null);kt.prototype.match=function(n){var t=cn.visit(this.ast),e=t.match(n);return e||!1};kt.prototype.reverse=function(n){return hn.visit(this.ast,n)};function kt(n){var t;if(this?t=this:t=Object.create(kt.prototype),typeof n>"u")throw new Error("A route spec is required");return t.spec=n,t.ast=ln.parse(n),t}var dn=kt,pn=dn,un=pn;const fn=Zi(un);var mn=Object.defineProperty,gn=(n,t,e,s)=>{for(var i=void 0,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&mn(t,e,i),i};class Ht extends Q{constructor(t,e){super(),this._cases=[],this._fallback=()=>ie`
      <h1>Not Found</h1>
    `,this._cases=t.map(s=>({...s,route:new fn(s.path)})),this._historyObserver=new Pt(this,e)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match),ie`
      <main>${(()=>{if(this._match){if("view"in this._match)return this._match.view(this._match.params||{});if("redirect"in this._match){const e=this._match.redirect;if(typeof e=="string")return this.redirect(e),ie`
              <h1>Redirecting to ${e}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),r=s+e;for(const o of this._cases){const l=o.route.match(r);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){ye(this,"history/redirect",{href:t})}}Ht.styles=ki`
    :host,
    main {
      display: contents;
    }
  `;gn([Us()],Ht.prototype,"_match");const vn=Object.freeze(Object.defineProperty({__proto__:null,Element:Ht,Switch:Ht},Symbol.toStringTag,{value:"Module"})),_n=class Hs extends HTMLElement{constructor(){if(super(),qt(Hs.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};_n.template=St`
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
  `;const yn=class Ds extends HTMLElement{constructor(){super(),this._array=[],qt(Ds.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Fs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,r=e.closest("label");if(r){const o=Array.from(this.children).indexOf(r);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{de(t,"button.add")?Mt(t,"input-array:add"):de(t,"button.remove")&&Mt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],bn(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};yn.template=St`
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
  `;function bn(n,t){t.replaceChildren(),n.forEach((e,s)=>t.append(Fs(e)))}function Fs(n,t){const e=n===void 0?"":`value="${n}"`;return St`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Jt(n){return Object.entries(n).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var $n=Object.defineProperty,wn=Object.getOwnPropertyDescriptor,An=(n,t,e,s)=>{for(var i=wn(t,e),r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&$n(t,e,i),i};class N extends Q{constructor(t){super(),this._pending=[],this._observer=new Pt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}An([Us()],N.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=globalThis,Se=Ut.ShadowRoot&&(Ut.ShadyCSS===void 0||Ut.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Pe=Symbol(),ss=new WeakMap;let Bs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Se&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=ss.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ss.set(e,t))}return t}toString(){return this.cssText}};const xn=n=>new Bs(typeof n=="string"?n:n+"",void 0,Pe),P=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new Bs(e,n,Pe)},En=(n,t)=>{if(Se)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Ut.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},is=Se?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return xn(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Sn,defineProperty:Pn,getOwnPropertyDescriptor:kn,getOwnPropertyNames:Cn,getOwnPropertySymbols:Tn,getPrototypeOf:On}=Object,R=globalThis,ns=R.trustedTypes,zn=ns?ns.emptyScript:"",ne=R.reactiveElementPolyfillSupport,ft=(n,t)=>n,Dt={toAttribute(n,t){switch(t){case Boolean:n=n?zn:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},ke=(n,t)=>!Sn(n,t),rs={attribute:!0,type:String,converter:Dt,reflect:!1,hasChanged:ke};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),R.litPropertyMetadata??(R.litPropertyMetadata=new WeakMap);class X extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=rs){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Pn(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=kn(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);r.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??rs}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const t=On(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const e=this.properties,s=[...Cn(e),...Tn(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(is(i))}else t!==void 0&&e.push(is(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return En(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var r;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:Dt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var r;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((r=o.converter)==null?void 0:r.fromAttribute)!==void 0?o.converter:Dt;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ke)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,o]of i)o.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}X.elementStyles=[],X.shadowRootOptions={mode:"open"},X[ft("elementProperties")]=new Map,X[ft("finalized")]=new Map,ne==null||ne({ReactiveElement:X}),(R.reactiveElementVersions??(R.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=globalThis,Ft=mt.trustedTypes,os=Ft?Ft.createPolicy("lit-html",{createHTML:n=>n}):void 0,Vs="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,qs="?"+z,Rn=`<${qs}>`,V=document,_t=()=>V.createComment(""),yt=n=>n===null||typeof n!="object"&&typeof n!="function",Ys=Array.isArray,Un=n=>Ys(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",re=`[ 	
\f\r]`,ht=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,as=/-->/g,ls=/>/g,j=RegExp(`>|${re}(?:([^\\s"'>=/]+)(${re}*=${re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),cs=/'/g,hs=/"/g,Js=/^(?:script|style|textarea|title)$/i,Nn=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),v=Nn(1),rt=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),ds=new WeakMap,D=V.createTreeWalker(V,129);function Ws(n,t){if(!Array.isArray(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return os!==void 0?os.createHTML(t):t}const Mn=(n,t)=>{const e=n.length-1,s=[];let i,r=t===2?"<svg>":"",o=ht;for(let l=0;l<e;l++){const a=n[l];let u,f,d=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ht?f[1]==="!--"?o=as:f[1]!==void 0?o=ls:f[2]!==void 0?(Js.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=j):f[3]!==void 0&&(o=j):o===j?f[0]===">"?(o=i??ht,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,u=f[1],o=f[3]===void 0?j:f[3]==='"'?hs:cs):o===hs||o===cs?o=j:o===as||o===ls?o=ht:(o=j,i=void 0);const h=o===j&&n[l+1].startsWith("/>")?" ":"";r+=o===ht?a+Rn:d>=0?(s.push(u),a.slice(0,d)+Vs+a.slice(d)+z+h):a+z+(d===-2?l:h)}return[Ws(n,r+(n[e]||"<?>")+(t===2?"</svg>":"")),s]};class bt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const l=t.length-1,a=this.parts,[u,f]=Mn(t,e);if(this.el=bt.createElement(u,s),D.currentNode=this.el.content,e===2){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=D.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(Vs)){const c=f[o++],h=i.getAttribute(d).split(z),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:r,name:p[2],strings:h,ctor:p[1]==="."?In:p[1]==="?"?jn:p[1]==="@"?Hn:Wt}),i.removeAttribute(d)}else d.startsWith(z)&&(a.push({type:6,index:r}),i.removeAttribute(d));if(Js.test(i.tagName)){const d=i.textContent.split(z),c=d.length-1;if(c>0){i.textContent=Ft?Ft.emptyScript:"";for(let h=0;h<c;h++)i.append(d[h],_t()),D.nextNode(),a.push({type:2,index:++r});i.append(d[c],_t())}}}else if(i.nodeType===8)if(i.data===qs)a.push({type:2,index:r});else{let d=-1;for(;(d=i.data.indexOf(z,d+1))!==-1;)a.push({type:7,index:r}),d+=z.length-1}r++}}static createElement(t,e){const s=V.createElement("template");return s.innerHTML=t,s}}function ot(n,t,e=n,s){var o,l;if(t===rt)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const r=yt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==r&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=ot(n,i._$AS(n,t.values),i,s)),t}class Ln{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??V).importNode(e,!0);D.currentNode=i;let r=D.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new Ct(r,r.nextSibling,this,t):a.type===1?u=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(u=new Dn(r,this,t)),this._$AV.push(u),a=s[++l]}o!==(a==null?void 0:a.index)&&(r=D.nextNode(),o++)}return D.currentNode=V,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Ct{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ot(this,t,e),yt(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==rt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Un(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==w&&yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(V.createTextNode(t)),this._$AH=t}$(t){var r;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=bt.createElement(Ws(s.h,s.h[0]),this.options)),s);if(((r=this._$AH)==null?void 0:r._$AD)===i)this._$AH.p(e);else{const o=new Ln(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=ds.get(t.strings);return e===void 0&&ds.set(t.strings,e=new bt(t)),e}k(t){Ys(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new Ct(this.S(_t()),this.S(_t()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Wt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=w}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(r===void 0)t=ot(this,t,e,0),o=!yt(t)||t!==this._$AH&&t!==rt,o&&(this._$AH=t);else{const l=t;let a,u;for(t=r[0],a=0;a<r.length-1;a++)u=ot(this,l[s+a],e,a),u===rt&&(u=this._$AH[a]),o||(o=!yt(u)||u!==this._$AH[a]),u===w?t=w:t!==w&&(t+=(u??"")+r[a+1]),this._$AH[a]=u}o&&!i&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class In extends Wt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}}class jn extends Wt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}}class Hn extends Wt{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=ot(this,t,e,0)??w)===rt)return;const s=this._$AH,i=t===w&&s!==w||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==w&&(s===w||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Dn{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ot(this,t)}}const oe=mt.litHtmlPolyfillSupport;oe==null||oe(bt,Ct),(mt.litHtmlVersions??(mt.litHtmlVersions=[])).push("3.1.3");const Fn=(n,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const r=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new Ct(t.insertBefore(_t(),r),r,void 0,e??{})}return i._$AI(n),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class F extends X{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Fn(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return rt}}var fs;F._$litElement$=!0,F.finalized=!0,(fs=globalThis.litElementHydrateSupport)==null||fs.call(globalThis,{LitElement:F});const ae=globalThis.litElementPolyfillSupport;ae==null||ae({LitElement:F});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");const Bn={};function Vn(n,t,e){switch(n[0]){case"properties/save":qn(n[1],e).then(i=>t(r=>({...r,property:i})));break;case"properties/select":Yn(n[1],e).then(i=>t(r=>({...r,property:i})));break;case"properties/":Jn(n[1],e).then(i=>t(r=>({...r,properties:i})));break;case"roles/save":Wn(n[1],e).then(i=>t(r=>({...r,role:i})));break;case"roles/select":Zn(n[1],e).then(i=>t(r=>({...r,role:i})));break;case"roles/":Gn(e).then(i=>t(r=>({...r,roles:i})));break;case"appointments/select":Kn(n[1],e).then(i=>t(r=>({...r,appointment:i})));break;case"appointments/":Xn(n[1],e).then(i=>t(r=>({...r,appointments:i})));break;case"plans/select":q(n[1],e).then(i=>t(r=>({...r,plan:i})));break;case"plans/":Zt(n[1],e).then(i=>t(r=>({...r,plans:i})));break;case"plans/staff/add":Qn(n[1],e).then(i=>t(r=>({...r,plan:i})));break;case"plans/staff/remove":tr(n[1],e).then(i=>t(r=>({...r,plan:i})));break;case"plans/appointment/add":er(n[1],e).then(i=>t(r=>({...r,plan:i})));break;case"plans/appointment/remove":sr(n[1],e).then(i=>t(r=>({...r,plan:i})));break;case"plans/build":ir(n[1],e).then(i=>t(r=>({...r,plans:i})));break;case"plans/send":nr(n[1],e).then(i=>t(r=>({...r,plans:i})));break;case"plans/add":rr(n[1],e).then(i=>t(r=>({...r,plans:i})));break;case"staff/select":or(n[1],e).then(i=>t(r=>({...r,staff_member:i})));break;case"staff/":ar(n[1],e).then(i=>t(r=>({...r,staff:i})));break;case"services/":lr(e).then(i=>t(r=>({...r,services:i})));break;default:const s=n[0];throw new Error(`Unhandled Auth message "${s}"`)}}function qn(n,t){return fetch(`/api/properties/${n.properties_id}`,{method:"PUT",headers:{"Content-Type":"application/json",...y.headers(t)},body:JSON.stringify(n.property)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function Yn(n,t){return fetch(`/api/properties/${n.properties_id}`,{headers:y.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Property:",e),e})}function Jn(n,t){let e="/api/properties";if(n.filter_status_ids&&n.filter_status_ids.length>0){const s=n.filter_status_ids.map(i=>`filter_status_id=${i}`).join("&");e+=`?${s}`}return fetch(e,{headers:y.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Properties:",s),s})}function Wn(n,t){return fetch(`/api/roles/${n.role_id}`,{method:"PUT",headers:{"Content-Type":"application/json",...y.headers(t)},body:JSON.stringify(n.role)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function Zn(n,t){return fetch(`/api/roles/${n.role_id}`,{headers:y.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Role:",e),e})}function Gn(n){return fetch("/api/roles",{headers:y.headers(n)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Roles:",t),t})}function Kn(n,t){return fetch(`/api/appointments/${n.appointment_id}`,{headers:y.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Appointment:",e),e})}function Xn(n,t){let e=`/api/appointments?from_service_date=${n.from_service_date}&to_service_date=${n.to_service_date}`;if(n.per_page&&(e+=`&per_page=${n.per_page}`),n.page&&(e+=`&page=${n.page}`),n.filter_status_ids&&n.filter_status_ids.length>0){const s=n.filter_status_ids.map(i=>`filter_status_id=${i}`).join("&");e+=`&${s}`}return fetch(e,{headers:y.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Appointments:",s),s})}function q(n,t){return fetch(`/api/plans/${n.plan_id}`,{headers:y.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Plan:",e),e})}function Zt(n,t){let e=`/api/plans?from_plan_date=${n.from_plan_date}`;return n.to_plan_date&&(e+=`&to_plan_date=${n.to_plan_date}`),n.per_page&&(e+=`&per_page=${n.per_page}`),n.page&&(e+=`&page=${n.page}`),fetch(e,{headers:y.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Plans:",s),s})}function Qn(n,t){return fetch(`/api/plans/${n.plan_id}/staff/${n.user_id}`,{method:"POST",headers:y.headers(t)}).then(e=>e.status===204?q(n,t):e.status===400?e.json():void 0).then(e=>{if(e){const s=e;return s.details&&(s.details==="REPEATED_ACTION"||s.details==="IMMUTABLE")?q(n,t):void 0}})}function tr(n,t){return fetch(`/api/plans/${n.plan_id}/staff/${n.user_id}`,{method:"DELETE",headers:y.headers(t)}).then(e=>{if(e.status===204)return q(n,t)})}function er(n,t){return fetch(`/api/plans/${n.plan_id}/appointment/${n.appointment_id}`,{method:"POST",headers:y.headers(t)}).then(e=>e.status===204?q(n,t):e.status===400?e.json():void 0).then(e=>{if(e){const s=e;return s.details&&(s.details==="REPEATED_ACTION"||s.details==="IMMUTABLE")?q(n,t):void 0}})}function sr(n,t){return fetch(`/api/plans/${n.plan_id}/appointment/${n.appointment_id}`,{method:"DELETE",headers:y.headers(t)}).then(e=>{if(e.status===204)return q(n,t)})}function ir(n,t){return fetch(`/api/plans/build/${n.plan_date}`,{method:"POST",headers:{"Content-Type":"application/json",...y.headers(t)},body:JSON.stringify(n.build_options)}).then(e=>{if(e.status===204)return Zt({from_plan_date:n.plan_date,to_plan_date:n.plan_date},t)})}function nr(n,t){return fetch(`/api/plans/send/${n.plan_date}`,{method:"POST",headers:y.headers(t)}).then(e=>{if(e.status===204)return Zt({from_plan_date:n.plan_date,to_plan_date:n.plan_date},t)})}function rr(n,t){return fetch(`/api/plans/add/${n.plan_date}`,{method:"POST",headers:y.headers(t)}).then(e=>{if(e.status===200)return Zt({from_plan_date:n.plan_date,to_plan_date:n.plan_date},t)})}function or(n,t){return fetch(`/api/staff/${n.user_id}`,{headers:y.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Staff Member:",e),e})}function ar(n,t){let e="/api/staff";if(n.filter_status_ids&&n.filter_status_ids.length>0){const s=n.filter_status_ids.map(i=>`filter_status_id=${i}`).join("&");e+=`?${s}`}return fetch(e,{headers:y.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Staff:",s),s})}function lr(n){return fetch("/api/services",{headers:y.headers(n)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Services:",t),t})}class pt extends Error{}pt.prototype.name="InvalidTokenError";function cr(n){return decodeURIComponent(atob(n).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function hr(n){let t=n.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return cr(t)}catch{return atob(t)}}function dr(n,t){if(typeof n!="string")throw new pt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=n.split(".")[e];if(typeof s!="string")throw new pt(`Invalid token specified: missing part #${e+1}`);let i;try{i=hr(s)}catch(r){throw new pt(`Invalid token specified: invalid base64 for part #${e+1} (${r.message})`)}try{return JSON.parse(i)}catch(r){throw new pt(`Invalid token specified: invalid json for part #${e+1} (${r.message})`)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pr={attribute:!0,type:String,converter:Dt,reflect:!1,hasChanged:ke},ur=(n=pr,t,e)=>{const{kind:s,metadata:i}=e;let r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),r.set(e.name,n),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,n)},init(l){return l!==void 0&&this.P(o,void 0,n),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,n)}}throw Error("Unsupported decorator location: "+s)};function k(n){return(t,e)=>typeof e=="object"?ur(n,t,e):((s,i,r)=>{const o=i.hasOwnProperty(r);return i.constructor.createProperty(r,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,r):void 0})(n,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function S(n){return k({...n,state:!0,attribute:!1})}var fr=Object.defineProperty,mr=(n,t,e,s)=>{for(var i=void 0,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&fr(t,e,i),i};const Ce=class Ce extends F{constructor(){super(...arguments),this.display_name="Status: 401",this._authObserver=new Pt(this,"acorn:auth")}displayNameTemplate(){return this.display_name==="Status: 401"||this.display_name==="Status: 403"?v`<span>Please <a href="../login.html?next=${window.location.href}" style="color: var(--text-color-link);" @click=${ps}>login</a></span>`:this.display_name===""?v`<span>Hello, user</span>`:v`<span>${this.display_name}</span>`}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{const e=t;if(e&&e.token){const s=dr(e.token);s&&(this.display_name=s.user_metadata.display_name||"")}})}toggleDarkMode(t){this.classList.toggle("dark-mode"),Et.relay(t,"dark-mode:toggle",{})}toggleActive(){this.classList.toggle("active")}render(){return v`
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        <nav class="sidebar">
            <i id="sidebar-btn" class='bx bx-menu' @click=${this.toggleActive}>
            </i>
            <div class="top">
                <div class="logo">
                    <img src="../images/AcornArranger Logo.png" alt="AcornArranger Logo">
                    <span>AcornArranger</span>
                </div>
            </div>
            <div class="user">
                <i class='bx bxs-user-circle' ></i>
                ${this.displayNameTemplate()}
            </div>
            <ul class="menu-items">
                <li>
                    <a href="/app/appointments">
                        <i class='bx bx-calendar-alt'></i>
                        <span class="nav-item">View Appointments</span>
                    </a>
                    <span class="tooltip">View Appointments</span>
                </li>
                <li>
                    <a href="/app/schedule">
                        <i class='bx bxs-book-bookmark'></i>
                        <span class="nav-item">Schedule</span>
                    </a>
                    <span class="tooltip">Schedule</span>
                </li>
                <li>
                    <a href="/app/properties">
                        <i class='bx bxs-edit-location' ></i>
                        <span class="nav-item">Properties</span>
                    </a>
                    <span class="tooltip">Properties</span>
                </li>
                <li>
                    <a href="/app/staff">
                        <i class='bx bx-male'></i>
                        <span class="nav-item">Staff</span>
                    </a>
                    <span class="tooltip">Staff</span>
                </li>
                <li>
                    <a href="/app/roles">
                        <i class='bx bxs-hard-hat'></i>
                        <span class="nav-item">Staff Roles</span>
                    </a>
                    <span class="tooltip">Staff Roles</span>
                </li>
            </ul>
            <ul class="bottom">
                <li>
                    <a href="#" @click=${this.toggleDarkMode} >
                        <i class='bx bxs-sun dark-mode-only'></i>
                        <i class='bx bxs-moon light-mode-only'></i>
                        <span class="nav-item">Theme</span>
                    </a>
                    <span class="tooltip">Theme</span>
                </li>
                <li>
                    <a href="../login.html?next=${window.location.href}" @click=${ps}>
                        <i class='bx bx-log-out'></i>
                        <span class="nav-item">Logout</span>
                    </a>
                    <span class="tooltip">Logout</span>
                </li>
            </ul>
        </nav>
    `}};Ce.styles=P`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    img {
        max-width: 100%;
    }

    a i {
        pointer-events: none;
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

    i.bx {
        font-size: var(--icon-size);
    }

    .sidebar i:not(#sidebar-btn) {
        min-width: calc(var(--icon-size) + 1rem);
        text-align: center;
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
        display: inline-block;
    }

    :host .light-mode-only {
        opacity: 1;
        display: inline-block;
    }

    :host(.dark-mode) .light-mode-only {
        opacity: 0;
        display: none;
    }   
  `;let Bt=Ce;mr([k({attribute:!1})],Bt.prototype,"display_name");function ps(n){Et.relay(n,"auth:message",["auth/signout"])}Jt({"restful-form":$e.FormElement});class gr extends F{render(){return v`
      <restful-form new src="/auth/login">
        <slot></slot>
      </restful-form>
    `}get next(){return new URLSearchParams(document.location.search).get("next")}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:s}={token:e.created.session.access_token},i=this.next||"/";console.log("Login successful",e,i),Et.relay(t,"auth:message",["auth/signin",{token:s,redirect:i}])})}}Jt({"restful-form":$e.FormElement});class vr extends F{render(){return v`
      <restful-form new src="/auth/signup">
        <slot></slot>
      </restful-form>
    `}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:s}={token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxa2NneGZhcWhwcXJ5dGNpeHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAyNzU3ODQsImV4cCI6MjAyNTg1MTc4NH0.f2OUbu37RF-NMV1iSj16rBOgmcarmjnntUMNGLZm7Xc"},i="/";console.log("Signup successful",e,i),Et.relay(t,"auth:message",["auth/signin",{token:s,redirect:i}])})}}const Y=P`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
img {
  max-width: 100%;
}
`,J=P`
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
    padding: var(--spacing-size-medium);
}

a {
    color: var(--text-color-link);
}

section.showing {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    background-color: var(--background-color-accent);
    border-radius: var(--border-size-radius);
    padding: var(--spacing-size-small) var(--spacing-size-medium);
    width: 100%;
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

section.showing .page-selector i.bx {
    font-size: var(--text-font-size-medium);
}

section.showing div label {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-size-small);
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

dl {
    margin-left: var(--spacing-size-medium);
}

dt {
    margin-bottom: var(--spacing-size-xsmall);
}

dd {
    margin-bottom: var(--spacing-size-medium);
    margin-left: var(--spacing-size-small);
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
}

button:hover {
    background-color: var(--background-color); 
}

button * {
    padding: 0;
}

i.bx {
    font-size: var(--icon-size);
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
`,Te=class Te extends N{constructor(){super("acorn:model")}render(){return v`
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
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
                    <a href="/login.html?next=/app/appointments" @click=${le}>
                        <i class='bx bx-log-in'></i>
                        <span>Login</span>
                    </a>
                </nav>
                <section>
                    <h4>
                        Returning user?
                    </h4>
                    <p>
                        Feel free to <a href="/login.html?next=/app/appointments" @click=${le}>login</a>
                    </p>
                </section>
                <section>
                    <h4>
                        New to AcornArranger?
                    </h4>
                    <p>
                        If you are new here, please <a href="/login.html?next=/app/appointments" @click=${le}>create an account</a> and request access from your administrator.
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
    `}};Te.styles=[Y,J,P`
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
        `];let fe=Te;function le(n){Et.relay(n,"auth:message",["auth/signout"])}var _r=Object.defineProperty,yr=Object.getOwnPropertyDescriptor,Zs=(n,t,e,s)=>{for(var i=yr(t,e),r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&_r(t,e,i),i};const Oe=class Oe extends N{get staff(){return this.model.staff}get showing_total(){return this.staff?this.staff.length:0}constructor(){super("acorn:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["staff/",{filter_status_ids:[1,3]}])}render(){const t=s=>{var i,r;return v`
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
                    ${(i=s.role)==null?void 0:i.title}
                    </span>
                </td>
                <td class="center">
                    <span>
                    ${(r=s.status)==null?void 0:r.status}
                    </span>
                </td>
            </tr>
        `},e=this.staff||[];return v`
        <div class="page">
            <header>
                <h1>
                    Staff
                </h1>
            </header>
            <main>
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
                    ${e.map(s=>t(s))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};Oe.styles=[Y,J,P`
            
        `];let $t=Oe;Zs([S()],$t.prototype,"staff");Zs([S()],$t.prototype,"showing_total");function us(n){const t=new Date(n),e={month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0,timeZone:"UTC"};return new Intl.DateTimeFormat("en-US",e).format(t)}function br(n){const t=new Date(n),e={month:"2-digit",day:"2-digit",year:"numeric"};return new Intl.DateTimeFormat("en-US",e).format(t)}function me(n){var t=r=>("0"+r).slice(-2),e=r=>("00"+r).slice(-3),s=n.getTimezoneOffset(),i=s>0?"-":"+";return s=Math.abs(s),n.getFullYear()+"-"+t(n.getMonth()+1)+"-"+t(n.getDate())+"T"+t(n.getHours())+":"+t(n.getMinutes())+":"+t(n.getSeconds())+"."+e(n.getMilliseconds())+i+t(s/60|0)+":"+t(s%60)}var $r=Object.defineProperty,wr=Object.getOwnPropertyDescriptor,at=(n,t,e,s)=>{for(var i=s>1?void 0:s?wr(t,e):t,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&$r(t,e,i),i};const ze=class ze extends N{constructor(){super("acorn:model"),this.from_service_date=me(new Date).split("T")[0],this.to_service_date=me(new Date).split("T")[0],this.per_page=50,this.page=1}get appointments(){return this.model.appointments}get showing_total(){return this.appointments?this.appointments.length:0}connectedCallback(){super.connectedCallback(),this.updateAppointments()}updateAppointments(){const t=new Date(this.from_service_date),e=new Date(this.to_service_date);t>e&&(this.to_service_date=this.from_service_date),this.dispatchMessage(["appointments/",{from_service_date:this.from_service_date,to_service_date:this.to_service_date,per_page:this.per_page,page:this.page-1,filter_status_ids:[1,2,3,4]}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateAppointments()}handleInputChange(t){const e=t.target,{name:s,value:i}=e;this[s]=i}previousPage(){this.page>1&&(this.page--,this.updateAppointments())}nextPage(){this.page++,this.updateAppointments()}render(){const t=i=>v`
            <li>
                <span>${i.name}</span>
            </li>
        `,e=i=>{var r,o;return v`
            <tr>
                <td class="center">
                    <span>
                    ${i.appointment_id}
                    </span>
                </td>
                <td>
                    <span>
                    ${us(i.service_time)}
                    </span>
                </td>
                <td>
                    <span>
                    ${i.property_info.property_name}
                    </span>
                </td>
                <td>
                    <ul class="staff">
                        ${(r=i.staff)==null?void 0:r.map(l=>t(l.staff_info))}
                    </ul>
                </td>
                <td class="center">
                    <span>
                    ${i.turn_around}
                    </span>
                </td>
                <td>
                    <span>
                    ${us(i.next_arrival_time)}
                    </span>
                </td>
                <td>
                    <span>
                    ${i.service.service_name}
                    </span>
                </td>
                <td>
                    <span>
                    ${(o=i.status)==null?void 0:o.status}
                    </span>
                </td>
            </tr>
        `},s=this.appointments||[];return v`
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        <div class="page">
            <header>
                <h1>
                    Appointments
                </h1>
            </header>
            <main>
                <menu>
                    <li>
                        <label>
                            <span>From Date:</span>
                            <input name="from_service_date" autocomplete="off" .value=${this.from_service_date} type="date" @input=${this.handleTableOptionChange} />
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>To Date:</span>
                            <input name="to_service_date" autocomplete="off" .value=${this.to_service_date} type="date" @input=${this.handleTableOptionChange} />
                        </label>
                    </li>
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
                            <button @click=${this.previousPage} ?disabled=${this.page===1}><i class='bx bxs-chevron-left' ></i></button>
                            <span class="highlight">${this.page}</span>
                            <button @click=${this.nextPage}><i class='bx bxs-chevron-right' ></i></button>
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
                            <th>Turn Around</th>
                            <th>Next Arrival Time</th>
                            <th>Service</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${s.map(i=>e(i))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};ze.styles=[Y,J,P`

            menu {
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
                list-style-type: none;
                display: flex;
                justify-content: space-evenly;
                padding: var(--spacing-size-small);
                gap: var(--spacing-size-medium);
                width: 100%;
            }

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
        `];let T=ze;at([S()],T.prototype,"appointments",1);at([S()],T.prototype,"showing_total",1);at([k({type:String})],T.prototype,"from_service_date",2);at([k({type:String})],T.prototype,"to_service_date",2);at([k({type:Number})],T.prototype,"per_page",2);at([k({type:Number})],T.prototype,"page",2);var Ar=Object.defineProperty,xr=Object.getOwnPropertyDescriptor,Gs=(n,t,e,s)=>{for(var i=xr(t,e),r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&Ar(t,e,i),i};const Re=class Re extends N{get roles(){return this.model.roles}get showing_total(){return this.roles?this.roles.length:0}constructor(){super("acorn:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["roles/",{}])}render(){const t=s=>v`
            <tr>
                <td class="center">
                    <span>
                    ${s.priority}
                    </span>
                </td>
                <td>
                    <span>
                    ${s.title}
                    </span>
                </td>
                <td class="center">
                    <span>
                    ${s.can_lead_team}
                    </span>
                </td>
                <td class="center">
                    <span>
                    ${s.can_clean}
                    </span>
                </td>
            </tr>
        `,e=this.roles||[];return v`
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
                            <th>Priority</th>
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
    `}};Re.styles=[Y,J,P`
            
        `];let wt=Re;Gs([S()],wt.prototype,"roles");Gs([S()],wt.prototype,"showing_total");var Er=Object.defineProperty,Sr=Object.getOwnPropertyDescriptor,Ks=(n,t,e,s)=>{for(var i=Sr(t,e),r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&Er(t,e,i),i};function Pr(n){const t=Math.floor(n/60),e=n%60;return!t&&!n?"":t?e&&t===1?`${t} Hour ${e} Minutes`:e?`${t} Hours ${e} Minutes`:t===1?`${t} Hour`:`${t} Hours`:`${e} Minutes`}const Ue=class Ue extends N{get properties(){return this.model.properties}get showing_total(){return this.properties?this.properties.length:0}constructor(){super("acorn:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["properties/",{filter_status_ids:[1]}])}render(){const t=i=>v`
            <li>
                <span>${i}</span>
            </li>
        `,e=i=>{var r,o;return v`
            <tr>
                <td class="center">
                    <span>
                    ${i.properties_id}
                    </span>
                </td>
                <td>
                    <span>
                    ${i.property_name}
                    </span>
                </td>
                <td>
                    <span>
                    ${Pr(i.estimated_cleaning_mins)}
                    </span>
                </td>
                <td>
                    <ul>
                    ${(r=i.double_unit)==null?void 0:r.map(l=>t(l))}
                    </ul>
                </td>
                <td class="center">
                    <span>
                    ${(o=i.status)==null?void 0:o.status}
                    </span>
                </td>
            </tr>
        `},s=this.properties||[];return v`
        <div class="page">
            <header>
                <h1>
                    Properties
                </h1>
            </header>
            <main>
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
                        </tr>
                    </thead>
                    <tbody>
                    ${s.map(i=>e(i))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};Ue.styles=[Y,J,P`
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
        `];let At=Ue;Ks([S()],At.prototype,"properties");Ks([S()],At.prototype,"showing_total");var kr=Object.defineProperty,Cr=Object.getOwnPropertyDescriptor,Xs=(n,t,e,s)=>{for(var i=s>1?void 0:s?Cr(t,e):t,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&kr(t,e,i),i};const Ne=class Ne extends N{get model_plan(){return this.model.plan}constructor(){super("acorn:model")}updated(t){super.updated(t);const e=this.model_plan;e&&(!this.plan||e.plan_id===this.plan.plan_id)&&(this.plan=e)}render(){if(!this.plan)return v`<section><p>Loading...</p></section>`;const t=s=>v`
            <li>
                <span>${s.name}</span>
            </li>
        `,e=s=>v`
            <li>
                <span>${s.property_info.property_name}</span>
            </li>
        `;return v`
        <section>
            <div>
                <p>ID: ${this.plan.plan_id}</p>
                <p>${br(this.plan.plan_date)}</p>
            </div>
            <h4>Team ${this.plan.team}</h4>
            <h5>Staff</h5>
            <ul>
                ${this.plan.staff.map(s=>t(s.staff_info))}
            </ul>
            <h5>Appointments</h5>
            <ul>
                ${this.plan.appointments.map(s=>e(s.appointment_info))}
            </ul>
        </section>
    `}};Ne.styles=[Y,J,P`
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
        `];let xt=Ne;Xs([S()],xt.prototype,"model_plan",1);Xs([k({attribute:!1})],xt.prototype,"plan",2);var Tr=Object.defineProperty,Or=Object.getOwnPropertyDescriptor,Tt=(n,t,e,s)=>{for(var i=s>1?void 0:s?Or(t,e):t,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Tr(t,e,i),i};const Vt=class Vt extends N{constructor(){super("acorn:model"),this.from_plan_date=me(new Date).split("T")[0],this.per_page=10,this.page=1}get plans(){return this.model.plans}get showing_total(){return this.plans?this.plans.length:0}connectedCallback(){super.connectedCallback(),this.updatePlans()}updatePlans(){this.dispatchMessage(["plans/",{from_plan_date:this.from_plan_date,per_page:this.per_page,page:this.page-1}])}handleTableOptionChange(t){this.handleInputChange(t),this.updatePlans()}handleInputChange(t){const e=t.target,{name:s,value:i}=e;this[s]=i}previousPage(){this.page>1&&(this.page--,this.updatePlans())}nextPage(){this.page++,this.updatePlans()}render(){const t=s=>v`
            <plan-view .plan=${s}></plan-view>
        `,e=this.plans||[];return v`
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        <div class="page">
            <header>
                <h1>
                    Schedule Plans
                </h1>
            </header>
            <main>
                <menu>
                    <li>
                        <label>
                            <span>Schedule Date:</span>
                            <input name="from_plan_date" autocomplete="off" .value=${this.from_plan_date} type="date" @input=${this.handleTableOptionChange} />
                        </label>
                    </li>
                </menu>
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
                            <button @click=${this.previousPage} ?disabled=${this.page===1}><i class='bx bxs-chevron-left' ></i></button>
                            <span class="highlight">${this.page}</span>
                            <button @click=${this.nextPage}><i class='bx bxs-chevron-right' ></i></button>
                        </div>
                    </div>
                </section>
                <div class="plans">
                    ${e.map(s=>t(s))}
                </div>
            </main>
        </div>
    `}};Vt.uses=Jt({"plan-view":xt}),Vt.styles=[Y,J,P`

            menu {
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
                list-style-type: none;
                display: flex;
                justify-content: space-evenly;
                padding: var(--spacing-size-small);
                gap: var(--spacing-size-medium);
                width: 100%;
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
        `];let U=Vt;Tt([S()],U.prototype,"plans",1);Tt([S()],U.prototype,"showing_total",1);Tt([k({type:String})],U.prototype,"from_plan_date",2);Tt([k({type:Number})],U.prototype,"per_page",2);Tt([k({type:Number})],U.prototype,"page",2);const zr=[{path:"/app/appointments",view:()=>v`
      <appointments-view></appointments-view>
    `},{path:"/app/staff",view:()=>v`
      <staff-view></staff-view>
    `},{path:"/app/roles",view:()=>v`
      <roles-view></roles-view>
    `},{path:"/app/properties",view:()=>v`
      <properties-view></properties-view>
    `},{path:"/app/schedule",view:()=>v`
      <plans-view></plans-view>
    `},{path:"/app",view:()=>v`
      <landing-view></landing-view>
    `},{path:"/",redirect:"/app"}];Jt({"mu-auth":y.Provider,"mu-store":class extends Si.Provider{constructor(){super(Vn,Bn,"acorn:auth")}},"mu-history":wi.Provider,"mu-switch":class extends vn.Element{constructor(){super(zr,"acorn:history")}},"side-bar":Bt,"login-form":gr,"signup-form":vr,"restful-form":$e.FormElement,"landing-view":fe,"staff-view":$t,"appointments-view":T,"roles-view":wt,"properties-view":At,"plans-view":U});export{y as a,Jt as d,Et as e};
