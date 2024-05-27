(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var We;let gt=class extends Error{};gt.prototype.name="InvalidTokenError";function fi(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function mi(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return fi(t)}catch{return atob(t)}}function As(r,t){if(typeof r!="string")throw new gt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new gt(`Invalid token specified: missing part #${e+1}`);let i;try{i=mi(s)}catch(n){throw new gt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new gt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const gi="mu:context",me=`${gi}:change`;class vi{constructor(t,e){this._proxy=_i(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class xe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new vi(t,this),this.style.display="contents"}attach(t){return this.addEventListener(me,t),t}detach(t){this.removeEventListener(me,t)}}function _i(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const a=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,a),a},set:(s,i,n,a)=>{const o=r[i];console.log(`Context['${i.toString()}'] <= `,n);const l=Reflect.set(s,i,n,a);if(l){let u=new CustomEvent(me,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:i,oldValue:o,value:n}),t.dispatchEvent(u)}else console.log(`Context['${i}] was not set to ${n}`);return l}})}function yi(r,t){const e=Ss(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function Ss(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return Ss(r,i.host)}class bi extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Es(r="mu:message"){return(t,...e)=>t.dispatchEvent(new bi(e,r))}class we{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function $i(r){return t=>({...t,...r})}const ge="mu:auth:jwt",Lt=class ks extends we{constructor(t,e){super((s,i)=>this.update(s,i),t,ks.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(Ai(s)),oe(i);case"auth/signout":return e(Ze()),oe(this._redirectForLogin);case"auth/redirect":return e(Ze()),oe(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};Lt.EVENT_TYPE="auth:message";Lt.dispatch=Es(Lt.EVENT_TYPE);let xi=Lt;function oe(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class wi extends xe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:st.authenticateFromLocalStorage()})}connectedCallback(){new xi(this.context,this.redirect).attach(this)}}class et{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ge),t}}class st extends et{constructor(t){super();const e=As(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new st(t);return localStorage.setItem(ge,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ge);return t?st.authenticate(t):new et}}function Ai(r){return $i({user:st.authenticate(r),token:r})}function Ze(){return r=>{const t=r.user;return{user:t&&t.authenticated?et.deauthenticate(t):t,token:""}}}function Si(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function Ei(r){return r.authenticated?As(r.token||""):{}}const b=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:st,Provider:wi,User:et,headers:Si,payload:Ei},Symbol.toStringTag,{value:"Module"}));function Dt(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function ve(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const Ct=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:ve,relay:Dt},Symbol.toStringTag,{value:"Module"})),ki=new DOMParser;function zt(r,...t){const e=r.map((a,o)=>o?[t[o-1],a]:[a]).flat().join(""),s=ki.parseFromString(e,"text/html"),i=s.head.childElementCount?s.head.children:s.body.children,n=new DocumentFragment;return n.replaceChildren(...i),n}function Xt(r){const t=r.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:s};function s(i,n={mode:"open"}){const a=i.attachShadow(n);return e&&a.appendChild(e.content.cloneNode(!0)),a}}const Ps=class Cs extends HTMLElement{constructor(){super(),this._state={},Xt(Cs.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),Dt(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},Ci(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};Ps.template=zt`
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
  `;let Pi=Ps;function Ci(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const a=n;switch(a.type){case"checkbox":const o=a;o.checked=!!i;break;default:a.value=i;break}}}return r}const zi=Object.freeze(Object.defineProperty({__proto__:null,Element:Pi},Symbol.toStringTag,{value:"Module"})),zs=class Ts extends we{constructor(t){super((e,s)=>this.update(e,s),t,Ts.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(Oi(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(Ri(s,i));break}}}};zs.EVENT_TYPE="history:message";let Ae=zs;class Ge extends xe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Ti(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),Se(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new Ae(this.context).attach(this)}}function Ti(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function Oi(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function Ri(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const Se=Es(Ae.EVENT_TYPE),Os=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ge,Provider:Ge,Service:Ae,dispatch:Se},Symbol.toStringTag,{value:"Module"}));class Tt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Ke(this._provider,t);this._effects.push(i),e(i)}else yi(this._target,this._contextLabel).then(i=>{const n=new Ke(i,t);this._provider=i,this._effects.push(n),i.attach(a=>this._handleChange(a)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Ke{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Ee=class Rs extends HTMLElement{constructor(){super(),this._state={},this._user=new et,this._authObserver=new Tt(this,"blazing:auth"),Xt(Rs.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Ni(i,this._state,e,this.authorization).then(n=>ut(n,this)).then(n=>{const a=`mu-rest-form:${s}`,o=new CustomEvent(a,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(o)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ut(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&_e(this.src,this.authorization).then(e=>{this._state=e,ut(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&_e(this.src,this.authorization).then(i=>{this._state=i,ut(i,this)});break;case"new":s&&(this._state={},ut({},this));break}}};Ee.observedAttributes=["src","new","action"];Ee.template=zt`
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
  `;let Ui=Ee;function _e(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function ut(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const a=n;switch(a.type){case"checkbox":const o=a;o.checked=!!i;break;default:a.value=i;break}}}return r}function Ni(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()}).catch(i=>console.log("Error submitting form:",i))}const ke=Object.freeze(Object.defineProperty({__proto__:null,FormElement:Ui,fetchData:_e},Symbol.toStringTag,{value:"Module"})),Us=class Ns extends we{constructor(t,e){super(e,t,Ns.EVENT_TYPE,!1)}};Us.EVENT_TYPE="mu:message";let Is=Us;class Ii extends xe{constructor(t,e,s){super(e),this._user=new et,this._updateFn=t,this._authObserver=new Tt(this,s)}connectedCallback(){const t=new Is(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Mi=Object.freeze(Object.defineProperty({__proto__:null,Provider:Ii,Service:Is},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mt=globalThis,Pe=Mt.ShadowRoot&&(Mt.ShadyCSS===void 0||Mt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ce=Symbol(),Xe=new WeakMap;let Ms=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Ce)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Pe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Xe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Xe.set(e,t))}return t}toString(){return this.cssText}};const ji=r=>new Ms(typeof r=="string"?r:r+"",void 0,Ce),Li=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Ms(e,r,Ce)},Di=(r,t)=>{if(Pe)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Mt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Qe=Pe?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return ji(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Hi,defineProperty:Fi,getOwnPropertyDescriptor:Bi,getOwnPropertyNames:qi,getOwnPropertySymbols:Vi,getPrototypeOf:Yi}=Object,it=globalThis,ts=it.trustedTypes,Ji=ts?ts.emptyScript:"",es=it.reactiveElementPolyfillSupport,_t=(r,t)=>r,Ht={toAttribute(r,t){switch(t){case Boolean:r=r?Ji:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ze=(r,t)=>!Hi(r,t),ss={attribute:!0,type:String,converter:Ht,reflect:!1,hasChanged:ze};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),it.litPropertyMetadata??(it.litPropertyMetadata=new WeakMap);let X=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ss){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Fi(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Bi(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get(){return i==null?void 0:i.call(this)},set(a){const o=i==null?void 0:i.call(this);n.call(this,a),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ss}static _$Ei(){if(this.hasOwnProperty(_t("elementProperties")))return;const t=Yi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_t("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_t("properties"))){const e=this.properties,s=[...qi(e),...Vi(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Qe(i))}else t!==void 0&&e.push(Qe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Di(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const a=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Ht).toAttribute(e,i.type);this._$Em=t,a==null?this.removeAttribute(n):this.setAttribute(n,a),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const a=i.getPropertyOptions(n),o=typeof a.converter=="function"?{fromAttribute:a.converter}:((s=a.converter)==null?void 0:s.fromAttribute)!==void 0?a.converter:Ht;this._$Em=n,this[n]=o.fromAttribute(e,a.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ze)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,a]of this._$Ep)this[n]=a;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,a]of i)a.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],a)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};X.elementStyles=[],X.shadowRootOptions={mode:"open"},X[_t("elementProperties")]=new Map,X[_t("finalized")]=new Map,es==null||es({ReactiveElement:X}),(it.reactiveElementVersions??(it.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ft=globalThis,Bt=Ft.trustedTypes,is=Bt?Bt.createPolicy("lit-html",{createHTML:r=>r}):void 0,js="$lit$",I=`lit$${Math.random().toFixed(9).slice(2)}$`,Ls="?"+I,Wi=`<${Ls}>`,Y=document,$t=()=>Y.createComment(""),xt=r=>r===null||typeof r!="object"&&typeof r!="function",Ds=Array.isArray,Zi=r=>Ds(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",le=`[ 	
\f\r]`,ft=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,rs=/-->/g,ns=/>/g,F=RegExp(`>|${le}(?:([^\\s"'>=/]+)(${le}*=${le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),as=/'/g,os=/"/g,Hs=/^(?:script|style|textarea|title)$/i,Gi=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),ce=Gi(1),rt=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),ls=new WeakMap,q=Y.createTreeWalker(Y,129);function Fs(r,t){if(!Array.isArray(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return is!==void 0?is.createHTML(t):t}const Ki=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":"",a=ft;for(let o=0;o<e;o++){const l=r[o];let u,m,d=-1,c=0;for(;c<l.length&&(a.lastIndex=c,m=a.exec(l),m!==null);)c=a.lastIndex,a===ft?m[1]==="!--"?a=rs:m[1]!==void 0?a=ns:m[2]!==void 0?(Hs.test(m[2])&&(i=RegExp("</"+m[2],"g")),a=F):m[3]!==void 0&&(a=F):a===F?m[0]===">"?(a=i??ft,d=-1):m[1]===void 0?d=-2:(d=a.lastIndex-m[2].length,u=m[1],a=m[3]===void 0?F:m[3]==='"'?os:as):a===os||a===as?a=F:a===rs||a===ns?a=ft:(a=F,i=void 0);const h=a===F&&r[o+1].startsWith("/>")?" ":"";n+=a===ft?l+Wi:d>=0?(s.push(u),l.slice(0,d)+js+l.slice(d)+I+h):l+I+(d===-2?o:h)}return[Fs(r,n+(r[e]||"<?>")+(t===2?"</svg>":"")),s]};let ye=class Bs{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,a=0;const o=t.length-1,l=this.parts,[u,m]=Ki(t,e);if(this.el=Bs.createElement(u,s),q.currentNode=this.el.content,e===2){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=q.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(js)){const c=m[a++],h=i.getAttribute(d).split(I),p=/([.?@])?(.*)/.exec(c);l.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Qi:p[1]==="?"?tr:p[1]==="@"?er:Qt}),i.removeAttribute(d)}else d.startsWith(I)&&(l.push({type:6,index:n}),i.removeAttribute(d));if(Hs.test(i.tagName)){const d=i.textContent.split(I),c=d.length-1;if(c>0){i.textContent=Bt?Bt.emptyScript:"";for(let h=0;h<c;h++)i.append(d[h],$t()),q.nextNode(),l.push({type:2,index:++n});i.append(d[c],$t())}}}else if(i.nodeType===8)if(i.data===Ls)l.push({type:2,index:n});else{let d=-1;for(;(d=i.data.indexOf(I,d+1))!==-1;)l.push({type:7,index:n}),d+=I.length-1}n++}}static createElement(t,e){const s=Y.createElement("template");return s.innerHTML=t,s}};function nt(r,t,e=r,s){var i,n;if(t===rt)return t;let a=s!==void 0?(i=e._$Co)==null?void 0:i[s]:e._$Cl;const o=xt(t)?void 0:t._$litDirective$;return(a==null?void 0:a.constructor)!==o&&((n=a==null?void 0:a._$AO)==null||n.call(a,!1),o===void 0?a=void 0:(a=new o(r),a._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=a:e._$Cl=a),a!==void 0&&(t=nt(r,a._$AS(r,t.values),a,s)),t}let Xi=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??Y).importNode(e,!0);q.currentNode=i;let n=q.nextNode(),a=0,o=0,l=s[0];for(;l!==void 0;){if(a===l.index){let u;l.type===2?u=new Te(n,n.nextSibling,this,t):l.type===1?u=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(u=new sr(n,this,t)),this._$AV.push(u),l=s[++o]}a!==(l==null?void 0:l.index)&&(n=q.nextNode(),a++)}return q.currentNode=Y,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},Te=class qs{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=nt(this,t,e),xt(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==rt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Zi(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==x&&xt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Y.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ye.createElement(Fs(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const a=new Xi(n,this),o=a.u(this.options);a.p(s),this.T(o),this._$AH=a}}_$AC(t){let e=ls.get(t.strings);return e===void 0&&ls.set(t.strings,e=new ye(t)),e}k(t){Ds(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new qs(this.S($t()),this.S($t()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Qt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=x}_$AI(t,e=this,s,i){const n=this.strings;let a=!1;if(n===void 0)t=nt(this,t,e,0),a=!xt(t)||t!==this._$AH&&t!==rt,a&&(this._$AH=t);else{const o=t;let l,u;for(t=n[0],l=0;l<n.length-1;l++)u=nt(this,o[s+l],e,l),u===rt&&(u=this._$AH[l]),a||(a=!xt(u)||u!==this._$AH[l]),u===x?t=x:t!==x&&(t+=(u??"")+n[l+1]),this._$AH[l]=u}a&&!i&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Qi=class extends Qt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}},tr=class extends Qt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}},er=class extends Qt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=nt(this,t,e,0)??x)===rt)return;const s=this._$AH,i=t===x&&s!==x||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==x&&(s===x||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},sr=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){nt(this,t)}};const cs=Ft.litHtmlPolyfillSupport;cs==null||cs(ye,Te),(Ft.litHtmlVersions??(Ft.litHtmlVersions=[])).push("3.1.3");const ir=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new Te(t.insertBefore($t(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let tt=class extends X{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ir(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return rt}};tt._$litElement$=!0,tt.finalized=!0,(We=globalThis.litElementHydrateSupport)==null||We.call(globalThis,{LitElement:tt});const hs=globalThis.litElementPolyfillSupport;hs==null||hs({LitElement:tt});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const rr={attribute:!0,type:String,converter:Ht,reflect:!1,hasChanged:ze},nr=(r=rr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:a}=e;return{set(o){const l=t.get.call(this);t.set.call(this,o),this.requestUpdate(a,l,r)},init(o){return o!==void 0&&this.P(a,void 0,r),o}}}if(s==="setter"){const{name:a}=e;return function(o){const l=this[a];t.call(this,o),this.requestUpdate(a,l,r)}}throw Error("Unsupported decorator location: "+s)};function Vs(r){return(t,e)=>typeof e=="object"?nr(r,t,e):((s,i,n)=>{const a=i.hasOwnProperty(n);return i.constructor.createProperty(n,a?{...s,wrapped:!0}:s),a?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}function ar(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function or(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ys={};(function(r){var t=function(){var e=function(d,c,h,p){for(h=h||{},p=d.length;p--;h[d[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],a=[1,12],o=[5,11,12,13,14,15],l={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,v,g,_,se){var E=_.length-1;switch(g){case 1:return new v.Root({},[_[E-1]]);case 2:return new v.Root({},[new v.Literal({value:""})]);case 3:this.$=new v.Concat({},[_[E-1],_[E]]);break;case 4:case 5:this.$=_[E];break;case 6:this.$=new v.Literal({value:_[E]});break;case 7:this.$=new v.Splat({name:_[E]});break;case 8:this.$=new v.Param({name:_[E]});break;case 9:this.$=new v.Optional({},[_[E-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:a},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:a},{1:[2,2]},e(o,[2,4]),e(o,[2,5]),e(o,[2,6]),e(o,[2,7]),e(o,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:a},e(o,[2,10]),e(o,[2,11]),e(o,[2,12]),{1:[2,1]},e(o,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:a},e(o,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(v,g){this.message=v,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],v=[null],g=[],_=this.table,se="",E=0,Ve=0,hi=2,Ye=1,di=g.slice.call(arguments,1),$=Object.create(this.lexer),D={yy:{}};for(var ie in this.yy)Object.prototype.hasOwnProperty.call(this.yy,ie)&&(D.yy[ie]=this.yy[ie]);$.setInput(c,D.yy),D.yy.lexer=$,D.yy.parser=this,typeof $.yylloc>"u"&&($.yylloc={});var re=$.yylloc;g.push(re);var pi=$.options&&$.options.ranges;typeof D.yy.parseError=="function"?this.parseError=D.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var ui=function(){var G;return G=$.lex()||Ye,typeof G!="number"&&(G=h.symbols_[G]||G),G},A,H,P,ne,Z={},Nt,R,Je,It;;){if(H=p[p.length-1],this.defaultActions[H]?P=this.defaultActions[H]:((A===null||typeof A>"u")&&(A=ui()),P=_[H]&&_[H][A]),typeof P>"u"||!P.length||!P[0]){var ae="";It=[];for(Nt in _[H])this.terminals_[Nt]&&Nt>hi&&It.push("'"+this.terminals_[Nt]+"'");$.showPosition?ae="Parse error on line "+(E+1)+`:
`+$.showPosition()+`
Expecting `+It.join(", ")+", got '"+(this.terminals_[A]||A)+"'":ae="Parse error on line "+(E+1)+": Unexpected "+(A==Ye?"end of input":"'"+(this.terminals_[A]||A)+"'"),this.parseError(ae,{text:$.match,token:this.terminals_[A]||A,line:$.yylineno,loc:re,expected:It})}if(P[0]instanceof Array&&P.length>1)throw new Error("Parse Error: multiple actions possible at state: "+H+", token: "+A);switch(P[0]){case 1:p.push(A),v.push($.yytext),g.push($.yylloc),p.push(P[1]),A=null,Ve=$.yyleng,se=$.yytext,E=$.yylineno,re=$.yylloc;break;case 2:if(R=this.productions_[P[1]][1],Z.$=v[v.length-R],Z._$={first_line:g[g.length-(R||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(R||1)].first_column,last_column:g[g.length-1].last_column},pi&&(Z._$.range=[g[g.length-(R||1)].range[0],g[g.length-1].range[1]]),ne=this.performAction.apply(Z,[se,Ve,E,D.yy,P[1],v,g].concat(di)),typeof ne<"u")return ne;R&&(p=p.slice(0,-1*R*2),v=v.slice(0,-1*R),g=g.slice(0,-1*R)),p.push(this.productions_[P[1]][0]),v.push(Z.$),g.push(Z._$),Je=_[p[p.length-2]][p[p.length-1]],p.push(Je);break;case 3:return!0}}return!0}},u=function(){var d={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var v=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===v.length?this.yylloc.first_column:0)+v[v.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,v,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),v=c[0].match(/(?:\r\n?|\n).*/g),v&&(this.yylineno+=v.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:v?v[v.length-1].length-v[v.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var _ in g)this[_]=g[_];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,v;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),_=0;_<g.length;_++)if(p=this._input.match(this.rules[g[_]]),p&&(!h||p[0].length>h[0].length)){if(h=p,v=_,this.options.backtrack_lexer){if(c=this.test_match(p,g[_]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[v]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,v,g){switch(v){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();l.lexer=u;function m(){this.yy={}}return m.prototype=l,l.Parser=m,new m}();typeof or<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Ys);function K(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var Js={Root:K("Root"),Concat:K("Concat"),Literal:K("Literal"),Splat:K("Splat"),Param:K("Param"),Optional:K("Optional")},Ws=Ys.parser;Ws.yy=Js;var lr=Ws,cr=Object.keys(Js);function hr(r){return cr.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Zs=hr,dr=Zs,pr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Gs(r){this.captures=r.captures,this.re=r.re}Gs.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var ur=dr({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(pr,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Gs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),fr=ur,mr=Zs,gr=mr({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),vr=gr,_r=lr,yr=fr,br=vr;Ot.prototype=Object.create(null);Ot.prototype.match=function(r){var t=yr.visit(this.ast),e=t.match(r);return e||!1};Ot.prototype.reverse=function(r){return br.visit(this.ast,r)};function Ot(r){var t;if(this?t=this:t=Object.create(Ot.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=_r.parse(r),t}var $r=Ot,xr=$r,wr=xr;const Ar=ar(wr);var Sr=Object.defineProperty,Er=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,a;n>=0;n--)(a=r[n])&&(i=a(t,e,i)||i);return i&&Sr(t,e,i),i};class qt extends tt{constructor(t,e){super(),this._cases=[],this._fallback=()=>ce`
      <h1>Not Found</h1>
    `,this._cases=t.map(s=>({...s,route:new Ar(s.path)})),this._historyObserver=new Tt(this,e)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match),ce`
      <main>${(()=>{if(this._match){if("view"in this._match)return this._match.view(this._match.params||{});if("redirect"in this._match){const e=this._match.redirect;if(typeof e=="string")return this.redirect(e),ce`
              <h1>Redirecting to ${e}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const a of this._cases){const o=a.route.match(n);if(o)return{...a,path:s,params:o,query:i}}}redirect(t){Se(this,"history/redirect",{href:t})}}qt.styles=Li`
    :host,
    main {
      display: contents;
    }
  `;Er([Vs()],qt.prototype,"_match");const kr=Object.freeze(Object.defineProperty({__proto__:null,Element:qt,Switch:qt},Symbol.toStringTag,{value:"Module"})),Pr=class Ks extends HTMLElement{constructor(){if(super(),Xt(Ks.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Pr.template=zt`
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
  `;const Xs=class Qs extends HTMLElement{constructor(){super(),this._array=[],Xt(Qs.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(ti("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const a=Array.from(this.children).indexOf(n);this._array[a]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{ve(t,"button.add")?Dt(t,"input-array:add"):ve(t,"button.remove")&&Dt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],zr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Xs.template=zt`
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
  `;let Cr=Xs;function zr(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(ti(e)))}function ti(r,t){const e=r===void 0?"":`value="${r}"`;return zt`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}const Tr=Object.freeze(Object.defineProperty({__proto__:null,Element:Cr},Symbol.toStringTag,{value:"Module"}));function dt(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Or=Object.defineProperty,Rr=Object.getOwnPropertyDescriptor,Ur=(r,t,e,s)=>{for(var i=Rr(t,e),n=r.length-1,a;n>=0;n--)(a=r[n])&&(i=a(t,e,i)||i);return i&&Or(t,e,i),i};class N extends tt{constructor(t){super(),this._pending=[],this._observer=new Tt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Ur([Vs()],N.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jt=globalThis,Oe=jt.ShadowRoot&&(jt.ShadyCSS===void 0||jt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Re=Symbol(),ds=new WeakMap;let ei=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Re)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Oe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=ds.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ds.set(e,t))}return t}toString(){return this.cssText}};const Nr=r=>new ei(typeof r=="string"?r:r+"",void 0,Re),S=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new ei(e,r,Re)},Ir=(r,t)=>{if(Oe)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=jt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},ps=Oe?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Nr(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Mr,defineProperty:jr,getOwnPropertyDescriptor:Lr,getOwnPropertyNames:Dr,getOwnPropertySymbols:Hr,getPrototypeOf:Fr}=Object,j=globalThis,us=j.trustedTypes,Br=us?us.emptyScript:"",he=j.reactiveElementPolyfillSupport,yt=(r,t)=>r,Vt={toAttribute(r,t){switch(t){case Boolean:r=r?Br:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Ue=(r,t)=>!Mr(r,t),fs={attribute:!0,type:String,converter:Vt,reflect:!1,hasChanged:Ue};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),j.litPropertyMetadata??(j.litPropertyMetadata=new WeakMap);class Q extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=fs){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&jr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Lr(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get(){return i==null?void 0:i.call(this)},set(a){const o=i==null?void 0:i.call(this);n.call(this,a),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??fs}static _$Ei(){if(this.hasOwnProperty(yt("elementProperties")))return;const t=Fr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(yt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(yt("properties"))){const e=this.properties,s=[...Dr(e),...Hr(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(ps(i))}else t!==void 0&&e.push(ps(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ir(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const a=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Vt).toAttribute(e,s.type);this._$Em=t,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const a=s.getPropertyOptions(i),o=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:Vt;this._$Em=i,this[i]=o.fromAttribute(e,a.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??Ue)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,a]of this._$Ep)this[n]=a;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,a]of i)a.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],a)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[yt("elementProperties")]=new Map,Q[yt("finalized")]=new Map,he==null||he({ReactiveElement:Q}),(j.reactiveElementVersions??(j.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bt=globalThis,Yt=bt.trustedTypes,ms=Yt?Yt.createPolicy("lit-html",{createHTML:r=>r}):void 0,si="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,ii="?"+M,qr=`<${ii}>`,J=document,wt=()=>J.createComment(""),At=r=>r===null||typeof r!="object"&&typeof r!="function",ri=Array.isArray,Vr=r=>ri(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",de=`[ 	
\f\r]`,mt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,gs=/-->/g,vs=/>/g,B=RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_s=/'/g,ys=/"/g,ni=/^(?:script|style|textarea|title)$/i,Yr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),f=Yr(1),at=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),bs=new WeakMap,V=J.createTreeWalker(J,129);function ai(r,t){if(!Array.isArray(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ms!==void 0?ms.createHTML(t):t}const Jr=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":"",a=mt;for(let o=0;o<e;o++){const l=r[o];let u,m,d=-1,c=0;for(;c<l.length&&(a.lastIndex=c,m=a.exec(l),m!==null);)c=a.lastIndex,a===mt?m[1]==="!--"?a=gs:m[1]!==void 0?a=vs:m[2]!==void 0?(ni.test(m[2])&&(i=RegExp("</"+m[2],"g")),a=B):m[3]!==void 0&&(a=B):a===B?m[0]===">"?(a=i??mt,d=-1):m[1]===void 0?d=-2:(d=a.lastIndex-m[2].length,u=m[1],a=m[3]===void 0?B:m[3]==='"'?ys:_s):a===ys||a===_s?a=B:a===gs||a===vs?a=mt:(a=B,i=void 0);const h=a===B&&r[o+1].startsWith("/>")?" ":"";n+=a===mt?l+qr:d>=0?(s.push(u),l.slice(0,d)+si+l.slice(d)+M+h):l+M+(d===-2?o:h)}return[ai(r,n+(r[e]||"<?>")+(t===2?"</svg>":"")),s]};class St{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,a=0;const o=t.length-1,l=this.parts,[u,m]=Jr(t,e);if(this.el=St.createElement(u,s),V.currentNode=this.el.content,e===2){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=V.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(si)){const c=m[a++],h=i.getAttribute(d).split(M),p=/([.?@])?(.*)/.exec(c);l.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Zr:p[1]==="?"?Gr:p[1]==="@"?Kr:te}),i.removeAttribute(d)}else d.startsWith(M)&&(l.push({type:6,index:n}),i.removeAttribute(d));if(ni.test(i.tagName)){const d=i.textContent.split(M),c=d.length-1;if(c>0){i.textContent=Yt?Yt.emptyScript:"";for(let h=0;h<c;h++)i.append(d[h],wt()),V.nextNode(),l.push({type:2,index:++n});i.append(d[c],wt())}}}else if(i.nodeType===8)if(i.data===ii)l.push({type:2,index:n});else{let d=-1;for(;(d=i.data.indexOf(M,d+1))!==-1;)l.push({type:7,index:n}),d+=M.length-1}n++}}static createElement(t,e){const s=J.createElement("template");return s.innerHTML=t,s}}function ot(r,t,e=r,s){var a,o;if(t===at)return t;let i=s!==void 0?(a=e._$Co)==null?void 0:a[s]:e._$Cl;const n=At(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((o=i==null?void 0:i._$AO)==null||o.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=ot(r,i._$AS(r,t.values),i,s)),t}class Wr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??J).importNode(e,!0);V.currentNode=i;let n=V.nextNode(),a=0,o=0,l=s[0];for(;l!==void 0;){if(a===l.index){let u;l.type===2?u=new Rt(n,n.nextSibling,this,t):l.type===1?u=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(u=new Xr(n,this,t)),this._$AV.push(u),l=s[++o]}a!==(l==null?void 0:l.index)&&(n=V.nextNode(),a++)}return V.currentNode=J,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Rt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ot(this,t,e),At(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==at&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Vr(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==w&&At(this._$AH)?this._$AA.nextSibling.data=t:this.T(J.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=St.createElement(ai(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const a=new Wr(i,this),o=a.u(this.options);a.p(e),this.T(o),this._$AH=a}}_$AC(t){let e=bs.get(t.strings);return e===void 0&&bs.set(t.strings,e=new St(t)),e}k(t){ri(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new Rt(this.S(wt()),this.S(wt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class te{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=w}_$AI(t,e=this,s,i){const n=this.strings;let a=!1;if(n===void 0)t=ot(this,t,e,0),a=!At(t)||t!==this._$AH&&t!==at,a&&(this._$AH=t);else{const o=t;let l,u;for(t=n[0],l=0;l<n.length-1;l++)u=ot(this,o[s+l],e,l),u===at&&(u=this._$AH[l]),a||(a=!At(u)||u!==this._$AH[l]),u===w?t=w:t!==w&&(t+=(u??"")+n[l+1]),this._$AH[l]=u}a&&!i&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Zr extends te{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}}class Gr extends te{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}}class Kr extends te{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=ot(this,t,e,0)??w)===at)return;const s=this._$AH,i=t===w&&s!==w||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==w&&(s===w||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Xr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ot(this,t)}}const pe=bt.litHtmlPolyfillSupport;pe==null||pe(St,Rt),(bt.litHtmlVersions??(bt.litHtmlVersions=[])).push("3.1.3");const Qr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new Rt(t.insertBefore(wt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class U extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Qr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return at}}var ws;U._$litElement$=!0,U.finalized=!0,(ws=globalThis.litElementHydrateSupport)==null||ws.call(globalThis,{LitElement:U});const ue=globalThis.litElementPolyfillSupport;ue==null||ue({LitElement:U});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");const tn={};function en(r){return Array.isArray(r)&&"plan_id"in r[0]}function sn(r){return r&&"details"in r}function rn(r,t,e){switch(r[0]){case"properties/save":nn(r[1],e).then(i=>t(n=>({...n,property:i}))).then(()=>{const{onSuccess:i}=r[1];i&&i()}).catch(i=>{const{onFailure:n}=r[1];n&&n(i)});break;case"properties/select":an(r[1],e).then(i=>t(n=>({...n,property:i})));break;case"properties/":on(r[1],e).then(i=>t(n=>({...n,properties:i})));break;case"roles/save":ln(r[1],e).then(i=>t(n=>({...n,role:i})));break;case"roles/select":cn(r[1],e).then(i=>t(n=>({...n,role:i})));break;case"roles/":hn(e).then(i=>t(n=>({...n,roles:i})));break;case"appointments/select":dn(r[1],e).then(i=>t(n=>({...n,appointment:i})));break;case"appointments/":pn(r[1],e).then(i=>t(n=>({...n,appointments:i})));break;case"plans/select":W(r[1],e).then(i=>t(n=>({...n,plan:i})));break;case"plans/":ee(r[1],e).then(i=>t(n=>({...n,plans:i})));break;case"plans/staff/add":un(r[1],e).then(i=>t(n=>({...n,plan:i})));break;case"plans/staff/remove":fn(r[1],e).then(i=>t(n=>({...n,plan:i})));break;case"plans/appointment/add":mn(r[1],e).then(i=>t(n=>({...n,plan:i})));break;case"plans/appointment/remove":gn(r[1],e).then(i=>t(n=>({...n,plan:i})));break;case"plans/build":vn(r[1],e).then(i=>{i===void 0||en(i)?t(n=>({...n,plans:i})):sn(i)&&t(n=>({...n,build_error:i}))});break;case"plans/send":_n(r[1],e).then(i=>t(n=>({...n,plans:i})));break;case"plans/add":yn(r[1],e).then(i=>t(n=>({...n,plans:i})));break;case"staff/select":bn(r[1],e).then(i=>t(n=>({...n,staff_member:i})));break;case"staff/":$n(r[1],e).then(i=>t(n=>({...n,staff:i})));break;case"services/":xn(e).then(i=>t(n=>({...n,services:i})));break;default:const s=r[0];throw new Error(`Unhandled Auth message "${s}"`)}}function nn(r,t){return fetch(`/api/properties/${r.properties_id}`,{method:"PUT",headers:{"Content-Type":"application/json",...b.headers(t)},body:JSON.stringify(r.property)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function an(r,t){return fetch(`/api/properties/${r.properties_id}`,{headers:b.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Property:",e),e})}function on(r,t){let e="/api/properties";if(r.filter_status_ids&&r.filter_status_ids.length>0){const s=r.filter_status_ids.map(i=>`filter_status_id=${i}`).join("&");e+=`?${s}`}return fetch(e,{headers:b.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Properties:",s),s})}function ln(r,t){return fetch(`/api/roles/${r.role_id}`,{method:"PUT",headers:{"Content-Type":"application/json",...b.headers(t)},body:JSON.stringify(r.role)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function cn(r,t){return fetch(`/api/roles/${r.role_id}`,{headers:b.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Role:",e),e})}function hn(r){return fetch("/api/roles",{headers:b.headers(r)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Roles:",t),t})}function dn(r,t){return fetch(`/api/appointments/${r.appointment_id}`,{headers:b.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Appointment:",e),e})}function pn(r,t){let e=`/api/appointments?from_service_date=${r.from_service_date}&to_service_date=${r.to_service_date}`;if(r.per_page&&(e+=`&per_page=${r.per_page}`),r.page&&(e+=`&page=${r.page}`),r.filter_status_ids&&r.filter_status_ids.length>0){const s=r.filter_status_ids.map(i=>`filter_status_id=${i}`).join("&");e+=`&${s}`}if(r.filter_service_ids&&r.filter_service_ids.length>0){const s=r.filter_service_ids.map(i=>`filter_service_id=${i}`).join("&");e+=`&${s}`}return fetch(e,{headers:b.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Appointments:",s),s})}function W(r,t){return fetch(`/api/plans/${r.plan_id}`,{headers:b.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Plan:",e),e})}function ee(r,t){let e=`/api/plans?from_plan_date=${r.from_plan_date}`;return r.to_plan_date&&(e+=`&to_plan_date=${r.to_plan_date}`),r.per_page&&(e+=`&per_page=${r.per_page}`),r.page&&(e+=`&page=${r.page}`),fetch(e,{headers:b.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Plans:",s),s})}function un(r,t){return fetch(`/api/plans/${r.plan_id}/staff/${r.user_id}`,{method:"POST",headers:b.headers(t)}).then(e=>e.status===204?W(r,t):e.status===400?e.json():void 0).then(e=>{if(e){const s=e;return s.details&&(s.details==="REPEATED_ACTION"||s.details==="IMMUTABLE")?W(r,t):void 0}})}function fn(r,t){return fetch(`/api/plans/${r.plan_id}/staff/${r.user_id}`,{method:"DELETE",headers:b.headers(t)}).then(e=>{if(e.status===204)return W(r,t)})}function mn(r,t){return fetch(`/api/plans/${r.plan_id}/appointment/${r.appointment_id}`,{method:"POST",headers:b.headers(t)}).then(e=>e.status===204?W(r,t):e.status===400?e.json():void 0).then(e=>{if(e){const s=e;return s.details&&(s.details==="REPEATED_ACTION"||s.details==="IMMUTABLE")?W(r,t):void 0}})}function gn(r,t){return fetch(`/api/plans/${r.plan_id}/appointment/${r.appointment_id}`,{method:"DELETE",headers:b.headers(t)}).then(e=>{if(e.status===204)return W(r,t)})}function vn(r,t){return fetch(`/api/plans/build/${r.plan_date}`,{method:"POST",headers:{"Content-Type":"application/json",...b.headers(t)},body:JSON.stringify(r.build_options)}).then(e=>e.status===204?ee({from_plan_date:r.plan_date,to_plan_date:r.plan_date,per_page:r.per_page,page:r.page},t):e.status===400?e.json():void 0).then(e=>{if(e){const s=e;return s.details?s:void 0}})}function _n(r,t){return fetch(`/api/plans/send/${r.plan_date}`,{method:"POST",headers:b.headers(t)}).then(e=>{if(e.status===204)return ee({from_plan_date:r.plan_date,to_plan_date:r.plan_date},t)})}function yn(r,t){return fetch(`/api/plans/add/${r.plan_date}`,{method:"POST",headers:b.headers(t)}).then(e=>{if(e.status===200)return ee({from_plan_date:r.plan_date,to_plan_date:r.plan_date},t)})}function bn(r,t){return fetch(`/api/staff/${r.user_id}`,{headers:b.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Staff Member:",e),e})}function $n(r,t){let e="/api/staff";if(r.filter_status_ids&&r.filter_status_ids.length>0){const s=r.filter_status_ids.map(i=>`filter_status_id=${i}`).join("&");e+=`?${s}`}return fetch(e,{headers:b.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Staff:",s),s})}function xn(r){return fetch("/api/services",{headers:b.headers(r)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Services:",t),t})}class vt extends Error{}vt.prototype.name="InvalidTokenError";function wn(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function An(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return wn(t)}catch{return atob(t)}}function Sn(r,t){if(typeof r!="string")throw new vt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new vt(`Invalid token specified: missing part #${e+1}`);let i;try{i=An(s)}catch(n){throw new vt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new vt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const En={attribute:!0,type:String,converter:Vt,reflect:!1,hasChanged:Ue},kn=(r=En,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:a}=e;return{set(o){const l=t.get.call(this);t.set.call(this,o),this.requestUpdate(a,l,r)},init(o){return o!==void 0&&this.P(a,void 0,r),o}}}if(s==="setter"){const{name:a}=e;return function(o){const l=this[a];t.call(this,o),this.requestUpdate(a,l,r)}}throw Error("Unsupported decorator location: "+s)};function C(r){return(t,e)=>typeof e=="object"?kn(r,t,e):((s,i,n)=>{const a=i.hasOwnProperty(n);return i.constructor.createProperty(n,a?{...s,wrapped:!0}:s),a?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function y(r){return C({...r,state:!0,attribute:!1})}var Pn=Object.defineProperty,Cn=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,a;n>=0;n--)(a=r[n])&&(i=a(t,e,i)||i);return i&&Pn(t,e,i),i};const Me=class Me extends U{constructor(){super(...arguments),this.display_name="Status: 401",this._authObserver=new Tt(this,"acorn:auth")}displayNameTemplate(){return this.display_name==="Status: 401"||this.display_name==="Status: 403"?f`<span>Please <a href="/login.html?next=${window.location.href}" style="color: var(--text-color-link);" @click=${$s}>login</a></span>`:this.display_name===""?f`<span>Hello, user</span>`:f`<span>${this.display_name}</span>`}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{const e=t;if(e&&e.token){const s=Sn(e.token);s&&(this.display_name=s.user_metadata.display_name||"")}})}toggleDarkMode(t){this.classList.toggle("dark-mode"),Ct.relay(t,"dark-mode:toggle",{})}toggleActive(){this.classList.toggle("active")}render(){return f`
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        <nav class="sidebar">
            <i id="sidebar-btn" class='bx bx-menu' @click=${this.toggleActive}>
            </i>
            <div class="top">
                <div class="logo">
                    <img src="/images/AcornArranger Logo.png" alt="AcornArranger Logo">
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
                    <a href="/login.html?next=${window.location.href}" @click=${$s}>
                        <i class='bx bx-log-out'></i>
                        <span class="nav-item">Logout</span>
                    </a>
                    <span class="tooltip">Logout</span>
                </li>
            </ul>
        </nav>
    `}};Me.styles=S`
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
  `;let Jt=Me;Cn([C({attribute:!1})],Jt.prototype,"display_name");function $s(r){Ct.relay(r,"auth:message",["auth/signout"])}dt({"restful-form":ke.FormElement});class zn extends U{render(){return f`
      <restful-form new src="/auth/login">
        <slot></slot>
      </restful-form>
    `}get next(){return new URLSearchParams(document.location.search).get("next")}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:s}={token:e.created.session.access_token},i=this.next||"/";console.log("Login successful",e,i),Ct.relay(t,"auth:message",["auth/signin",{token:s,redirect:i}])})}}dt({"restful-form":ke.FormElement});class Tn extends U{render(){return f`
      <restful-form new src="/auth/signup">
        <slot></slot>
      </restful-form>
    `}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:s}={token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxa2NneGZhcWhwcXJ5dGNpeHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAyNzU3ODQsImV4cCI6MjAyNTg1MTc4NH0.f2OUbu37RF-NMV1iSj16rBOgmcarmjnntUMNGLZm7Xc"},i="/";console.log("Signup successful",e,i),Ct.relay(t,"auth:message",["auth/signin",{token:s,redirect:i}])})}}const z=S`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
img {
  max-width: 100%;
}
`,T=S`
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

/* dl {
    margin-left: var(--spacing-size-medium);
} */

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
`,je=class je extends N{constructor(){super("acorn:model")}render(){return f`
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
                    <a href="/login.html?next=/app/appointments" @click=${fe}>
                        <i class='bx bx-log-in'></i>
                        <span>Login</span>
                    </a>
                </nav>
                <section>
                    <h4>
                        Returning user?
                    </h4>
                    <p>
                        Feel free to <a href="/login.html?next=/app/appointments" @click=${fe}>login</a>
                    </p>
                </section>
                <section>
                    <h4>
                        New to AcornArranger?
                    </h4>
                    <p>
                        If you are new here, please <a href="/login.html?next=/app/appointments" @click=${fe}>create an account</a> and request access from your administrator.
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
    `}};je.styles=[z,T,S`
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
        `];let be=je;function fe(r){Ct.relay(r,"auth:message",["auth/signout"])}var On=Object.defineProperty,Rn=Object.getOwnPropertyDescriptor,Ne=(r,t,e,s)=>{for(var i=s>1?void 0:s?Rn(t,e):t,n=r.length-1,a;n>=0;n--)(a=r[n])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&On(t,e,i),i};const Un=[{id:1,label:"Active"},{id:2,label:"Inactive"},{id:3,label:"Unverified"}],Le=class Le extends N{constructor(){super("acorn:model"),this.filter_status_ids=[1,3]}get staff(){return this.model.staff}get showing_total(){return this.staff?this.staff.length:0}connectedCallback(){super.connectedCallback(),this.updateStaff()}updateStaff(){this.dispatchMessage(["staff/",{filter_status_ids:this.filter_status_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateStaff()}handleInputChange(t){const e=t.target,{name:s,value:i,type:n}=e;n==="checkbox"?this.handleCheckboxChange(t):this[s]=i}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,n=parseInt(e.value);switch(i){case"staff_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,n]:this.filter_status_ids=this.filter_status_ids.filter(o=>o!==n);break;default:const a=i;throw new Error(`Unhandled Auth message "${a}"`)}}render(){const t=(i,n)=>{var a;switch(n){case"staff_status":a=this.filter_status_ids;break;default:const o=n;throw new Error(`Unhandled Auth message "${o}"`)}return f`
            <label>
            <input
                name=${n}
                type="checkbox"
                .value=${i.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${a.includes(i.id)}
            />
            ${i.label}
            </label>
        `},e=i=>{var n,a;return f`
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
                    ${(n=i.role)==null?void 0:n.title}
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
                            ${Un.map(i=>t(i,"staff_status"))}
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
    `}};Le.styles=[z,T,S`
            
        `];let lt=Le;Ne([y()],lt.prototype,"staff",1);Ne([y()],lt.prototype,"showing_total",1);Ne([y()],lt.prototype,"filter_status_ids",2);function xs(r){const t=new Date(r),e={month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0,timeZone:"UTC"};return new Intl.DateTimeFormat("en-US",e).format(t)}function Nn(r){const t=new Date(r),e={month:"2-digit",day:"2-digit",year:"numeric"};return new Intl.DateTimeFormat("en-US",e).format(t)}function $e(r){var t=n=>("0"+n).slice(-2),e=n=>("00"+n).slice(-3),s=r.getTimezoneOffset(),i=s>0?"-":"+";return s=Math.abs(s),r.getFullYear()+"-"+t(r.getMonth()+1)+"-"+t(r.getDate())+"T"+t(r.getHours())+":"+t(r.getMinutes())+":"+t(r.getSeconds())+"."+e(r.getMilliseconds())+i+t(s/60|0)+":"+t(s%60)}var In=Object.defineProperty,Mn=Object.getOwnPropertyDescriptor,O=(r,t,e,s)=>{for(var i=s>1?void 0:s?Mn(t,e):t,n=r.length-1,a;n>=0;n--)(a=r[n])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&In(t,e,i),i};const jn=[{id:1,label:"Unconfirmed"},{id:2,label:"Confirmed"},{id:3,label:"Completed"},{id:4,label:"Completed (Invoiced)"},{id:5,label:"Cancelled"}],De=class De extends N{constructor(){super("acorn:model"),this.from_service_date=$e(new Date).split("T")[0],this.to_service_date=$e(new Date).split("T")[0],this.per_page=50,this.page=1,this.filter_status_ids=[1,2,3,4],this.filter_service_ids=[21942,23044]}get appointments(){return this.model.appointments}get services(){return this.model.services}get showing_total(){return this.appointments?this.appointments.length:0}get service_options(){return this.services?this.services.map(t=>({id:t.service_id,label:t.service_name})):[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["services/",{}]),this.updateAppointments()}updateAppointments(){const t=new Date(this.from_service_date),e=new Date(this.to_service_date);t>e&&(this.to_service_date=this.from_service_date),this.dispatchMessage(["appointments/",{from_service_date:this.from_service_date,to_service_date:this.to_service_date,per_page:this.per_page,page:this.page-1,filter_status_ids:this.filter_status_ids,filter_service_ids:this.filter_service_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateAppointments()}handleInputChange(t){const e=t.target,{name:s,value:i,type:n}=e;n==="checkbox"?this.handleCheckboxChange(t):this[s]=i}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,n=parseInt(e.value);switch(i){case"app_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,n]:this.filter_status_ids=this.filter_status_ids.filter(o=>o!==n);break;case"app_service":e.checked?this.filter_service_ids=[...this.filter_service_ids,n]:this.filter_service_ids=this.filter_service_ids.filter(o=>o!==n);break;default:const a=i;throw new Error(`Unhandled Auth message "${a}"`)}}previousPage(){this.page>1&&(this.page--,this.updateAppointments())}nextPage(){this.page++,this.updateAppointments()}render(){const t=(n,a)=>{var o;switch(a){case"app_status":o=this.filter_status_ids;break;case"app_service":o=this.filter_service_ids;break;default:const l=a;throw new Error(`Unhandled Auth message "${l}"`)}return f`
            <label>
            <input
                name=${a}
                type="checkbox"
                .value=${n.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${o.includes(n.id)}
            />
            ${n.label}
            </label>
        `},e=n=>f`
            <li>
                <span>${n.name}</span>
            </li>
        `,s=n=>{var a,o;return f`
            <tr>
                <td class="center">
                    <span>
                    ${n.appointment_id}
                    </span>
                </td>
                <td>
                    <span>
                    ${xs(n.service_time)}
                    </span>
                </td>
                <td>
                    <span>
                    ${n.property_info.property_name}
                    </span>
                </td>
                <td>
                    <ul class="staff">
                        ${(a=n.staff)==null?void 0:a.map(l=>e(l.staff_info))}
                    </ul>
                </td>
                <td class="center">
                    <span>
                    ${n.turn_around}
                    </span>
                </td>
                <td>
                    <span>
                    ${xs(n.next_arrival_time)}
                    </span>
                </td>
                <td>
                    <span>
                    ${n.service.service_name}
                    </span>
                </td>
                <td>
                    <span>
                    ${(o=n.status)==null?void 0:o.status}
                    </span>
                </td>
            </tr>
        `},i=this.appointments||[];return f`
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
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
                            ${jn.map(n=>t(n,"app_status"))}
                        </div>
                    </div>
                    <div>
                        <span>Services:</span>
                        <div class="filters">
                            ${this.service_options.map(n=>t(n,"app_service"))}
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
                    ${i.map(n=>s(n))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};De.styles=[z,T,S`
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
        `];let k=De;O([y()],k.prototype,"appointments",1);O([y()],k.prototype,"services",1);O([y()],k.prototype,"showing_total",1);O([y()],k.prototype,"service_options",1);O([y()],k.prototype,"from_service_date",2);O([y()],k.prototype,"to_service_date",2);O([y()],k.prototype,"per_page",2);O([y()],k.prototype,"page",2);O([y()],k.prototype,"filter_status_ids",2);O([y()],k.prototype,"filter_service_ids",2);var Ln=Object.defineProperty,Dn=Object.getOwnPropertyDescriptor,oi=(r,t,e,s)=>{for(var i=Dn(t,e),n=r.length-1,a;n>=0;n--)(a=r[n])&&(i=a(t,e,i)||i);return i&&Ln(t,e,i),i};const He=class He extends N{get roles(){return this.model.roles}get showing_total(){return this.roles?this.roles.length:0}constructor(){super("acorn:model")}connectedCallback(){super.connectedCallback(),this.updateRoles()}updateRoles(){this.dispatchMessage(["roles/",{}])}handleInputChange(t,e,s){const i=t.target;if(s==="priority")if(i.value)e[s]=parseInt(i.value);else return;else if(s==="can_lead_team"||s==="can_clean")e[s]=i.checked;else{if(s==="role_id")return;e[s]=i.value}this.dispatchMessage(["roles/save",{role_id:e.role_id,role:e}])}render(){const t=s=>f`
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
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
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
                                        <i class='bx bx-sync'></i>
                                    </button>
                                    <span>
                                        Priority
                                    </span>
                                    <div class="not-shown">
                                    <i class='bx bx-sync'></i>
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
    `}};He.styles=[z,T,S`
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

            i.bx {
                font-size: var(--text-font-size-large);
            }
        `];let Et=He;oi([y()],Et.prototype,"roles");oi([y()],Et.prototype,"showing_total");var Hn=Object.defineProperty,Fn=Object.getOwnPropertyDescriptor,Ie=(r,t,e,s)=>{for(var i=s>1?void 0:s?Fn(t,e):t,n=r.length-1,a;n>=0;n--)(a=r[n])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&Hn(t,e,i),i};const Bn=[{id:1,label:"Active"},{id:2,label:"Inactive"}];function qn(r){const t=Math.floor(r/60),e=r%60;return!t&&!r?"":t?e&&t===1?`${t} Hour ${e} Minutes`:e?`${t} Hours ${e} Minutes`:t===1?`${t} Hour`:`${t} Hours`:`${e} Minutes`}const Fe=class Fe extends N{constructor(){super("acorn:model"),this.filter_status_ids=[1]}get properties(){return this.model.properties}get showing_total(){return this.properties?this.properties.length:0}connectedCallback(){super.connectedCallback(),this.updateProperties()}updateProperties(){this.dispatchMessage(["properties/",{filter_status_ids:this.filter_status_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateProperties()}handleInputChange(t){const e=t.target,{name:s,value:i,type:n}=e;n==="checkbox"?this.handleCheckboxChange(t):this[s]=i}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,n=parseInt(e.value);switch(i){case"property_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,n]:this.filter_status_ids=this.filter_status_ids.filter(o=>o!==n);break;default:const a=i;throw new Error(`Unhandled Auth message "${a}"`)}}render(){const t=(n,a)=>{var o;switch(a){case"property_status":o=this.filter_status_ids;break;default:const l=a;throw new Error(`Unhandled Auth message "${l}"`)}return f`
            <label>
            <input
                name=${a}
                type="checkbox"
                .value=${n.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${o.includes(n.id)}
            />
            ${n.label}
            </label>
        `},e=n=>f`
            <li>
                <span>${n}</span>
            </li>
        `,s=n=>{var a,o;return f`
            <tr>
                <td class="center">
                    <a href="/app/property/${n.properties_id}">
                        <span>
                        ${n.properties_id}
                        </span>
                    </a>
                </td>
                <td>
                    <span>
                    ${n.property_name}
                    </span>
                </td>
                <td>
                    <span>
                    ${qn(n.estimated_cleaning_mins)}
                    </span>
                </td>
                <td>
                    <ul>
                    ${(a=n.double_unit)==null?void 0:a.map(l=>e(l))}
                    </ul>
                </td>
                <td class="center">
                    <span>
                    ${(o=n.status)==null?void 0:o.status}
                    </span>
                </td>
                <td>
                    <a href="/app/property/${n.properties_id}/edit">
                        <i class='bx bxs-edit-alt'></i>
                    </a>
                </td>
            </tr>
        `},i=this.properties||[];return f`
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
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
                            ${Bn.map(n=>t(n,"property_status"))}
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
                    ${i.map(n=>s(n))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};Fe.styles=[z,T,S`
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

            i.bx {
                font-size: var(--text-font-size-large);
                color: var(--text-color-body);
            }
        `];let ct=Fe;Ie([y()],ct.prototype,"properties",1);Ie([y()],ct.prototype,"showing_total",1);Ie([y()],ct.prototype,"filter_status_ids",2);var Vn=Object.defineProperty,Yn=Object.getOwnPropertyDescriptor,li=(r,t,e,s)=>{for(var i=s>1?void 0:s?Yn(t,e):t,n=r.length-1,a;n>=0;n--)(a=r[n])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&Vn(t,e,i),i};const Be=class Be extends N{get model_plan(){return this.model.plan}constructor(){super("acorn:model")}updated(t){super.updated(t);const e=this.model_plan;e&&(!this.plan||e.plan_id===this.plan.plan_id)&&(this.plan=e)}render(){if(!this.plan)return f`<section><p>Loading...</p></section>`;const t=s=>f`
            <li>
                <span>${s.name}</span>
            </li>
        `,e=s=>f`
            <li>
                <span>${s.property_info.property_name}</span>
            </li>
        `;return f`
        <section>
            <div>
                <p>ID: ${this.plan.plan_id}</p>
                <p>${Nn(this.plan.plan_date)}</p>
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
    `}};Be.styles=[z,T,S`
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
        `];let kt=Be;li([y()],kt.prototype,"model_plan",1);li([C({attribute:!1})],kt.prototype,"plan",2);var Jn=Object.defineProperty,Wn=Object.getOwnPropertyDescriptor,Ut=(r,t,e,s)=>{for(var i=s>1?void 0:s?Wn(t,e):t,n=r.length-1,a;n>=0;n--)(a=r[n])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&Jn(t,e,i),i};const Zt=class Zt extends N{constructor(){super("acorn:model"),this.from_plan_date=$e(new Date).split("T")[0],this.per_page=10,this.page=1}get plans(){return this.model.plans}get showing_total(){return this.plans?this.plans.length:0}connectedCallback(){super.connectedCallback(),this.updatePlans()}updatePlans(){this.dispatchMessage(["plans/",{from_plan_date:this.from_plan_date,per_page:this.per_page,page:this.page-1}])}handleTableOptionChange(t){this.handleInputChange(t),this.updatePlans()}handleInputChange(t){const e=t.target,{name:s,value:i}=e;this[s]=i}previousPage(){this.page>1&&(this.page--,this.updatePlans())}nextPage(){this.page++,this.updatePlans()}render(){const t=s=>f`
            <plan-view .plan=${s}></plan-view>
        `,e=this.plans||[];return f`
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        <div class="page">
            <header>
                <h1>
                    Schedule Plans
                </h1>
            </header>
            <main>
                <menu class="table-menu">
                    <div>
                        <label>
                            <span>Schedule Date:</span>
                            <input name="from_plan_date" autocomplete="off" .value=${this.from_plan_date} type="date" @input=${this.handleTableOptionChange} />
                        </label>
                    </div>
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
    `}};Zt.uses=dt({"plan-view":kt}),Zt.styles=[z,T,S`

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
        `];let L=Zt;Ut([y()],L.prototype,"plans",1);Ut([y()],L.prototype,"showing_total",1);Ut([C({type:String})],L.prototype,"from_plan_date",2);Ut([C({type:Number})],L.prototype,"per_page",2);Ut([C({type:Number})],L.prototype,"page",2);var Zn=Object.defineProperty,Gn=Object.getOwnPropertyDescriptor,pt=(r,t,e,s)=>{for(var i=s>1?void 0:s?Gn(t,e):t,n=r.length-1,a;n>=0;n--)(a=r[n])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&Zn(t,e,i),i};const ci=S`
div.detail-header {
    display: flex;
    justify-content: flex-start;
    padding-left: var(--spacing-size-small);
    width: 100%;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: var(--spacing-size-small);
    width: 100%;
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

i.bx {
    font-size: var(--text-font-size-large);
}
`,qe=class qe extends U{render(){return f`
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <div class="page">
        <header>
            <h1>
                <slot name="property_name_header"><span>Property View</span></slot>
            </h1>
        </header>
        <main>
            <div class="detail-header"><h4>Details</h4></div>
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
            <div class="options-header">
                <h4>Options</h4>
                <nav>
                    <a href="/app/property/${this.property}/edit" class="edit">
                        <i class='bx bxs-edit-alt'></i>
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
    `}};qe.styles=[z,T,ci,S`
    ::slotted(ul) {
        list-style-type: none;
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-size-small);
        max-width: calc(var(--spacing-size-medium) * 16);
    }
    `];let Wt=qe;pt([C()],Wt.prototype,"property",2);const Gt=class Gt extends U{render(){return f`
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <div class="page">
        <header>
            <h1>
                <slot name="property_name_header"><span>Property View</span></slot>
            </h1>
        </header>
        <main>
        <div class="detail-header"><h4>Details</h4></div>
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
            <div class="options-header">
                <h4>Options</h4>
                <nav>
                    <a href="/app/property/${this.property}" class="close">
                        <i class='bx bx-x'></i>
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
    `}};Gt.uses=dt({"mu-form":zi.Element,"input-array":Tr.Element}),Gt.styles=[z,T,ci,S`
        mu-form {
        grid-column: key / end;
        }
        mu-form input {
        grid-column: input;
        }

        a.close {
            gap: 0;
        }
    `];let Pt=Gt;pt([C()],Pt.prototype,"property",2);pt([C({attribute:!1})],Pt.prototype,"init",2);const Kt=class Kt extends N{constructor(){super("acorn:model"),this.edit=!1,this.properties_id=0}get property(){return this.model.property}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="properties-id"&&e!==s&&s&&(console.log("Property Page:",s),this.dispatchMessage(["properties/select",{properties_id:parseInt(s)}]))}render(){const{properties_id:t,property_name:e,address:s,status:i,estimated_cleaning_mins:n,double_unit:a=[]}=this.property||{properties_id:0},o=a.map(u=>f`
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
            <span slot="estimated_cleaning_mins">${n}</span>
            <ul slot="double_unit">
            ${o}
            </ul>
        </property-viewer>
        `}_handleSubmit(t){console.log("Handling submit of mu-form"),this.dispatchMessage(["properties/save",{properties_id:this.properties_id,property:t.detail,onSuccess:()=>Os.dispatch(this,"history/navigate",{href:`/app/property/${this.properties_id}`}),onFailure:e=>console.log("ERROR:",e)}])}};Kt.uses=dt({"property-viewer":Wt,"property-editor":Pt}),Kt.styles=[z,T,S`
        li {
            width: max-content;
            background-color: var(--background-color);
            border-radius: var(--border-size-radius);
            padding: 0 var(--spacing-size-small);
        }
    `];let ht=Kt;pt([C({type:Boolean,reflect:!0})],ht.prototype,"edit",2);pt([C({attribute:"properties-id",reflect:!0,type:Number})],ht.prototype,"properties_id",2);pt([y()],ht.prototype,"property",1);const Kn=[{path:"/app/appointments",view:()=>f`
      <appointments-view></appointments-view>
    `},{path:"/app/staff",view:()=>f`
      <staff-view></staff-view>
    `},{path:"/app/roles",view:()=>f`
      <roles-view></roles-view>
    `},{path:"/app/properties",view:()=>f`
      <properties-view></properties-view>
    `},{path:"/app/property/:id/edit",view:r=>f`
      <property-view edit properties-id=${r.id}></property-view>
    `},{path:"/app/property/:id",view:r=>f`
      <property-view properties-id=${r.id}></property-view>
    `},{path:"/app/schedule",view:()=>f`
      <plans-view></plans-view>
    `},{path:"/app",view:()=>f`
      <landing-view></landing-view>
    `},{path:"/",redirect:"/app"}];dt({"mu-auth":b.Provider,"mu-store":class extends Mi.Provider{constructor(){super(rn,tn,"acorn:auth")}},"mu-history":Os.Provider,"mu-switch":class extends kr.Element{constructor(){super(Kn,"acorn:history")}},"side-bar":Jt,"login-form":zn,"signup-form":Tn,"restful-form":ke.FormElement,"landing-view":be,"staff-view":lt,"appointments-view":k,"roles-view":Et,"properties-view":ct,"plans-view":L,"property-view":ht});export{b as a,dt as d,Ct as e};
