(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function e(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=e(i);fetch(i.href,a)}})();var pt,Ss;let jt=class extends Error{};jt.prototype.name="InvalidTokenError";function Yi(n){return decodeURIComponent(atob(n).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Bi(n){let t=n.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Yi(t)}catch{return atob(t)}}function ii(n,t){if(typeof n!="string")throw new jt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=n.split(".")[e];if(typeof s!="string")throw new jt(`Invalid token specified: missing part #${e+1}`);let i;try{i=Bi(s)}catch(a){throw new jt(`Invalid token specified: invalid base64 for part #${e+1} (${a.message})`)}try{return JSON.parse(i)}catch(a){throw new jt(`Invalid token specified: invalid json for part #${e+1} (${a.message})`)}}const Wi="mu:context",Me=`${Wi}:change`;class Ji{constructor(t,e){this._proxy=Vi(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Fe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Ji(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Me,t),t}detach(t){this.removeEventListener(Me,t)}}function Vi(n,t){return new Proxy(n,{get:(s,i,a)=>{if(i==="then")return;const r=Reflect.get(s,i,a);return console.log(`Context['${i}'] => `,r),r},set:(s,i,a,r)=>{const o=n[i];console.log(`Context['${i.toString()}'] <= `,a);const l=Reflect.set(s,i,a,r);if(l){let u=new CustomEvent(Me,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:i,oldValue:o,value:a}),t.dispatchEvent(u)}else console.log(`Context['${i}] was not set to ${a}`);return l}})}function Gi(n,t){const e=ni(t,n);return new Promise((s,i)=>{if(e){const a=e.localName;customElements.whenDefined(a).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function ni(n,t){const e=`[provides="${n}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return ni(n,i.host)}class Zi extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ai(n="mu:message"){return(t,...e)=>t.dispatchEvent(new Zi(e,n))}class Xe{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Ki(n){return t=>({...t,...n})}const je="mu:auth:jwt",ri=class oi extends Xe{constructor(t,e){super((s,i)=>this.update(s,i),t,oi.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(tn(s)),Ee(i);case"auth/signout":return e(en()),Ee(this._redirectForLogin);case"auth/redirect":return Ee(this._redirectForLogin,{next:window.location.href});default:const a=t[0];throw new Error(`Unhandled Auth message "${a}"`)}}};ri.EVENT_TYPE="auth:message";let li=ri;const ci=ai(li.EVENT_TYPE);function Ee(n,t={}){if(!n)return;const e=window.location.href,s=new URL(n,e);return Object.entries(t).forEach(([i,a])=>s.searchParams.set(i,a)),()=>{console.log("Redirecting to ",n),window.location.assign(s)}}class Qi extends Fe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=bt.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new li(this.context,this.redirect).attach(this)}}class vt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(je),t}}class bt extends vt{constructor(t){super();const e=ii(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new bt(t);return localStorage.setItem(je,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(je);return t?bt.authenticate(t):new vt}}function tn(n){return Ki({user:bt.authenticate(n),token:n})}function en(){return n=>{const t=n.user;return{user:t&&t.authenticated?vt.deauthenticate(t):t,token:""}}}function sn(n){return n.authenticated?{Authorization:`Bearer ${n.token||"NO_TOKEN"}`}:{}}function nn(n){return n.authenticated?ii(n.token||""):{}}const A=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:bt,Provider:Qi,User:vt,dispatch:ci,headers:sn,payload:nn},Symbol.toStringTag,{value:"Module"}));function oe(n,t,e){const s=n.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${n.type}:`,i),s.dispatchEvent(i),n.stopPropagation()}function Ie(n,t="*"){return n.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const Zt=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:Ie,relay:oe},Symbol.toStringTag,{value:"Module"}));function di(n,...t){const e=n.map((i,a)=>a?[t[a-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const an=new DOMParser;function et(n,...t){const e=t.map(o),s=n.map((l,u)=>{if(u===0)return[l];const m=e[u-1];return m instanceof Node?[`<ins id="mu-html-${u-1}"></ins>`,l]:[m,l]}).flat().join(""),i=an.parseFromString(s,"text/html"),a=i.head.childElementCount?i.head.children:i.body.children,r=new DocumentFragment;return r.replaceChildren(...a),e.forEach((l,u)=>{if(l instanceof Node){const m=r.querySelector(`ins#mu-html-${u}`);if(m){const p=m.parentNode;p==null||p.replaceChild(l,m)}else console.log("Missing insertion point:",`ins#mu-html-${u}`)}}),r;function o(l,u){if(l===null)return"";switch(typeof l){case"string":return As(l);case"bigint":case"boolean":case"number":case"symbol":return As(l.toString());case"object":if(l instanceof Node||l instanceof DocumentFragment)return l;if(Array.isArray(l)){const m=new DocumentFragment,p=l.map(o);return m.replaceChildren(...p),m}return new Text(l.toString());default:return new Comment(`[invalid parameter of type "${typeof l}"]`)}}}function As(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ye(n,t={mode:"open"}){const e=n.attachShadow(t),s={template:i,styles:a};return s;function i(r){const o=r.firstElementChild,l=o&&o.tagName==="TEMPLATE"?o:void 0;return l&&e.appendChild(l.content.cloneNode(!0)),s}function a(...r){e.adoptedStyleSheets=r}}let rn=(pt=class extends HTMLElement{constructor(){super(),this._state={},ye(this).template(pt.template).styles(pt.styles),this.addEventListener("change",n=>{const t=n.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",n=>{n.preventDefault(),oe(n,"mu-form:submit",this._state)})}set init(n){this._state=n||{},on(this._state,this)}get form(){var n;return(n=this.shadowRoot)==null?void 0:n.querySelector("form")}},pt.template=et`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,pt.styles=di`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `,pt);function on(n,t){const e=Object.entries(n);for(const[s,i]of e){const a=t.querySelector(`[name="${s}"]`);if(a){const r=a;switch(r.type){case"checkbox":const o=r;o.checked=!!i;break;case"date":r.value=i.toISOString().substr(0,10);break;default:r.value=i;break}}}return n}const ln=Object.freeze(Object.defineProperty({__proto__:null,Element:rn},Symbol.toStringTag,{value:"Module"})),hi=class pi extends Xe{constructor(t){super((e,s)=>this.update(e,s),t,pi.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(dn(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(hn(s,i));break}}}};hi.EVENT_TYPE="history:message";let Ye=hi;class Es extends Fe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=cn(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),Be(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new Ye(this.context).attach(this)}}function cn(n){const t=n.currentTarget,e=s=>s.tagName=="A"&&s.href;if(n.button===0)if(n.composed){const i=n.composedPath().find(e);return i||void 0}else{for(let s=n.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function dn(n,t={}){return history.pushState(t,"",n),()=>({location:document.location,state:history.state})}function hn(n,t={}){return history.replaceState(t,"",n),()=>({location:document.location,state:history.state})}const Be=ai(Ye.EVENT_TYPE),ui=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Es,Provider:Es,Service:Ye,dispatch:Be},Symbol.toStringTag,{value:"Module"}));class it{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new zs(this._provider,t);this._effects.push(i),e(i)}else Gi(this._target,this._contextLabel).then(i=>{const a=new zs(i,t);this._provider=i,this._effects.push(a),i.attach(r=>this._handleChange(r)),e(a)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class zs{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const We=class fi extends HTMLElement{constructor(){super(),this._state={},this._user=new vt,this._authObserver=new it(this,"blazing:auth"),ye(this).template(fi.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;un(i,this._state,e,this.authorization).then(a=>Tt(a,this)).then(a=>{const r=`mu-rest-form:${s}`,o=new CustomEvent(r,{bubbles:!0,composed:!0,detail:{method:e,[s]:a,url:i}});this.dispatchEvent(o)}).catch(a=>{const r="mu-rest-form:error",o=new CustomEvent(r,{bubbles:!0,composed:!0,detail:{method:e,error:a,url:i,request:this._state}});this.dispatchEvent(o)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},Tt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ne(this.src,this.authorization).then(e=>{this._state=e,Tt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Ne(this.src,this.authorization).then(i=>{this._state=i,Tt(i,this)});break;case"new":s&&(this._state={},Tt({},this));break}}};We.observedAttributes=["src","new","action"];We.template=et`
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
  `;let pn=We;function Ne(n,t){return fetch(n,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${n}:`,e))}function Tt(n,t){const e=Object.entries(n);for(const[s,i]of e){const a=t.querySelector(`[name="${s}"]`);if(a){const r=a;switch(r.type){case"checkbox":const o=r;o.checked=!!i;break;default:r.value=i;break}}}return n}function un(n,t,e="PUT",s={}){return fetch(n,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const Je=Object.freeze(Object.defineProperty({__proto__:null,FormElement:pn,fetchData:Ne},Symbol.toStringTag,{value:"Module"})),mi=class gi extends Xe{constructor(t,e){super(e,t,gi.EVENT_TYPE,!1)}};mi.EVENT_TYPE="mu:message";let vi=mi;class fn extends Fe{constructor(t,e,s){super(e),this._user=new vt,this._updateFn=t,this._authObserver=new it(this,s)}connectedCallback(){const t=new vi(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const mn=Object.freeze(Object.defineProperty({__proto__:null,Provider:fn,Service:vi},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ae=globalThis,Ve=ae.ShadowRoot&&(ae.ShadyCSS===void 0||ae.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ge=Symbol(),Cs=new WeakMap;let bi=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Ve&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Cs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Cs.set(e,t))}return t}toString(){return this.cssText}};const gn=n=>new bi(typeof n=="string"?n:n+"",void 0,Ge),vn=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((s,i,a)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[a+1],n[0]);return new bi(e,n,Ge)},bn=(n,t)=>{if(Ve)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=ae.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},Ps=Ve?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return gn(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:_n,defineProperty:yn,getOwnPropertyDescriptor:$n,getOwnPropertyNames:xn,getOwnPropertySymbols:wn,getPrototypeOf:kn}=Object,_t=globalThis,Os=_t.trustedTypes,Sn=Os?Os.emptyScript:"",Ts=_t.reactiveElementPolyfillSupport,Nt=(n,t)=>n,le={toAttribute(n,t){switch(t){case Boolean:n=n?Sn:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},Ze=(n,t)=>!_n(n,t),Rs={attribute:!0,type:String,converter:le,reflect:!1,hasChanged:Ze};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),_t.litPropertyMetadata??(_t.litPropertyMetadata=new WeakMap);let ft=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Rs){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&yn(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:a}=$n(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get(){return i==null?void 0:i.call(this)},set(r){const o=i==null?void 0:i.call(this);a.call(this,r),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Rs}static _$Ei(){if(this.hasOwnProperty(Nt("elementProperties")))return;const t=kn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Nt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Nt("properties"))){const e=this.properties,s=[...xn(e),...wn(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Ps(i))}else t!==void 0&&e.push(Ps(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return bn(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,i);if(a!==void 0&&i.reflect===!0){const r=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:le).toAttribute(e,i.type);this._$Em=t,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,a=i._$Eh.get(t);if(a!==void 0&&this._$Em!==a){const r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:((s=r.converter)==null?void 0:s.fromAttribute)!==void 0?r.converter:le;this._$Em=a,this[a]=o.fromAttribute(e,r.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??Ze)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[a,r]of i)r.wrapped!==!0||this._$AL.has(a)||this[a]===void 0||this.P(a,this[a],r)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var a;return(a=i.hostUpdate)==null?void 0:a.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};ft.elementStyles=[],ft.shadowRootOptions={mode:"open"},ft[Nt("elementProperties")]=new Map,ft[Nt("finalized")]=new Map,Ts==null||Ts({ReactiveElement:ft}),(_t.reactiveElementVersions??(_t.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ce=globalThis,de=ce.trustedTypes,Us=de?de.createPolicy("lit-html",{createHTML:n=>n}):void 0,_i="$lit$",B=`lit$${Math.random().toFixed(9).slice(2)}$`,yi="?"+B,An=`<${yi}>`,nt=document,Ht=()=>nt.createComment(""),qt=n=>n===null||typeof n!="object"&&typeof n!="function",Ke=Array.isArray,En=n=>Ke(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",ze=`[ 	
\f\r]`,Rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ms=/-->/g,js=/>/g,Z=RegExp(`>|${ze}(?:([^\\s"'>=/]+)(${ze}*=${ze}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Is=/'/g,Ns=/"/g,$i=/^(?:script|style|textarea|title)$/i,zn=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),Ut=zn(1),yt=Symbol.for("lit-noChange"),O=Symbol.for("lit-nothing"),Ls=new WeakMap,Q=nt.createTreeWalker(nt,129);function xi(n,t){if(!Ke(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Us!==void 0?Us.createHTML(t):t}const Cn=(n,t)=>{const e=n.length-1,s=[];let i,a=t===2?"<svg>":t===3?"<math>":"",r=Rt;for(let o=0;o<e;o++){const l=n[o];let u,m,p=-1,c=0;for(;c<l.length&&(r.lastIndex=c,m=r.exec(l),m!==null);)c=r.lastIndex,r===Rt?m[1]==="!--"?r=Ms:m[1]!==void 0?r=js:m[2]!==void 0?($i.test(m[2])&&(i=RegExp("</"+m[2],"g")),r=Z):m[3]!==void 0&&(r=Z):r===Z?m[0]===">"?(r=i??Rt,p=-1):m[1]===void 0?p=-2:(p=r.lastIndex-m[2].length,u=m[1],r=m[3]===void 0?Z:m[3]==='"'?Ns:Is):r===Ns||r===Is?r=Z:r===Ms||r===js?r=Rt:(r=Z,i=void 0);const d=r===Z&&n[o+1].startsWith("/>")?" ":"";a+=r===Rt?l+An:p>=0?(s.push(u),l.slice(0,p)+_i+l.slice(p)+B+d):l+B+(p===-2?o:d)}return[xi(n,a+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let Le=class wi{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let a=0,r=0;const o=t.length-1,l=this.parts,[u,m]=Cn(t,e);if(this.el=wi.createElement(u,s),Q.currentNode=this.el.content,e===2||e===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=Q.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(const p of i.getAttributeNames())if(p.endsWith(_i)){const c=m[r++],d=i.getAttribute(p).split(B),f=/([.?@])?(.*)/.exec(c);l.push({type:1,index:a,name:f[2],strings:d,ctor:f[1]==="."?On:f[1]==="?"?Tn:f[1]==="@"?Rn:$e}),i.removeAttribute(p)}else p.startsWith(B)&&(l.push({type:6,index:a}),i.removeAttribute(p));if($i.test(i.tagName)){const p=i.textContent.split(B),c=p.length-1;if(c>0){i.textContent=de?de.emptyScript:"";for(let d=0;d<c;d++)i.append(p[d],Ht()),Q.nextNode(),l.push({type:2,index:++a});i.append(p[c],Ht())}}}else if(i.nodeType===8)if(i.data===yi)l.push({type:2,index:a});else{let p=-1;for(;(p=i.data.indexOf(B,p+1))!==-1;)l.push({type:7,index:a}),p+=B.length-1}a++}}static createElement(t,e){const s=nt.createElement("template");return s.innerHTML=t,s}};function $t(n,t,e=n,s){var i,a;if(t===yt)return t;let r=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const o=qt(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==o&&((a=r==null?void 0:r._$AO)==null||a.call(r,!1),o===void 0?r=void 0:(r=new o(n),r._$AT(n,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=r:e.l=r),r!==void 0&&(t=$t(n,r._$AS(n,t.values),r,s)),t}class Pn{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??nt).importNode(e,!0);Q.currentNode=i;let a=Q.nextNode(),r=0,o=0,l=s[0];for(;l!==void 0;){if(r===l.index){let u;l.type===2?u=new Kt(a,a.nextSibling,this,t):l.type===1?u=new l.ctor(a,l.name,l.strings,this,t):l.type===6&&(u=new Un(a,this,t)),this._$AV.push(u),l=s[++o]}r!==(l==null?void 0:l.index)&&(a=Q.nextNode(),r++)}return Q.currentNode=nt,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Kt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=O,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=$t(this,t,e),qt(t)?t===O||t==null||t===""?(this._$AH!==O&&this._$AR(),this._$AH=O):t!==this._$AH&&t!==yt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):En(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==O&&qt(this._$AH)?this._$AA.nextSibling.data=t:this.T(nt.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,a=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Le.createElement(xi(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===a)this._$AH.p(s);else{const r=new Pn(a,this),o=r.u(this.options);r.p(s),this.T(o),this._$AH=r}}_$AC(t){let e=Ls.get(t.strings);return e===void 0&&Ls.set(t.strings,e=new Le(t)),e}k(t){Ke(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const a of t)i===e.length?e.push(s=new Kt(this.O(Ht()),this.O(Ht()),this,this.options)):s=e[i],s._$AI(a),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class $e{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,a){this.type=1,this._$AH=O,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=O}_$AI(t,e=this,s,i){const a=this.strings;let r=!1;if(a===void 0)t=$t(this,t,e,0),r=!qt(t)||t!==this._$AH&&t!==yt,r&&(this._$AH=t);else{const o=t;let l,u;for(t=a[0],l=0;l<a.length-1;l++)u=$t(this,o[s+l],e,l),u===yt&&(u=this._$AH[l]),r||(r=!qt(u)||u!==this._$AH[l]),u===O?t=O:t!==O&&(t+=(u??"")+a[l+1]),this._$AH[l]=u}r&&!i&&this.j(t)}j(t){t===O?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class On extends $e{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===O?void 0:t}}class Tn extends $e{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==O)}}class Rn extends $e{constructor(t,e,s,i,a){super(t,e,s,i,a),this.type=5}_$AI(t,e=this){if((t=$t(this,t,e,0)??O)===yt)return;const s=this._$AH,i=t===O&&s!==O||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==O&&(s===O||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Un{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){$t(this,t)}}const Ds=ce.litHtmlPolyfillSupport;Ds==null||Ds(Le,Kt),(ce.litHtmlVersions??(ce.litHtmlVersions=[])).push("3.2.0");const Mn=(n,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const a=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new Kt(t.insertBefore(Ht(),a),a,void 0,e??{})}return i._$AI(n),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let gt=class extends ft{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Mn(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return yt}};gt._$litElement$=!0,gt.finalized=!0,(Ss=globalThis.litElementHydrateSupport)==null||Ss.call(globalThis,{LitElement:gt});const Hs=globalThis.litElementPolyfillSupport;Hs==null||Hs({LitElement:gt});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jn={attribute:!0,type:String,converter:le,reflect:!1,hasChanged:Ze},In=(n=jn,t,e)=>{const{kind:s,metadata:i}=e;let a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),a.set(e.name,n),s==="accessor"){const{name:r}=e;return{set(o){const l=t.get.call(this);t.set.call(this,o),this.requestUpdate(r,l,n)},init(o){return o!==void 0&&this.P(r,void 0,n),o}}}if(s==="setter"){const{name:r}=e;return function(o){const l=this[r];t.call(this,o),this.requestUpdate(r,l,n)}}throw Error("Unsupported decorator location: "+s)};function ki(n){return(t,e)=>typeof e=="object"?In(n,t,e):((s,i,a)=>{const r=i.hasOwnProperty(a);return i.constructor.createProperty(a,r?{...s,wrapped:!0}:s),r?Object.getOwnPropertyDescriptor(i,a):void 0})(n,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Si(n){return ki({...n,state:!0,attribute:!1})}function Nn(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}function Ln(n){throw new Error('Could not dynamically require "'+n+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ai={};(function(n){var t=function(){var e=function(p,c,d,f){for(d=d||{},f=p.length;f--;d[p[f]]=c);return d},s=[1,9],i=[1,10],a=[1,11],r=[1,12],o=[5,11,12,13,14,15],l={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,d,f,b,_,k,G){var M=k.length-1;switch(_){case 1:return new b.Root({},[k[M-1]]);case 2:return new b.Root({},[new b.Literal({value:""})]);case 3:this.$=new b.Concat({},[k[M-1],k[M]]);break;case 4:case 5:this.$=k[M];break;case 6:this.$=new b.Literal({value:k[M]});break;case 7:this.$=new b.Splat({name:k[M]});break;case 8:this.$=new b.Param({name:k[M]});break;case 9:this.$=new b.Optional({},[k[M-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:a,15:r},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:a,15:r},{1:[2,2]},e(o,[2,4]),e(o,[2,5]),e(o,[2,6]),e(o,[2,7]),e(o,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:a,15:r},e(o,[2,10]),e(o,[2,11]),e(o,[2,12]),{1:[2,1]},e(o,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:a,15:r},e(o,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,d){if(d.recoverable)this.trace(c);else{let f=function(b,_){this.message=b,this.hash=_};throw f.prototype=Error,new f(c,d)}},parse:function(c){var d=this,f=[0],b=[null],_=[],k=this.table,G="",M=0,ct=0,Ot=2,S=1,E=_.slice.call(arguments,1),g=Object.create(this.lexer),y={yy:{}};for(var $ in this.yy)Object.prototype.hasOwnProperty.call(this.yy,$)&&(y.yy[$]=this.yy[$]);g.setInput(c,y.yy),y.yy.lexer=g,y.yy.parser=this,typeof g.yylloc>"u"&&(g.yylloc={});var N=g.yylloc;_.push(N);var L=g.options&&g.options.ranges;typeof y.yy.parseError=="function"?this.parseError=y.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var F=function(){var ht;return ht=g.lex()||S,typeof ht!="number"&&(ht=d.symbols_[ht]||ht),ht},w,x,C,Se,dt={},ie,Y,ks,ne;;){if(x=f[f.length-1],this.defaultActions[x]?C=this.defaultActions[x]:((w===null||typeof w>"u")&&(w=F()),C=k[x]&&k[x][w]),typeof C>"u"||!C.length||!C[0]){var Ae="";ne=[];for(ie in k[x])this.terminals_[ie]&&ie>Ot&&ne.push("'"+this.terminals_[ie]+"'");g.showPosition?Ae="Parse error on line "+(M+1)+`:
`+g.showPosition()+`
Expecting `+ne.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Ae="Parse error on line "+(M+1)+": Unexpected "+(w==S?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Ae,{text:g.match,token:this.terminals_[w]||w,line:g.yylineno,loc:N,expected:ne})}if(C[0]instanceof Array&&C.length>1)throw new Error("Parse Error: multiple actions possible at state: "+x+", token: "+w);switch(C[0]){case 1:f.push(w),b.push(g.yytext),_.push(g.yylloc),f.push(C[1]),w=null,ct=g.yyleng,G=g.yytext,M=g.yylineno,N=g.yylloc;break;case 2:if(Y=this.productions_[C[1]][1],dt.$=b[b.length-Y],dt._$={first_line:_[_.length-(Y||1)].first_line,last_line:_[_.length-1].last_line,first_column:_[_.length-(Y||1)].first_column,last_column:_[_.length-1].last_column},L&&(dt._$.range=[_[_.length-(Y||1)].range[0],_[_.length-1].range[1]]),Se=this.performAction.apply(dt,[G,ct,M,y.yy,C[1],b,_].concat(E)),typeof Se<"u")return Se;Y&&(f=f.slice(0,-1*Y*2),b=b.slice(0,-1*Y),_=_.slice(0,-1*Y)),f.push(this.productions_[C[1]][0]),b.push(dt.$),_.push(dt._$),ks=k[f[f.length-2]][f[f.length-1]],f.push(ks);break;case 3:return!0}}return!0}},u=function(){var p={EOF:1,parseError:function(d,f){if(this.yy.parser)this.yy.parser.parseError(d,f);else throw new Error(d)},setInput:function(c,d){return this.yy=d||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var d=c.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var d=c.length,f=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var b=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),f.length-1&&(this.yylineno-=f.length-1);var _=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:f?(f.length===b.length?this.yylloc.first_column:0)+b[b.length-f.length].length-f[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[_[0],_[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),d=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+d+"^"},test_match:function(c,d){var f,b,_;if(this.options.backtrack_lexer&&(_={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(_.yylloc.range=this.yylloc.range.slice(0))),b=c[0].match(/(?:\r\n?|\n).*/g),b&&(this.yylineno+=b.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:b?b[b.length-1].length-b[b.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],f=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),f)return f;if(this._backtrack){for(var k in _)this[k]=_[k];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,d,f,b;this._more||(this.yytext="",this.match="");for(var _=this._currentRules(),k=0;k<_.length;k++)if(f=this._input.match(this.rules[_[k]]),f&&(!d||f[0].length>d[0].length)){if(d=f,b=k,this.options.backtrack_lexer){if(c=this.test_match(f,_[k]),c!==!1)return c;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(c=this.test_match(d,_[b]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var d=this.next();return d||this.lex()},begin:function(d){this.conditionStack.push(d)},popState:function(){var d=this.conditionStack.length-1;return d>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(d){return d=this.conditionStack.length-1-Math.abs(d||0),d>=0?this.conditionStack[d]:"INITIAL"},pushState:function(d){this.begin(d)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(d,f,b,_){switch(b){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return p}();l.lexer=u;function m(){this.yy={}}return m.prototype=l,l.Parser=m,new m}();typeof Ln<"u"&&(n.parser=t,n.Parser=t.Parser,n.parse=function(){return t.parse.apply(t,arguments)})})(Ai);function ut(n){return function(t,e){return{displayName:n,props:t,children:e||[]}}}var Ei={Root:ut("Root"),Concat:ut("Concat"),Literal:ut("Literal"),Splat:ut("Splat"),Param:ut("Param"),Optional:ut("Optional")},zi=Ai.parser;zi.yy=Ei;var Dn=zi,Hn=Object.keys(Ei);function qn(n){return Hn.forEach(function(t){if(typeof n[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:n}}var Ci=qn,Fn=Ci,Xn=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Pi(n){this.captures=n.captures,this.re=n.re}Pi.prototype.match=function(n){var t=this.re.exec(n),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Yn=Fn({Concat:function(n){return n.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(n){return{re:n.props.value.replace(Xn,"\\$&"),captures:[]}},Splat:function(n){return{re:"([^?]*?)",captures:[n.props.name]}},Param:function(n){return{re:"([^\\/\\?]+)",captures:[n.props.name]}},Optional:function(n){var t=this.visit(n.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(n){var t=this.visit(n.children[0]);return new Pi({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Bn=Yn,Wn=Ci,Jn=Wn({Concat:function(n,t){var e=n.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(n){return decodeURI(n.props.value)},Splat:function(n,t){return t[n.props.name]?t[n.props.name]:!1},Param:function(n,t){return t[n.props.name]?t[n.props.name]:!1},Optional:function(n,t){var e=this.visit(n.children[0],t);return e||""},Root:function(n,t){t=t||{};var e=this.visit(n.children[0],t);return e?encodeURI(e):!1}}),Vn=Jn,Gn=Dn,Zn=Bn,Kn=Vn;Qt.prototype=Object.create(null);Qt.prototype.match=function(n){var t=Zn.visit(this.ast),e=t.match(n);return e||!1};Qt.prototype.reverse=function(n){return Kn.visit(this.ast,n)};function Qt(n){var t;if(this?t=this:t=Object.create(Qt.prototype),typeof n>"u")throw new Error("A route spec is required");return t.spec=n,t.ast=Gn.parse(n),t}var Qn=Qt,ta=Qn,ea=ta;const sa=Nn(ea);var ia=Object.defineProperty,Oi=(n,t,e,s)=>{for(var i=void 0,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=r(t,e,i)||i);return i&&ia(t,e,i),i};const Ti=class extends gt{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>Ut` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new sa(i.path)})),this._historyObserver=new it(this,e),this._authObserver=new it(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),Ut` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(ci(this,"auth/redirect"),Ut` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):Ut` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),Ut` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),a=s+e;for(const r of this._cases){const o=r.route.match(a);if(o)return{...r,path:s,params:o,query:i}}}redirect(t){Be(this,"history/redirect",{href:t})}};Ti.styles=vn`
    :host,
    main {
      display: contents;
    }
  `;let he=Ti;Oi([Si()],he.prototype,"_user");Oi([Si()],he.prototype,"_match");const na=Object.freeze(Object.defineProperty({__proto__:null,Element:he,Switch:he},Symbol.toStringTag,{value:"Module"})),aa=class Ri extends HTMLElement{constructor(){if(super(),ye(this).template(Ri.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};aa.template=et`
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
  `;const Qe=class De extends HTMLElement{constructor(){super(),this._array=[],ye(this).template(De.template).styles(De.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ui("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,a=e.closest("label");if(a){const r=Array.from(this.children).indexOf(a);this._array[r]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Ie(t,"button.add")?oe(t,"input-array:add"):Ie(t,"button.remove")&&oe(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],oa(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Qe.template=et`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Qe.styles=di`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;let ra=Qe;function oa(n,t){t.replaceChildren(),n.forEach((e,s)=>t.append(Ui(e)))}function Ui(n,t){const e=n===void 0?et`<input />`:et`<input value="${n}" />`;return et`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}const la=Object.freeze(Object.defineProperty({__proto__:null,Element:ra},Symbol.toStringTag,{value:"Module"}));function lt(n){return Object.entries(n).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var ca=Object.defineProperty,da=Object.getOwnPropertyDescriptor,ha=(n,t,e,s)=>{for(var i=da(t,e),a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=r(t,e,i)||i);return i&&ca(t,e,i),i};class I extends gt{constructor(t){super(),this._pending=[],this._observer=new it(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}ha([ki()],I.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const re=globalThis,ts=re.ShadowRoot&&(re.ShadyCSS===void 0||re.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,es=Symbol(),qs=new WeakMap;let Mi=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==es)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ts&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=qs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&qs.set(e,t))}return t}toString(){return this.cssText}};const pa=n=>new Mi(typeof n=="string"?n:n+"",void 0,es),z=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((s,i,a)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[a+1],n[0]);return new Mi(e,n,es)},ua=(n,t)=>{if(ts)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=re.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},Fs=ts?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return pa(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:fa,defineProperty:ma,getOwnPropertyDescriptor:ga,getOwnPropertyNames:va,getOwnPropertySymbols:ba,getPrototypeOf:_a}=Object,J=globalThis,Xs=J.trustedTypes,ya=Xs?Xs.emptyScript:"",Ce=J.reactiveElementPolyfillSupport,Lt=(n,t)=>n,pe={toAttribute(n,t){switch(t){case Boolean:n=n?ya:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},ss=(n,t)=>!fa(n,t),Ys={attribute:!0,type:String,converter:pe,reflect:!1,useDefault:!1,hasChanged:ss};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),J.litPropertyMetadata??(J.litPropertyMetadata=new WeakMap);let mt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ys){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&ma(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:a}=ga(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:i,set(r){const o=i==null?void 0:i.call(this);a==null||a.call(this,r),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ys}static _$Ei(){if(this.hasOwnProperty(Lt("elementProperties")))return;const t=_a(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Lt("properties"))){const e=this.properties,s=[...va(e),...ba(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Fs(i))}else t!==void 0&&e.push(Fs(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ua(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var a;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const r=(((a=s.converter)==null?void 0:a.toAttribute)!==void 0?s.converter:pe).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){var a,r;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((a=o.converter)==null?void 0:a.fromAttribute)!==void 0?o.converter:pe;this._$Em=i,this[i]=l.fromAttribute(e,o.type)??((r=this._$Ej)==null?void 0:r.get(i))??null,this._$Em=null}}requestUpdate(t,e,s){var i;if(t!==void 0){const a=this.constructor,r=this[t];if(s??(s=a.getPropertyOptions(t)),!((s.hasChanged??ss)(r,e)||s.useDefault&&s.reflect&&r===((i=this._$Ej)==null?void 0:i.get(t))&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:a},r){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,r??e??this[t]),a!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[a,r]of i){const{wrapped:o}=r,l=this[a];o!==!0||this._$AL.has(a)||l===void 0||this.C(a,void 0,r,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var a;return(a=i.hostUpdate)==null?void 0:a.call(i)}),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};mt.elementStyles=[],mt.shadowRootOptions={mode:"open"},mt[Lt("elementProperties")]=new Map,mt[Lt("finalized")]=new Map,Ce==null||Ce({ReactiveElement:mt}),(J.reactiveElementVersions??(J.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Dt=globalThis,ue=Dt.trustedTypes,Bs=ue?ue.createPolicy("lit-html",{createHTML:n=>n}):void 0,ji="$lit$",W=`lit$${Math.random().toFixed(9).slice(2)}$`,Ii="?"+W,$a=`<${Ii}>`,at=document,Ft=()=>at.createComment(""),Xt=n=>n===null||typeof n!="object"&&typeof n!="function",is=Array.isArray,xa=n=>is(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",Pe=`[ 	
\f\r]`,Mt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ws=/-->/g,Js=/>/g,K=RegExp(`>|${Pe}(?:([^\\s"'>=/]+)(${Pe}*=${Pe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Vs=/'/g,Gs=/"/g,Ni=/^(?:script|style|textarea|title)$/i,wa=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),h=wa(1),xt=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),Zs=new WeakMap,tt=at.createTreeWalker(at,129);function Li(n,t){if(!is(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Bs!==void 0?Bs.createHTML(t):t}const ka=(n,t)=>{const e=n.length-1,s=[];let i,a=t===2?"<svg>":t===3?"<math>":"",r=Mt;for(let o=0;o<e;o++){const l=n[o];let u,m,p=-1,c=0;for(;c<l.length&&(r.lastIndex=c,m=r.exec(l),m!==null);)c=r.lastIndex,r===Mt?m[1]==="!--"?r=Ws:m[1]!==void 0?r=Js:m[2]!==void 0?(Ni.test(m[2])&&(i=RegExp("</"+m[2],"g")),r=K):m[3]!==void 0&&(r=K):r===K?m[0]===">"?(r=i??Mt,p=-1):m[1]===void 0?p=-2:(p=r.lastIndex-m[2].length,u=m[1],r=m[3]===void 0?K:m[3]==='"'?Gs:Vs):r===Gs||r===Vs?r=K:r===Ws||r===Js?r=Mt:(r=K,i=void 0);const d=r===K&&n[o+1].startsWith("/>")?" ":"";a+=r===Mt?l+$a:p>=0?(s.push(u),l.slice(0,p)+ji+l.slice(p)+W+d):l+W+(p===-2?o:d)}return[Li(n,a+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class Yt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let a=0,r=0;const o=t.length-1,l=this.parts,[u,m]=ka(t,e);if(this.el=Yt.createElement(u,s),tt.currentNode=this.el.content,e===2||e===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=tt.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(const p of i.getAttributeNames())if(p.endsWith(ji)){const c=m[r++],d=i.getAttribute(p).split(W),f=/([.?@])?(.*)/.exec(c);l.push({type:1,index:a,name:f[2],strings:d,ctor:f[1]==="."?Aa:f[1]==="?"?Ea:f[1]==="@"?za:xe}),i.removeAttribute(p)}else p.startsWith(W)&&(l.push({type:6,index:a}),i.removeAttribute(p));if(Ni.test(i.tagName)){const p=i.textContent.split(W),c=p.length-1;if(c>0){i.textContent=ue?ue.emptyScript:"";for(let d=0;d<c;d++)i.append(p[d],Ft()),tt.nextNode(),l.push({type:2,index:++a});i.append(p[c],Ft())}}}else if(i.nodeType===8)if(i.data===Ii)l.push({type:2,index:a});else{let p=-1;for(;(p=i.data.indexOf(W,p+1))!==-1;)l.push({type:7,index:a}),p+=W.length-1}a++}}static createElement(t,e){const s=at.createElement("template");return s.innerHTML=t,s}}function wt(n,t,e=n,s){var r,o;if(t===xt)return t;let i=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const a=Xt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==a&&((o=i==null?void 0:i._$AO)==null||o.call(i,!1),a===void 0?i=void 0:(i=new a(n),i._$AT(n,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=wt(n,i._$AS(n,t.values),i,s)),t}class Sa{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??at).importNode(e,!0);tt.currentNode=i;let a=tt.nextNode(),r=0,o=0,l=s[0];for(;l!==void 0;){if(r===l.index){let u;l.type===2?u=new te(a,a.nextSibling,this,t):l.type===1?u=new l.ctor(a,l.name,l.strings,this,t):l.type===6&&(u=new Ca(a,this,t)),this._$AV.push(u),l=s[++o]}r!==(l==null?void 0:l.index)&&(a=tt.nextNode(),r++)}return tt.currentNode=at,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class te{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=wt(this,t,e),Xt(t)?t===T||t==null||t===""?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==xt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):xa(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==T&&Xt(this._$AH)?this._$AA.nextSibling.data=t:this.T(at.createTextNode(t)),this._$AH=t}$(t){var a;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Yt.createElement(Li(s.h,s.h[0]),this.options)),s);if(((a=this._$AH)==null?void 0:a._$AD)===i)this._$AH.p(e);else{const r=new Sa(i,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(t){let e=Zs.get(t.strings);return e===void 0&&Zs.set(t.strings,e=new Yt(t)),e}k(t){is(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const a of t)i===e.length?e.push(s=new te(this.O(Ft()),this.O(Ft()),this,this.options)):s=e[i],s._$AI(a),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class xe{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,a){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=T}_$AI(t,e=this,s,i){const a=this.strings;let r=!1;if(a===void 0)t=wt(this,t,e,0),r=!Xt(t)||t!==this._$AH&&t!==xt,r&&(this._$AH=t);else{const o=t;let l,u;for(t=a[0],l=0;l<a.length-1;l++)u=wt(this,o[s+l],e,l),u===xt&&(u=this._$AH[l]),r||(r=!Xt(u)||u!==this._$AH[l]),u===T?t=T:t!==T&&(t+=(u??"")+a[l+1]),this._$AH[l]=u}r&&!i&&this.j(t)}j(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Aa extends xe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===T?void 0:t}}class Ea extends xe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==T)}}class za extends xe{constructor(t,e,s,i,a){super(t,e,s,i,a),this.type=5}_$AI(t,e=this){if((t=wt(this,t,e,0)??T)===xt)return;const s=this._$AH,i=t===T&&s!==T||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==T&&(s===T||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ca{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){wt(this,t)}}const Oe=Dt.litHtmlPolyfillSupport;Oe==null||Oe(Yt,te),(Dt.litHtmlVersions??(Dt.litHtmlVersions=[])).push("3.3.0");const Pa=(n,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const a=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new te(t.insertBefore(Ft(),a),a,void 0,e??{})}return i._$AI(n),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const st=globalThis;class q extends mt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Pa(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return xt}}var si;q._$litElement$=!0,q.finalized=!0,(si=st.litElementHydrateSupport)==null||si.call(st,{LitElement:q});const Te=st.litElementPolyfillSupport;Te==null||Te({LitElement:q});(st.litElementVersions??(st.litElementVersions=[])).push("4.2.0");const Oa={};function Ta(n,t,e){switch(n[0]){case"properties/save":Ra(n[1],e).then(i=>t(a=>({...a,property:i}))).then(()=>{const{onSuccess:i}=n[1];i&&i()}).catch(i=>{const{onFailure:a}=n[1];a&&a(i)});break;case"properties/select":Ua(n[1],e).then(i=>t(a=>({...a,property:i})));break;case"properties/":Ma(n[1],e).then(i=>t(a=>({...a,properties:i})));break;case"roles/save":ja(n[1],e).then(i=>t(a=>({...a,role:i})));break;case"roles/select":Ia(n[1],e).then(i=>t(a=>({...a,role:i})));break;case"roles/":Na(e).then(i=>t(a=>({...a,roles:i})));break;case"appointments/select":La(n[1],e).then(i=>t(a=>({...a,appointment:i})));break;case"appointments/":Ks(n[1],e).then(i=>t(a=>({...a,appointments:i})));break;case"appointments/select-unscheduled":Ks(n[1],e).then(i=>t(a=>({...a,unscheduled:i})));break;case"plans/select":ee(n[1],e).then(i=>t(a=>({...a,plan:i})));break;case"plans/":Da(n[1],e).then(i=>t(a=>({...a,plans:i})));break;case"plans/staff/add":Ha(n[1],e).then(i=>t(a=>({...a,plan:i})));break;case"plans/staff/remove":qa(n[1],e).then(i=>t(a=>({...a,plan:i})));break;case"plans/appointment/add":Fa(n[1],e).then(i=>t(a=>({...a,plan:i})));break;case"plans/appointment/remove":Xa(n[1],e).then(i=>t(a=>({...a,plan:i})));break;case"plans/build":Ya(n[1],e).then(i=>{t(a=>({...a,build_error:i}))});break;case"plans/copy":Ba(n[1],e).then(i=>{t(a=>({...a,build_error:i}))});break;case"plans/send":Wa(n[1],e).then(i=>{t(a=>({...a,build_error:i}))});break;case"plans/add":Ja(n[1],e).then(i=>{t(a=>({...a,build_error:i}))});break;case"staff/select":Va(n[1],e).then(i=>t(a=>({...a,staff_member:i})));break;case"staff/":Ga(n[1],e).then(i=>t(a=>({...a,staff:i})));break;case"staff/shifts":Za(n[1],e).then(i=>t(a=>({...a,shifts:i})));break;case"services/":Ka(e).then(i=>t(a=>({...a,services:i})));break;case"available/save":t(i=>({...i,available:n[1].available}));break;case"omissions/save":t(i=>({...i,omissions:n[1].omissions}));break;case"build_error/reset":t(i=>({...i,build_error:void 0}));break;default:const s=n[0];throw new Error(`Unhandled Auth message "${s}"`)}}function Ra(n,t){return fetch(`/api/properties/${n.properties_id}`,{method:"PUT",headers:{"Content-Type":"application/json",...A.headers(t)},body:JSON.stringify(n.property)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function Ua(n,t){return fetch(`/api/properties/${n.properties_id}`,{headers:A.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Property:",e),e})}function Ma(n,t){let e="/api/properties";if(n.filter_status_ids&&n.filter_status_ids.length>0){const s=n.filter_status_ids.map(i=>`filter_status_id=${i}`).join("&");e+=`?${s}`}return fetch(e,{headers:A.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Properties:",s),s})}function ja(n,t){return fetch(`/api/roles/${n.role_id}`,{method:"PUT",headers:{"Content-Type":"application/json",...A.headers(t)},body:JSON.stringify(n.role)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function Ia(n,t){return fetch(`/api/roles/${n.role_id}`,{headers:A.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Role:",e),e})}function Na(n){return fetch("/api/roles",{headers:A.headers(n)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Roles:",t),t})}function La(n,t){return fetch(`/api/appointments/${n.appointment_id}`,{headers:A.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Appointment:",e),e})}function Ks(n,t){let e=`/api/appointments?from_service_date=${n.from_service_date}&to_service_date=${n.to_service_date}`;if(n.per_page&&(e+=`&per_page=${n.per_page}`),n.page&&(e+=`&page=${n.page}`),n.show_unscheduled&&(e+=`&show_unscheduled=${n.show_unscheduled}`),n.filter_status_ids&&n.filter_status_ids.length>0){const s=n.filter_status_ids.map(i=>`filter_status_id=${i}`).join("&");e+=`&${s}`}if(n.filter_service_ids&&n.filter_service_ids.length>0){const s=n.filter_service_ids.map(i=>`filter_service_id=${i}`).join("&");e+=`&${s}`}return fetch(e,{headers:A.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Appointments:",s),s})}function ee(n,t){return fetch(`/api/plans/${n.plan_id}`,{headers:A.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Plan:",e),e})}function Da(n,t){let e=`/api/plans?from_plan_date=${n.from_plan_date}`;return n.to_plan_date&&(e+=`&to_plan_date=${n.to_plan_date}`),n.per_page&&(e+=`&per_page=${n.per_page}`),n.page&&(e+=`&page=${n.page}`),fetch(e,{headers:A.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Plans:",s),s})}function Ha(n,t){return fetch(`/api/plans/${n.plan_id}/staff/${n.user_id}`,{method:"POST",headers:A.headers(t)}).then(e=>{if(e.status===204)return ee(n,t)})}function qa(n,t){return fetch(`/api/plans/${n.plan_id}/staff/${n.user_id}`,{method:"DELETE",headers:A.headers(t)}).then(e=>{if(e.status===204)return ee(n,t)})}function Fa(n,t){return fetch(`/api/plans/${n.plan_id}/appointment/${n.appointment_id}`,{method:"POST",headers:A.headers(t)}).then(e=>{if(e.status===204)return ee(n,t)})}function Xa(n,t){return fetch(`/api/plans/${n.plan_id}/appointment/${n.appointment_id}`,{method:"DELETE",headers:A.headers(t)}).then(e=>{if(e.status===204)return ee(n,t)})}function Ya(n,t){return fetch(`/api/plans/build/${n.plan_date}`,{method:"POST",headers:{"Content-Type":"application/json",...A.headers(t)},body:JSON.stringify(n.build_options)}).then(e=>{if(e.status===400)return e.json()}).then(e=>{if(e){const s=e;return s.details?s:void 0}})}function Ba(n,t){return fetch(`/api/plans/copy/${n.plan_date}`,{method:"POST",headers:A.headers(t)}).then(e=>{if(e.status===400)return e.json()}).then(e=>{if(e){const s=e;return s.details?s:void 0}})}function Wa(n,t){return fetch(`/api/plans/send/${n.plan_date}`,{method:"POST",headers:A.headers(t)}).then(e=>{if(e.status===400)return e.json()}).then(e=>{if(e){const s=e;return s.details?s:void 0}})}function Ja(n,t){return fetch(`/api/plans/add/${n.plan_date}`,{method:"POST",headers:A.headers(t)}).then(e=>{if(e.status===400)return e.json()}).then(e=>{if(e){const s=e;return s.details?s:void 0}})}function Va(n,t){return fetch(`/api/staff/${n.user_id}`,{headers:A.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Staff Member:",e),e})}function Ga(n,t){let e="/api/staff";if(n.filter_status_ids&&n.filter_status_ids.length>0){const s=n.filter_status_ids.map(i=>`filter_status_id=${i}`).join("&");e+=`?${s}`,n.filter_can_clean&&(e+="&filter_can_clean=true")}else n.filter_can_clean&&(e+="?filter_can_clean=true");return fetch(e,{headers:A.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Staff:",s),s})}function Za(n,t){let e=`/api/staff/shifts?from_shift_date=${n.from_shift_date}`;return n.to_shift_date&&(e+=`&to_shift_date=${n.to_shift_date}`),fetch(e,{headers:A.headers(t)}).then(s=>{if(s.status===200)return s.json()}).then(s=>{if(s)return console.log("Shifts:",s),s})}function Ka(n){return fetch("/api/services",{headers:A.headers(n)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Services:",t),t})}class It extends Error{}It.prototype.name="InvalidTokenError";function Qa(n){return decodeURIComponent(atob(n).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function tr(n){let t=n.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Qa(t)}catch{return atob(t)}}function er(n,t){if(typeof n!="string")throw new It("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=n.split(".")[e];if(typeof s!="string")throw new It(`Invalid token specified: missing part #${e+1}`);let i;try{i=tr(s)}catch(a){throw new It(`Invalid token specified: invalid base64 for part #${e+1} (${a.message})`)}try{return JSON.parse(i)}catch(a){throw new It(`Invalid token specified: invalid json for part #${e+1} (${a.message})`)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const sr={attribute:!0,type:String,converter:pe,reflect:!1,hasChanged:ss},ir=(n=sr,t,e)=>{const{kind:s,metadata:i}=e;let a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),s==="setter"&&((n=Object.create(n)).wrapped=!0),a.set(e.name,n),s==="accessor"){const{name:r}=e;return{set(o){const l=t.get.call(this);t.set.call(this,o),this.requestUpdate(r,l,n)},init(o){return o!==void 0&&this.C(r,void 0,n,o),o}}}if(s==="setter"){const{name:r}=e;return function(o){const l=this[r];t.call(this,o),this.requestUpdate(r,l,n)}}throw Error("Unsupported decorator location: "+s)};function P(n){return(t,e)=>typeof e=="object"?ir(n,t,e):((s,i,a)=>{const r=i.hasOwnProperty(a);return i.constructor.createProperty(a,s),r?Object.getOwnPropertyDescriptor(i,a):void 0})(n,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function v(n){return P({...n,state:!0,attribute:!1})}var nr=Object.defineProperty,Di=(n,t,e,s)=>{for(var i=void 0,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=r(t,e,i)||i);return i&&nr(t,e,i),i};const cs=class cs extends q{constructor(){super(...arguments),this.display_name="Status: 401",this.curr_href=window.location.href,this._authObserver=new it(this,"acorn:auth"),this._historyObserver=new it(this,"acorn:history")}displayNameTemplate(){return this.display_name==="Status: 401"||this.display_name==="Status: 403"?h`
                <box-icon name='user-circle' type='solid' color="var(--accent-color-red)" size="var(--icon-size)" ></box-icon>
                <span>Please <a href="/login.html?next=${this.curr_href}" style="color: var(--text-color-link);" @click=${Qs}>login</a></span>
            `:this.display_name===""?h`
                <box-icon name='user-circle' type='solid' color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
                <span>Hello, user</span>
            `:h`
                <box-icon name='user-circle' type='solid' color="var(--text-color-header)" size="var(--icon-size)" ></box-icon>
                <span>${this.display_name}</span>
            `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{const e=t;if(e&&e.token){const s=er(e.token);s&&(s.exp&&s.exp<Math.round(Date.now()/1e3)||s.role&&s.role==="anon"?this.display_name="Status: 403":this.display_name=s.user_metadata.display_name||"")}}),this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this.curr_href=t.href)})}toggleDarkMode(t){this.classList.toggle("dark-mode"),Zt.relay(t,"dark-mode:toggle",{})}toggleActive(){this.classList.toggle("active")}render(){return h`
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
                    <a href="/login.html?next=${this.curr_href}" @click=${Qs}>
                        <box-icon name='log-out' color="var(--text-color-header)" size="var(--icon-size)"></box-icon>
                        <span class="nav-item">Logout</span>
                    </a>
                    <span class="tooltip">Logout</span>
                </li>
            </ul>
        </nav>
    `}};cs.styles=z`
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
  `;let Bt=cs;Di([P({attribute:!1})],Bt.prototype,"display_name");Di([P()],Bt.prototype,"curr_href");function Qs(n){Zt.relay(n,"auth:message",["auth/signout"])}lt({"restful-form":Je.FormElement});class ar extends q{render(){return h`
      <restful-form new src="/auth/login">
        <slot></slot>
      </restful-form>
    `}get next(){return new URLSearchParams(document.location.search).get("next")}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:s}={token:e.created.session.access_token},i=this.next||"/";console.log("Login successful",e,i),Zt.relay(t,"auth:message",["auth/signin",{token:s,redirect:i}])})}}lt({"restful-form":Je.FormElement});class rr extends q{render(){return h`
      <restful-form new src="/auth/signup">
        <slot></slot>
      </restful-form>
    `}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:s}={token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxa2NneGZhcWhwcXJ5dGNpeHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAyNzU3ODQsImV4cCI6MjAyNTg1MTc4NH0.f2OUbu37RF-NMV1iSj16rBOgmcarmjnntUMNGLZm7Xc"},i="/";console.log("Signup successful",e,i),Zt.relay(t,"auth:message",["auth/signin",{token:s,redirect:i}])})}}const R=z`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
img {
  max-width: 100%;
}
`,U=z`
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

.bubble-container {
    position: relative;
    align-self: end;
    max-width: var(--text-font-size-large);
    max-height: var(--text-font-size-large);
}

.in-bubble {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    max-width: var(--text-font-size-large);
    max-height: var(--text-font-size-large);
    display: flex;
    align-items: center; /** Y-axis align **/
    justify-content: center; /** X-axis align **/
    font-size: var(--text-font-size-small);
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

.center {
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
`;var Re={exports:{}},ti;function or(){return ti||(ti=1,function(n,t){(function(e,s,i,a,r){if("customElements"in i)r();else{if(i.AWAITING_WEB_COMPONENTS_POLYFILL)return void i.AWAITING_WEB_COMPONENTS_POLYFILL.then(r);var o=i.AWAITING_WEB_COMPONENTS_POLYFILL=m();o.then(r);var l=i.WEB_COMPONENTS_POLYFILL||"//cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.0.2/webcomponents-bundle.js",u=i.ES6_CORE_POLYFILL||"//cdnjs.cloudflare.com/ajax/libs/core-js/2.5.3/core.min.js";"Promise"in i?p(l).then(function(){o.isDone=!0,o.exec()}):p(u).then(function(){p(l).then(function(){o.isDone=!0,o.exec()})})}function m(){var c=[];return c.isDone=!1,c.exec=function(){c.splice(0).forEach(function(d){d()})},c.then=function(d){return c.isDone?d():c.push(d),c},c}function p(c){var d=m(),f=a.createElement("script");return f.type="text/javascript",f.readyState?f.onreadystatechange=function(){f.readyState!="loaded"&&f.readyState!="complete"||(f.onreadystatechange=null,d.isDone=!0,d.exec())}:f.onload=function(){d.isDone=!0,d.exec()},f.src=c,a.getElementsByTagName("head")[0].appendChild(f),f.then=d.then,f}})(0,0,window,document,function(){var e;e=function(){return function(s){var i={};function a(r){if(i[r])return i[r].exports;var o=i[r]={i:r,l:!1,exports:{}};return s[r].call(o.exports,o,o.exports,a),o.l=!0,o.exports}return a.m=s,a.c=i,a.d=function(r,o,l){a.o(r,o)||Object.defineProperty(r,o,{enumerable:!0,get:l})},a.r=function(r){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},a.t=function(r,o){if(1&o&&(r=a(r)),8&o||4&o&&typeof r=="object"&&r&&r.__esModule)return r;var l=Object.create(null);if(a.r(l),Object.defineProperty(l,"default",{enumerable:!0,value:r}),2&o&&typeof r!="string")for(var u in r)a.d(l,u,(function(m){return r[m]}).bind(null,u));return l},a.n=function(r){var o=r&&r.__esModule?function(){return r.default}:function(){return r};return a.d(o,"a",o),o},a.o=function(r,o){return Object.prototype.hasOwnProperty.call(r,o)},a.p="",a(a.s=5)}([function(s,i){s.exports=function(a){var r=[];return r.toString=function(){return this.map(function(o){var l=function(u,m){var p,c=u[1]||"",d=u[3];if(!d)return c;if(m&&typeof btoa=="function"){var f=(p=d,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(p))))+" */"),b=d.sources.map(function(_){return"/*# sourceURL="+d.sourceRoot+_+" */"});return[c].concat(b).concat([f]).join(`
`)}return[c].join(`
`)}(o,a);return o[2]?"@media "+o[2]+"{"+l+"}":l}).join("")},r.i=function(o,l){typeof o=="string"&&(o=[[null,o,""]]);for(var u={},m=0;m<this.length;m++){var p=this[m][0];typeof p=="number"&&(u[p]=!0)}for(m=0;m<o.length;m++){var c=o[m];typeof c[0]=="number"&&u[c[0]]||(l&&!c[2]?c[2]=l:l&&(c[2]="("+c[2]+") and ("+l+")"),r.push(c))}},r}},function(s,i,a){var r=a(3);s.exports=typeof r=="string"?r:r.toString()},function(s,i,a){var r=a(4);s.exports=typeof r=="string"?r:r.toString()},function(s,i,a){(s.exports=a(0)(!1)).push([s.i,"@-webkit-keyframes spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@keyframes spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@-webkit-keyframes burst{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}90%{-webkit-transform:scale(1.5);transform:scale(1.5);opacity:0}}@keyframes burst{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}90%{-webkit-transform:scale(1.5);transform:scale(1.5);opacity:0}}@-webkit-keyframes flashing{0%{opacity:1}45%{opacity:0}90%{opacity:1}}@keyframes flashing{0%{opacity:1}45%{opacity:0}90%{opacity:1}}@-webkit-keyframes fade-left{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(-20px);transform:translateX(-20px);opacity:0}}@keyframes fade-left{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(-20px);transform:translateX(-20px);opacity:0}}@-webkit-keyframes fade-right{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(20px);transform:translateX(20px);opacity:0}}@keyframes fade-right{0%{-webkit-transform:translateX(0);transform:translateX(0);opacity:1}75%{-webkit-transform:translateX(20px);transform:translateX(20px);opacity:0}}@-webkit-keyframes fade-up{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(-20px);transform:translateY(-20px);opacity:0}}@keyframes fade-up{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(-20px);transform:translateY(-20px);opacity:0}}@-webkit-keyframes fade-down{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(20px);transform:translateY(20px);opacity:0}}@keyframes fade-down{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}75%{-webkit-transform:translateY(20px);transform:translateY(20px);opacity:0}}@-webkit-keyframes tada{0%{-webkit-transform:scaleX(1);transform:scaleX(1)}10%,20%{-webkit-transform:scale3d(.95,.95,.95) rotate(-10deg);transform:scale3d(.95,.95,.95) rotate(-10deg)}30%,50%,70%,90%{-webkit-transform:scaleX(1) rotate(10deg);transform:scaleX(1) rotate(10deg)}40%,60%,80%{-webkit-transform:scaleX(1) rotate(-10deg);transform:scaleX(1) rotate(-10deg)}to{-webkit-transform:scaleX(1);transform:scaleX(1)}}@keyframes tada{0%{-webkit-transform:scaleX(1);transform:scaleX(1)}10%,20%{-webkit-transform:scale3d(.95,.95,.95) rotate(-10deg);transform:scale3d(.95,.95,.95) rotate(-10deg)}30%,50%,70%,90%{-webkit-transform:scaleX(1) rotate(10deg);transform:scaleX(1) rotate(10deg)}40%,60%,80%{-webkit-transform:rotate(-10deg);transform:rotate(-10deg)}to{-webkit-transform:scaleX(1);transform:scaleX(1)}}.bx-spin,.bx-spin-hover:hover{-webkit-animation:spin 2s linear infinite;animation:spin 2s linear infinite}.bx-tada,.bx-tada-hover:hover{-webkit-animation:tada 1.5s ease infinite;animation:tada 1.5s ease infinite}.bx-flashing,.bx-flashing-hover:hover{-webkit-animation:flashing 1.5s infinite linear;animation:flashing 1.5s infinite linear}.bx-burst,.bx-burst-hover:hover{-webkit-animation:burst 1.5s infinite linear;animation:burst 1.5s infinite linear}.bx-fade-up,.bx-fade-up-hover:hover{-webkit-animation:fade-up 1.5s infinite linear;animation:fade-up 1.5s infinite linear}.bx-fade-down,.bx-fade-down-hover:hover{-webkit-animation:fade-down 1.5s infinite linear;animation:fade-down 1.5s infinite linear}.bx-fade-left,.bx-fade-left-hover:hover{-webkit-animation:fade-left 1.5s infinite linear;animation:fade-left 1.5s infinite linear}.bx-fade-right,.bx-fade-right-hover:hover{-webkit-animation:fade-right 1.5s infinite linear;animation:fade-right 1.5s infinite linear}",""])},function(s,i,a){(s.exports=a(0)(!1)).push([s.i,'.bx-rotate-90{transform:rotate(90deg);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)"}.bx-rotate-180{transform:rotate(180deg);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)"}.bx-rotate-270{transform:rotate(270deg);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)"}.bx-flip-horizontal{transform:scaleX(-1);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)"}.bx-flip-vertical{transform:scaleY(-1);-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)"}',""])},function(s,i,a){a.r(i),a.d(i,"BoxIconElement",function(){return Ot});var r,o,l,u,m=a(1),p=a.n(m),c=a(2),d=a.n(c),f=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(S){return typeof S}:function(S){return S&&typeof Symbol=="function"&&S.constructor===Symbol&&S!==Symbol.prototype?"symbol":typeof S},b=function(){function S(E,g){for(var y=0;y<g.length;y++){var $=g[y];$.enumerable=$.enumerable||!1,$.configurable=!0,"value"in $&&($.writable=!0),Object.defineProperty(E,$.key,$)}}return function(E,g,y){return g&&S(E.prototype,g),y&&S(E,y),E}}(),_=(o=(r=Object).getPrototypeOf||function(S){return S.__proto__},l=r.setPrototypeOf||function(S,E){return S.__proto__=E,S},u=(typeof Reflect>"u"?"undefined":f(Reflect))==="object"?Reflect.construct:function(S,E,g){var y,$=[null];return $.push.apply($,E),y=S.bind.apply(S,$),l(new y,g.prototype)},function(S){var E=o(S);return l(S,l(function(){return u(E,arguments,o(this).constructor)},E))}),k=window,G={},M=document.createElement("template"),ct=function(){return!!k.ShadyCSS};M.innerHTML=`
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
`+p.a+`
`+d.a+`
</style>
<div id="icon"></div>`;var Ot=_(function(S){function E(){(function(y,$){if(!(y instanceof $))throw new TypeError("Cannot call a class as a function")})(this,E);var g=function(y,$){if(!y)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!$||typeof $!="object"&&typeof $!="function"?y:$}(this,(E.__proto__||Object.getPrototypeOf(E)).call(this));return g.$ui=g.attachShadow({mode:"open"}),g.$ui.appendChild(g.ownerDocument.importNode(M.content,!0)),ct()&&k.ShadyCSS.styleElement(g),g._state={$iconHolder:g.$ui.getElementById("icon"),type:g.getAttribute("type")},g}return function(g,y){if(typeof y!="function"&&y!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof y);g.prototype=Object.create(y&&y.prototype,{constructor:{value:g,enumerable:!1,writable:!0,configurable:!0}}),y&&(Object.setPrototypeOf?Object.setPrototypeOf(g,y):g.__proto__=y)}(E,HTMLElement),b(E,null,[{key:"getIconSvg",value:function(g,y){var $=this.cdnUrl+"/regular/bx-"+g+".svg";return y==="solid"?$=this.cdnUrl+"/solid/bxs-"+g+".svg":y==="logo"&&($=this.cdnUrl+"/logos/bxl-"+g+".svg"),$&&G[$]||(G[$]=new Promise(function(N,L){var F=new XMLHttpRequest;F.addEventListener("load",function(){this.status<200||this.status>=300?L(new Error(this.status+" "+this.responseText)):N(this.responseText)}),F.onerror=L,F.onabort=L,F.open("GET",$),F.send()})),G[$]}},{key:"define",value:function(g){g=g||this.tagName,ct()&&k.ShadyCSS.prepareTemplate(M,g),customElements.define(g,this)}},{key:"cdnUrl",get:function(){return"//unpkg.com/boxicons@2.1.4/svg"}},{key:"tagName",get:function(){return"box-icon"}},{key:"observedAttributes",get:function(){return["type","name","color","size","rotate","flip","animation","border","pull"]}}]),b(E,[{key:"attributeChangedCallback",value:function(g,y,$){var N=this._state.$iconHolder;switch(g){case"type":(function(L,F,w){var x=L._state;x.$iconHolder.textContent="",x.type&&(x.type=null),x.type=!w||w!=="solid"&&w!=="logo"?"regular":w,x.currentName!==void 0&&L.constructor.getIconSvg(x.currentName,x.type).then(function(C){x.type===w&&(x.$iconHolder.innerHTML=C)}).catch(function(C){console.error("Failed to load icon: "+x.currentName+`
`+C)})})(this,0,$);break;case"name":(function(L,F,w){var x=L._state;x.currentName=w,x.$iconHolder.textContent="",w&&x.type!==void 0&&L.constructor.getIconSvg(w,x.type).then(function(C){x.currentName===w&&(x.$iconHolder.innerHTML=C)}).catch(function(C){console.error("Failed to load icon: "+w+`
`+C)})})(this,0,$);break;case"color":N.style.fill=$||"";break;case"size":(function(L,F,w){var x=L._state;x.size&&(x.$iconHolder.style.width=x.$iconHolder.style.height="",x.size=x.sizeType=null),w&&!/^(xs|sm|md|lg)$/.test(x.size)&&(x.size=w.trim(),x.$iconHolder.style.width=x.$iconHolder.style.height=x.size)})(this,0,$);break;case"rotate":y&&N.classList.remove("bx-rotate-"+y),$&&N.classList.add("bx-rotate-"+$);break;case"flip":y&&N.classList.remove("bx-flip-"+y),$&&N.classList.add("bx-flip-"+$);break;case"animation":y&&N.classList.remove("bx-"+y),$&&N.classList.add("bx-"+$)}}},{key:"connectedCallback",value:function(){ct()&&k.ShadyCSS.styleElement(this)}}]),E}());i.default=Ot,Ot.define()}])},n.exports=e()})}(Re)),Re.exports}or();const ds=class ds extends I{constructor(){super("acorn:model")}render(){return h`
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
                    <a href="/login.html?next=/app/appointments" @click=${Ue}>
                        <box-icon name='log-in' color="var(--text-color-body)" ></box-icon>
                        <span>Login</span>
                    </a>
                </nav>
                <section>
                    <h4>
                        Returning user?
                    </h4>
                    <p>
                        Feel free to <a href="/login.html?next=/app/appointments" @click=${Ue}>login</a>
                    </p>
                </section>
                <section>
                    <h4>
                        New to AcornArranger?
                    </h4>
                    <p>
                        If you are new here, please <a href="/login.html?next=/app/appointments" @click=${Ue}>create an account</a> and request access from your administrator.
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
    `}};ds.styles=[R,U,z`
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
        `];let He=ds;function Ue(n){Zt.relay(n,"auth:message",["auth/signout"])}var lr=Object.defineProperty,cr=Object.getOwnPropertyDescriptor,ns=(n,t,e,s)=>{for(var i=s>1?void 0:s?cr(t,e):t,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=(s?r(t,e,i):r(i))||i);return s&&i&&lr(t,e,i),i};const dr=[{id:1,label:"Active"},{id:2,label:"Inactive"},{id:3,label:"Unverified"}],hs=class hs extends I{constructor(){super("acorn:model"),this.filter_status_ids=[1,3]}get staff(){return this.model.staff}get showing_total(){return this.staff?this.staff.length:0}connectedCallback(){super.connectedCallback(),this.updateStaff()}updateStaff(){this.dispatchMessage(["staff/",{filter_status_ids:this.filter_status_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateStaff()}handleInputChange(t){const e=t.target,{name:s,value:i,type:a}=e;a==="checkbox"?this.handleCheckboxChange(t):this[s]=i}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,a=parseInt(e.value);switch(i){case"staff_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,a]:this.filter_status_ids=this.filter_status_ids.filter(o=>o!==a);break;default:const r=i;throw new Error(`Unhandled Auth message "${r}"`)}}render(){const t=(i,a)=>{var r;switch(a){case"staff_status":r=this.filter_status_ids;break;default:const o=a;throw new Error(`Unhandled Auth message "${o}"`)}return h`
            <label>
            <input
                name=${a}
                type="checkbox"
                .value=${i.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${r.includes(i.id)}
            />
            ${i.label}
            </label>
        `},e=i=>{var a,r;return h`
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
                    ${(a=i.role)==null?void 0:a.title}
                    </span>
                </td>
                <td class="center">
                    <span>
                    ${(r=i.status)==null?void 0:r.status}
                    </span>
                </td>
            </tr>
        `},s=this.staff||[];return h`
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
                            ${dr.map(i=>t(i,"staff_status"))}
                        </div>
                    </div>
                </menu>
                <section class="showing">
                    <div>
                        <p>Showing: </p>
                        <div class="bubble-container">
                            <box-icon name='circle' type='solid' color="var(--accent-color)" size="var(--text-font-size-large)"></box-icon>
                            <p class="in-bubble">${this.showing_total}</p>
                        </div>
                    </div>
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
    `}};hs.styles=[R,U,z`
            
        `];let kt=hs;ns([v()],kt.prototype,"staff",1);ns([v()],kt.prototype,"showing_total",1);ns([v()],kt.prototype,"filter_status_ids",2);function ei(n){const t=new Date(n),e={month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0,timeZone:"UTC"};return new Intl.DateTimeFormat("en-US",e).format(t)}function hr(n){const t=new Date(n),e={month:"2-digit",day:"2-digit",year:"numeric",timeZone:"UTC"};return new Intl.DateTimeFormat("en-US",e).format(t)}function qe(n){var t=a=>("0"+a).slice(-2),e=a=>("00"+a).slice(-3),s=n.getTimezoneOffset(),i=s>0?"-":"+";return s=Math.abs(s),n.getFullYear()+"-"+t(n.getMonth()+1)+"-"+t(n.getDate())+"T"+t(n.getHours())+":"+t(n.getMinutes())+":"+t(n.getSeconds())+"."+e(n.getMilliseconds())+i+t(s/60|0)+":"+t(s%60)}var pr=Object.defineProperty,ur=Object.getOwnPropertyDescriptor,X=(n,t,e,s)=>{for(var i=s>1?void 0:s?ur(t,e):t,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=(s?r(t,e,i):r(i))||i);return s&&i&&pr(t,e,i),i};const fr=[{id:1,label:"Unconfirmed"},{id:2,label:"Confirmed"},{id:3,label:"Completed"},{id:4,label:"Completed (Invoiced)"},{id:5,label:"Cancelled"}],ps=class ps extends I{constructor(){super("acorn:model"),this.from_service_date=qe(new Date).split("T")[0],this.to_service_date=qe(new Date).split("T")[0],this.per_page=50,this.page=1,this.filter_status_ids=[1,2,3,4],this.filter_service_ids=[21942,23044]}get appointments(){return this.model.appointments}get services(){return this.model.services}get showing_total(){return this.appointments?this.appointments.length:0}get service_options(){return this.services?this.services.map(t=>({id:t.service_id,label:t.service_name})):[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["services/",{}]),this.updateAppointments()}updateAppointments(){const t=new Date(this.from_service_date),e=new Date(this.to_service_date);t>e&&(this.to_service_date=this.from_service_date),this.dispatchMessage(["appointments/",{from_service_date:this.from_service_date,to_service_date:this.to_service_date,per_page:this.per_page,page:this.page-1,filter_status_ids:this.filter_status_ids,filter_service_ids:this.filter_service_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateAppointments()}handleInputChange(t){const e=t.target,{name:s,value:i,type:a}=e;a==="checkbox"?this.handleCheckboxChange(t):this[s]=i}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,a=parseInt(e.value);switch(i){case"app_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,a]:this.filter_status_ids=this.filter_status_ids.filter(o=>o!==a);break;case"app_service":e.checked?this.filter_service_ids=[...this.filter_service_ids,a]:this.filter_service_ids=this.filter_service_ids.filter(o=>o!==a);break;default:const r=i;throw new Error(`Unhandled Auth message "${r}"`)}}previousPage(){this.page>1&&(this.page--,this.updateAppointments())}nextPage(){this.page++,this.updateAppointments()}render(){const t=(a,r)=>{var o;switch(r){case"app_status":o=this.filter_status_ids;break;case"app_service":o=this.filter_service_ids;break;default:const l=r;throw new Error(`Unhandled Auth message "${l}"`)}return h`
            <label>
            <input
                name=${r}
                type="checkbox"
                .value=${a.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${o.includes(a.id)}
            />
            ${a.label}
            </label>
        `},e=a=>h`
            <li>
                <span>${a.name}</span>
            </li>
        `,s=a=>{var r,o;return h`
            <tr>
                <td class="center">
                    <span>
                    ${a.appointment_id}
                    </span>
                </td>
                <td>
                    <span>
                    ${ei(a.service_time)}
                    </span>
                </td>
                <td>
                    <span>
                    ${a.property_info.property_name}
                    </span>
                </td>
                <td class="center">
                    <ul class="staff">
                        ${a.staff&&a.staff.length>0?(r=a.staff)==null?void 0:r.map(l=>e(l.staff_info)):h`<box-icon name='error' color="var(--accent-color-red)"></box-icon>`}
                    </ul>
                </td>
                <td class="center">
                    <span>
                        ${a.turn_around?h`<box-icon name='revision' color="var(--text-color-body)" ></box-icon>`:h``}
                    </span>
                </td>
                <td>
                    <span>
                    ${ei(a.next_arrival_time)}
                    </span>
                </td>
                <td>
                    <span>
                    ${a.service.service_name}
                    </span>
                </td>
                <td>
                    <span>
                    ${(o=a.status)==null?void 0:o.status}
                    </span>
                </td>
            </tr>
        `},i=this.appointments||[];return h`
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
                            ${fr.map(a=>t(a,"app_status"))}
                        </div>
                    </div>
                    <div>
                        <span>Services:</span>
                        <div class="filters">
                            ${this.service_options.map(a=>t(a,"app_service"))}
                        </div>
                    </div>
                </menu>
                <section class="showing">
                    <div>
                        <p>Showing: </p>
                        <div class="bubble-container">
                            <box-icon name='circle' type='solid' color="var(--accent-color)" size="var(--text-font-size-large)"></box-icon>
                            <p class="in-bubble">${this.showing_total}</p>
                        </div>
                    </div>
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
                    ${i.map(a=>s(a))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};ps.styles=[R,U,z`
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
        `];let D=ps;X([v()],D.prototype,"appointments",1);X([v()],D.prototype,"services",1);X([v()],D.prototype,"showing_total",1);X([v()],D.prototype,"service_options",1);X([v()],D.prototype,"from_service_date",2);X([v()],D.prototype,"to_service_date",2);X([v()],D.prototype,"per_page",2);X([v()],D.prototype,"page",2);X([v()],D.prototype,"filter_status_ids",2);X([v()],D.prototype,"filter_service_ids",2);var mr=Object.defineProperty,gr=Object.getOwnPropertyDescriptor,Hi=(n,t,e,s)=>{for(var i=gr(t,e),a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=r(t,e,i)||i);return i&&mr(t,e,i),i};const us=class us extends I{get roles(){return this.model.roles}get showing_total(){return this.roles?this.roles.length:0}constructor(){super("acorn:model")}connectedCallback(){super.connectedCallback(),this.updateRoles()}updateRoles(){this.dispatchMessage(["roles/",{}])}handleInputChange(t,e,s){const i=t.target;if(s==="priority")if(i.value)e[s]=parseInt(i.value);else return;else if(s==="can_lead_team"||s==="can_clean")e[s]=i.checked;else{if(s==="role_id")return;e[s]=i.value}this.dispatchMessage(["roles/save",{role_id:e.role_id,role:e}])}render(){const t=s=>h`
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
        `,e=this.roles||[];return h`
        <div class="page">
            <header>
                <h1>
                    Staff Roles
                </h1>
            </header>
            <main>
                <section class="showing">
                    <div>
                        <p>Showing: </p>
                        <div class="bubble-container">
                            <box-icon name='circle' type='solid' color="var(--accent-color)" size="var(--text-font-size-large)"></box-icon>
                            <p class="in-bubble">${this.showing_total}</p>
                        </div>
                    </div>
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
    `}};us.styles=[R,U,z`
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
        `];let Wt=us;Hi([v()],Wt.prototype,"roles");Hi([v()],Wt.prototype,"showing_total");var vr=Object.defineProperty,br=Object.getOwnPropertyDescriptor,as=(n,t,e,s)=>{for(var i=s>1?void 0:s?br(t,e):t,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=(s?r(t,e,i):r(i))||i);return s&&i&&vr(t,e,i),i};const _r=[{id:1,label:"Active"},{id:2,label:"Inactive"}];function yr(n){const t=Math.floor(n/60),e=n%60;return!t&&!n?h`<box-icon name='error' color="var(--accent-color-red)"></box-icon>`:t?e&&t===1?`${t} Hour ${e} Minutes`:e?`${t} Hours ${e} Minutes`:t===1?`${t} Hour`:`${t} Hours`:`${e} Minutes`}const fs=class fs extends I{constructor(){super("acorn:model"),this.filter_status_ids=[1]}get properties(){return this.model.properties}get showing_total(){return this.properties?this.properties.length:0}connectedCallback(){super.connectedCallback(),this.updateProperties()}updateProperties(){this.dispatchMessage(["properties/",{filter_status_ids:this.filter_status_ids}])}handleTableOptionChange(t){this.handleInputChange(t),this.updateProperties()}handleInputChange(t){const e=t.target,{name:s,value:i,type:a}=e;a==="checkbox"?this.handleCheckboxChange(t):this[s]=i}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,a=parseInt(e.value);switch(i){case"property_status":e.checked?this.filter_status_ids=[...this.filter_status_ids,a]:this.filter_status_ids=this.filter_status_ids.filter(o=>o!==a);break;default:const r=i;throw new Error(`Unhandled Auth message "${r}"`)}}render(){const t=(a,r)=>{var o;switch(r){case"property_status":o=this.filter_status_ids;break;default:const l=r;throw new Error(`Unhandled Auth message "${l}"`)}return h`
            <label>
            <input
                name=${r}
                type="checkbox"
                .value=${a.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${o.includes(a.id)}
            />
            ${a.label}
            </label>
        `},e=a=>h`
            <li>
                <span>${a}</span>
            </li>
        `,s=a=>{var r,o;return h`
            <tr>
                <td class="center">
                    <a href="/app/property/${a.properties_id}">
                        <span>
                        ${a.properties_id}
                        </span>
                    </a>
                </td>
                <td>
                    <span>
                    ${a.property_name}
                    </span>
                </td>
                <td>
                    <span>
                    ${yr(a.estimated_cleaning_mins)}
                    </span>
                </td>
                <td>
                    <ul>
                    ${(r=a.double_unit)==null?void 0:r.map(l=>e(l))}
                    </ul>
                </td>
                <td class="center">
                    <span>
                    ${(o=a.status)==null?void 0:o.status}
                    </span>
                </td>
                <td>
                    <a href="/app/property/${a.properties_id}/edit">
                        <box-icon name='edit-alt' type='solid' color="var(--text-color-body)" ></box-icon>
                    </a>
                </td>
            </tr>
        `},i=this.properties||[];return h`
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
                            ${_r.map(a=>t(a,"property_status"))}
                        </div>
                    </div>
                </menu>
                <section class="showing">
                    <div>
                        <p>Showing: </p>
                        <div class="bubble-container">
                            <box-icon name='circle' type='solid' color="var(--accent-color)" size="var(--text-font-size-large)"></box-icon>
                            <p class="in-bubble">${this.showing_total}</p>
                        </div>
                    </div>
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
                    ${i.map(a=>s(a))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};fs.styles=[R,U,z`
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
        `];let St=fs;as([v()],St.prototype,"properties",1);as([v()],St.prototype,"showing_total",1);as([v()],St.prototype,"filter_status_ids",2);var $r=Object.defineProperty,xr=Object.getOwnPropertyDescriptor,we=(n,t,e,s)=>{for(var i=s>1?void 0:s?xr(t,e):t,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=(s?r(t,e,i):r(i))||i);return s&&i&&$r(t,e,i),i};const ms=class ms extends I{constructor(){super("acorn:model"),this.staff_additions=[]}get staff(){return this.model.staff}get staff_options(){return this.staff&&this.plan&&this.plan.staff?this.staff.filter(t=>!this.plan.staff.map(e=>e.staff_info.user_id).includes(t.user_id)).map(t=>({id:t.user_id,label:t.name})):this.staff?this.staff.map(t=>({id:t.user_id,label:t.name})):[]}addPlanStaff(){this.plan&&this.staff_additions.length&&(this.staff_additions.map(t=>{this.dispatchMessage(["plans/staff/add",{plan_id:this.plan.plan_id,user_id:t}])}),this.requestPlanUpdate()),this.closeDialog(),this.staff_additions=[]}requestPlanUpdate(){const t=new CustomEvent("plan-view:update",{bubbles:!0,composed:!0,detail:{}});this.dispatchEvent(t)}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,a=parseInt(e.value);switch(i){case"staff_additions":e.checked?this.staff_additions=[...this.staff_additions,a]:this.staff_additions=this.staff_additions.filter(o=>o!==a);break;default:const r=i;throw new Error(`Unhandled Auth message "${r}"`)}}selectAll(){this.staff_additions=this.staff_options.map(t=>t.id)}clearSelection(){this.staff_additions=[]}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){var e,s;const t=(i,a)=>{var r;switch(a){case"staff_additions":r=this.staff_additions;break;default:const o=a;throw new Error(`Unhandled Auth message "${o}"`)}return h`
            <label>
            <input
                name=${a}
                type="checkbox"
                .value=${i.id.toString()}
                @change=${this.handleCheckboxChange}
                ?checked=${r.includes(i.id)}
            />
            ${i.label}
            </label>
        `};return h`
        <div class="add-one">
            <button @click=${this.showModal} ?disabled=${((e=this.plan)==null?void 0:e.appointments[0])&&((s=this.plan)==null?void 0:s.appointments[0].sent_to_rc)!==null}>
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
                <div class="spread-apart clear-select">
                    <button @click=${this.clearSelection}>Clear Selection</button>
                    <button @click=${this.selectAll}>Select All</button>
                </div>
                <div class="filters checkboxes">
                    ${this.staff_options.map(i=>t(i,"staff_additions"))}
                </div>
                <div>
                    <button @click=${this.addPlanStaff}>
                        <span>Confirm</span>
                    </button>
                </div>
            </div>
        </dialog>
    `}};ms.styles=[R,U,z`

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

            .checkboxes {
                max-height: calc(var(--text-font-size-large) * 20);
                min-width: calc(var(--text-font-size-large) * 12);
            }
        `];let rt=ms;we([v()],rt.prototype,"staff",1);we([P({attribute:!1})],rt.prototype,"plan",2);we([v()],rt.prototype,"staff_options",1);we([v()],rt.prototype,"staff_additions",2);var wr=Object.defineProperty,kr=Object.getOwnPropertyDescriptor,ke=(n,t,e,s)=>{for(var i=s>1?void 0:s?kr(t,e):t,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=(s?r(t,e,i):r(i))||i);return s&&i&&wr(t,e,i),i};const gs=class gs extends I{constructor(){super("acorn:model"),this.appointment_additions=[]}get appointments(){return this.model.appointments}get appointment_options(){return this.appointments&&this.plan&&this.plan.appointments?this.appointments.filter(t=>!this.plan.appointments.map(e=>e.appointment_info.appointment_id).includes(t.appointment_id)).map(t=>({id:t.appointment_id,label:t.property_info.property_name})):this.appointments?this.appointments.map(t=>({id:t.appointment_id,label:t.property_info.property_name})):[]}addPlanAppointments(){this.plan&&this.appointment_additions.length&&(this.appointment_additions.map(t=>{this.dispatchMessage(["plans/appointment/add",{plan_id:this.plan.plan_id,appointment_id:t}])}),this.requestPlanUpdate()),this.closeDialog(),this.appointment_additions=[]}requestPlanUpdate(){const t=new CustomEvent("plan-view:update",{bubbles:!0,composed:!0,detail:{}});this.dispatchEvent(t)}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,a=parseInt(e.value);switch(i){case"app_additions":e.checked?this.appointment_additions=[...this.appointment_additions,a]:this.appointment_additions=this.appointment_additions.filter(o=>o!==a);break;default:const r=i;throw new Error(`Unhandled Auth message "${r}"`)}}selectAll(){this.appointment_additions=this.appointment_options.map(t=>t.id)}clearSelection(){this.appointment_additions=[]}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){var e,s;const t=(i,a)=>{var r;switch(a){case"app_additions":r=this.appointment_additions;break;default:const o=a;throw new Error(`Unhandled Auth message "${o}"`)}return h`
            <label>
            <input
                name=${a}
                type="checkbox"
                .value=${i.id.toString()}
                @change=${this.handleCheckboxChange}
                ?checked=${r.includes(i.id)}
            />
            ${i.label}
            </label>
        `};return h`
        <div class="add-one">
            <button @click=${this.showModal} ?disabled=${((e=this.plan)==null?void 0:e.appointments[0])&&((s=this.plan)==null?void 0:s.appointments[0].sent_to_rc)!==null}>
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
                <div class="spread-apart clear-select">
                    <button @click=${this.clearSelection}>Clear Selection</button>
                    <button @click=${this.selectAll}>Select All</button>
                </div>
                <div class="filters checkboxes">
                    ${this.appointment_options.map(i=>t(i,"app_additions"))}
                </div>
                <div>
                    <button @click=${this.addPlanAppointments}>
                        <span>Confirm</span>
                    </button>
                </div>
            </div>
        </dialog>
    `}};gs.styles=[R,U,z`

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

            .checkboxes {
                max-height: calc(var(--text-font-size-large) * 20);
                min-width: calc(var(--text-font-size-large) * 12);
            }
        `];let ot=gs;ke([v()],ot.prototype,"appointments",1);ke([P({attribute:!1})],ot.prototype,"plan",2);ke([v()],ot.prototype,"appointment_options",1);ke([v()],ot.prototype,"appointment_additions",2);var Sr=Object.defineProperty,Ar=Object.getOwnPropertyDescriptor,rs=(n,t,e,s)=>{for(var i=s>1?void 0:s?Ar(t,e):t,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=(s?r(t,e,i):r(i))||i);return s&&i&&Sr(t,e,i),i};const ge=class ge extends I{get model_plan(){return this.model.plan}get other_appointment_ids(){var t;return((t=this.model.plans)==null?void 0:t.filter(e=>{var s;return e.plan_id!==((s=this.plan)==null?void 0:s.plan_id)}).flatMap(e=>e.appointments.map(s=>s.appointment_id)))??[]}constructor(){super("acorn:model")}updated(t){super.updated(t);var e=this.model_plan;e&&(!this.plan||e.plan_id===this.plan.plan_id)&&(this.plan=e)}handleStaffRemove(t){const e=t.target,{name:s}=e;s!==void 0&&(this.dispatchMessage(["plans/staff/remove",{plan_id:this.plan.plan_id,user_id:parseInt(s)}]),this.requestPlanUpdate())}handleAppointmentRemove(t){const e=t.target,{name:s}=e;s!==void 0&&(this.dispatchMessage(["plans/appointment/remove",{plan_id:this.plan.plan_id,appointment_id:parseInt(s)}]),this.requestPlanUpdate())}requestPlanUpdate(){const t=new CustomEvent("plan-view:update",{bubbles:!0,composed:!0,detail:{}});this.dispatchEvent(t)}render(){if(!this.plan)return h`<section><p>Loading...</p></section>`;const t=s=>{var i,a;return h`
            <li>
                <span>${s.name}</span>
                <button class="trash" name=${s.user_id} @click=${this.handleStaffRemove} ?disabled=${((i=this.plan)==null?void 0:i.appointments[0])&&((a=this.plan)==null?void 0:a.appointments[0].sent_to_rc)!==null}> 
                    <box-icon name='trash' size="var(--text-font-size-body)" color="var(--accent-color-red)"></box-icon>
                </button>
            </li>
        `},e=s=>{var i,a,r;return h`
            <li class="${(i=this.other_appointment_ids)!=null&&i.includes(s.appointment_id)?"duplicate":""}">
                <span>${s.property_info.property_name}</span>
                <button class="trash" name=${s.appointment_id} @click=${this.handleAppointmentRemove} ?disabled=${((a=this.plan)==null?void 0:a.appointments[0])&&((r=this.plan)==null?void 0:r.appointments[0].sent_to_rc)!==null}> 
                    <box-icon name='trash' size="var(--text-font-size-body)" color="var(--accent-color-red)"></box-icon>
                </button>
            </li>
        `};return h`
        <section>
            <div>
                <p>ID: ${this.plan.plan_id}</p>
                <p>${this.plan.appointments[0]&&this.plan.appointments[0].sent_to_rc!==null?h`<box-icon name='upload' color="var(--text-color-body)" size="var(--text-font-size-body)"></box-icon>`:h``}</p>
                <p>${hr(this.plan.plan_date)}</p>
            </div>
            <h4>Team ${this.plan.team}</h4>
            <h5>Staff</h5>
            <ul>
                ${this.plan.staff.map(s=>t(s.staff_info))}
                <add-staff-modal .plan=${this.plan}></add-staff-modal>
            </ul>
            <h5>Appointments</h5>
            <!-- show non-cancelled appointments in plan -->
            <ul> 
                ${this.plan.appointments.map(s=>s.appointment_info.status.status_id!==5?e(s.appointment_info):h``)}
                <add-appointment-modal .plan=${this.plan}></add-appointment-modal>
            </ul>
        </section>
    `}};ge.uses=lt({"add-staff-modal":rt,"add-appointment-modal":ot}),ge.styles=[R,U,z`
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

            .duplicate {
                border: 2px solid var(--accent-color);
            }
        `];let At=ge;rs([v()],At.prototype,"model_plan",1);rs([P({attribute:!1})],At.prototype,"plan",2);rs([v()],At.prototype,"other_appointment_ids",1);var Er=Object.defineProperty,zr=Object.getOwnPropertyDescriptor,os=(n,t,e,s)=>{for(var i=s>1?void 0:s?zr(t,e):t,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=(s?r(t,e,i):r(i))||i);return s&&i&&Er(t,e,i),i};const vs=class vs extends I{constructor(){super("acorn:model"),this.init_load=!0,this.available_staff=[]}get staff(){return this.init_load&&this.model.staff&&(this.init_load=!1,this.selectAll(),this.updateAvailable()),this.model.staff}get staff_options(){return this.staff?this.staff.map(t=>({id:t.user_id,label:t.name})):[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["staff/",{filter_status_ids:[1],filter_can_clean:!0}])}updateAvailable(){this.dispatchMessage(["available/save",{available:this.available_staff}])}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,a=parseInt(e.value);switch(i){case"available_staff":e.checked?this.available_staff=[...this.available_staff,a]:this.available_staff=this.available_staff.filter(o=>o!==a),this.updateAvailable();break;default:const r=i;throw new Error(`Unhandled Auth message "${r}"`)}}selectAll(){this.available_staff=this.staff.map(t=>t.user_id),this.updateAvailable()}clearSelection(){this.available_staff=[],this.updateAvailable()}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){const t=(i,a)=>{var r;switch(a){case"available_staff":r=this.available_staff;break;default:const o=a;throw new Error(`Unhandled Auth message "${o}"`)}return h`
            <label>
            <input
                name=${a}
                type="checkbox"
                .value=${i.id.toString()}
                @change=${this.handleCheckboxChange}
                ?checked=${r.includes(i.id)}
            />
            ${i.label}
            </label>
        `},e=i=>this.available_staff.includes(i.user_id)?h`
            <li>
                <span>${i.name}</span>
            </li>
        `:h``,s=this.staff||[];return h`
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
    `}};vs.styles=[R,U,z`

            .staff {
                max-width: calc(var(--text-font-size-large) * 36);
            }

            .checkboxes {
                max-height: calc(var(--text-font-size-large) * 19.5);
                min-width: calc(var(--text-font-size-large) * 10);
            }
        `];let Et=vs;os([v()],Et.prototype,"staff",1);os([v()],Et.prototype,"available_staff",2);os([v()],Et.prototype,"staff_options",1);var Cr=Object.defineProperty,Pr=Object.getOwnPropertyDescriptor,se=(n,t,e,s)=>{for(var i=s>1?void 0:s?Pr(t,e):t,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=(s?r(t,e,i):r(i))||i);return s&&i&&Cr(t,e,i),i};const bs=class bs extends I{constructor(){super("acorn:model"),this.appointment_omissions=[]}get appointments(){return this.model.appointments}get appointment_options(){return this.appointments&&this.date?this.appointments.map(t=>({id:t.appointment_id,label:t.property_info.property_name})):[]}connectedCallback(){super.connectedCallback()}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),(t==="date"||t==="services")&&e!==s&&s&&this.updateAppointments()}updateAppointments(){this.dispatchMessage(["appointments/",{from_service_date:this.date,to_service_date:this.date,per_page:100,page:0,filter_status_ids:[1,2],filter_service_ids:this.services}])}updateOmissions(){this.dispatchMessage(["omissions/save",{omissions:this.appointment_omissions}])}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,a=parseInt(e.value);switch(i){case"app_omissions":e.checked?this.appointment_omissions=[...this.appointment_omissions,a]:this.appointment_omissions=this.appointment_omissions.filter(o=>o!==a),this.updateOmissions();break;default:const r=i;throw new Error(`Unhandled Auth message "${r}"`)}}selectAll(){this.appointment_omissions=this.appointments.map(t=>t.appointment_id),this.updateOmissions}clearSelection(){this.appointment_omissions=[],this.updateOmissions}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){const t=(i,a)=>{var r;switch(a){case"app_omissions":r=this.appointment_omissions;break;default:const o=a;throw new Error(`Unhandled Auth message "${o}"`)}return h`
            <label>
            <input
                name=${a}
                type="checkbox"
                .value=${i.id.toString()}
                @change=${this.handleCheckboxChange}
                ?checked=${r.includes(i.id)}
            />
            ${i.label}
            </label>
        `},e=i=>this.appointment_omissions.includes(i.appointment_id)?h`
            <li>
                <span>${i.property_info.property_name}</span>
            </li>
        `:h``,s=this.appointments||[];return h`
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
    `}};bs.styles=[R,U,z`

            .appointments {
                max-width: calc(var(--spacing-size-medium) * 22);
            }

            .checkboxes {
                max-height: calc(var(--text-font-size-large) * 9.5);
                min-width: calc(var(--text-font-size-large) * 12);
            }
        `];let V=bs;se([P({attribute:!0,reflect:!0})],V.prototype,"services",2);se([P()],V.prototype,"date",2);se([v()],V.prototype,"appointments",1);se([v()],V.prototype,"appointment_omissions",2);se([v()],V.prototype,"appointment_options",1);var Or=Object.defineProperty,qi=(n,t,e,s)=>{for(var i=void 0,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=r(t,e,i)||i);return i&&Or(t,e,i),i};const _s=class _s extends q{attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="code"&&e&&e!==s&&s&&(s.split(":")[0]==="no-error"?e.split(":")[1]!==s.split(":")[1]&&this.requestPlanUpdate():this.show())}requestPlanUpdate(){const t=new CustomEvent("build-error-dialog:no-error",{bubbles:!0,composed:!0,detail:{}});this.dispatchEvent(t)}closeDialog(){this.shadowRoot.querySelector("dialog").close()}show(){this.shadowRoot.querySelector("dialog").show()}render(){const t=s=>s?h`
                <button @click=${this.show}>
                    <box-icon name='error-alt' type='solid' color="var(--accent-color-red)" size="var(--text-font-size-large)"></box-icon>
                </button>
            `:h`
                <button @click=${this.show} disabled>
                    <box-icon name='error-alt' color="var(--text-color-body)" size="var(--text-font-size-large)"></box-icon>
                </button>
            `,e=s=>s?h`
                <div class="spread-apart">
                    <h6>Code: ${s.code}</h6>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
                </div>
                <p>Error: ${s.details}</p>
                <P>Message: ${s.message}</P>
                <p>Hint: ${s.hint}</p>
            `:h``;return h`
        <div>
            ${t(this.error)}
        </div>
        <dialog class="error">
            <div class="dialog-content">
                ${e(this.error)}
            </div>
        </dialog>
    `}};_s.styles=[R,U,z`
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

        `];let Jt=_s;qi([P({attribute:!1})],Jt.prototype,"error");qi([P()],Jt.prototype,"code");var Tr=Object.defineProperty,Rr=(n,t,e,s)=>{for(var i=void 0,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=r(t,e,i)||i);return i&&Tr(t,e,i),i};const ys=class ys extends q{closeDialog(){this.shadowRoot.querySelector("dialog").close()}show(){console.log("Showing Info ***"),this.shadowRoot.querySelector("dialog").show()}render(){return h`
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
    `}};ys.styles=[R,U,z`
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

        `];let fe=ys;Rr([P()],fe.prototype,"name");var Ur=Object.defineProperty,Mr=Object.getOwnPropertyDescriptor,ls=(n,t,e,s)=>{for(var i=s>1?void 0:s?Mr(t,e):t,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=(s?r(t,e,i):r(i))||i);return s&&i&&Ur(t,e,i),i};const $s=class $s extends I{constructor(){super("acorn:model"),this.handleVisibilityChange=()=>{document.visibilityState==="visible"&&this.updateUnscheduled()}}get unscheduled(){var t;if(this.model.plans){const e=new Set(this.model.plans.flatMap(s=>s.appointments.map(i=>i.appointment_id)));return(t=this.model.unscheduled)==null?void 0:t.filter(s=>!e.has(s.appointment_id))}return this.model.unscheduled}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this.handleVisibilityChange)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this.handleVisibilityChange)}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="date"&&e!==s&&s&&this.updateUnscheduled()}updateUnscheduled(){this.dispatchMessage(["appointments/select-unscheduled",{from_service_date:this.date,to_service_date:this.date,per_page:100,page:0,filter_status_ids:[1,2],filter_service_ids:this.services,show_unscheduled:!0}])}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){const t=this.unscheduled||[];return h`
        <div>
            ${(s=>s.length?h`
                <button @click=${this.showModal}>
                    <div class="bubble-container">
                        <box-icon name='circle' type='solid' color="var(--accent-color-red)" size="var(--text-font-size-large)"></box-icon>
                        <p class="in-bubble">${s.length}</p>
                    </div>
                </button>
            `:h`
                <button @click=${this.showModal} disabled>
                    <box-icon name='error-circle' color="var(--text-color-body)" size="var(--text-font-size-large)"></box-icon>
                </button>
            `)(t)}
        </div>
        <dialog class="modal">
            <div class="modal-content">
                <div class="spread-apart modal-header">
                    <h4>Unscheduled Appointments</h4>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
                </div>
                <div class="spread-apart list-segment">
                    <h5>Confirmed but unscheduled:</h5>
                    <ul class="unscheduled">
                    ${t.map(s=>s.status.status_id===2?h`
                        <li>
                            <span>${s.property_info.property_name}</span>
                        </li>
                    `:h``)}
                    </ul>
                    <h5>Unconfirmed:</h5>
                    <ul class="unscheduled">
                    ${t.map(s=>s.status.status_id===1?h`
                        <li>
                            <span>${s.property_info.property_name}</span>
                        </li>
                    `:h``)}
                    </ul>
                </div>
            </div>
        </dialog>
    `}};$s.styles=[R,U,z`

            button[disabled]:hover {
                background-color: var(--background-color-accent);
            }

            ul.unscheduled {
                list-style-type: none;
                padding-top: var(--spacing-size-small);
                padding-bottom: var(--spacing-size-small);
            }

            ul.unscheduled li {
                width: max-content;
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
                margin-bottom: var(--spacing-size-xsmall);
                padding: 0 var(--spacing-size-small);
            }

            .list-segment {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                align-content: space-between;
                justify-content: flex-start;
                overflow-y: auto;
                max-height: calc(var(--text-font-size-large) * 20);
                min-width: calc(var(--text-font-size-large) * 7);
                background-color: var(--background-color);
                padding: var(--spacing-size-xsmall) var(--spacing-size-small);
            }

            .list-segment::-webkit-scrollbar {
                -webkit-appearance: none;
                width: 7px;
            }

            .list-segment::-webkit-scrollbar-thumb {
                border-radius: 4px;
                background-color: rgba(0, 0, 0, .5);
                box-shadow: 0 0 1px var(--background-color-accent);
            }

        `];let zt=$s;ls([P({attribute:!0,reflect:!0})],zt.prototype,"services",2);ls([P()],zt.prototype,"date",2);ls([v()],zt.prototype,"unscheduled",1);var jr=Object.defineProperty,Ir=Object.getOwnPropertyDescriptor,Fi=(n,t,e,s)=>{for(var i=s>1?void 0:s?Ir(t,e):t,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=(s?r(t,e,i):r(i))||i);return s&&i&&jr(t,e,i),i};const xs=class xs extends I{constructor(){super("acorn:model"),this.handleVisibilityChange=()=>{document.visibilityState==="visible"&&this.updateShifts()}}get staff_shift_issues(){const t=this.model.shifts||[],e=this.model.plans||[],s=new Map,i=new Map,a=t.filter(l=>!l.matched);for(const l of e)for(const u of l.staff)s.set(u.user_id,{user_id:u.user_id,name:u.staff_info.name});for(const l of t)l.matched&&i.set(l.user_id,{user_id:l.user_id,name:l.name});const r=[...s.values()].filter(l=>!i.has(l.user_id)),o=[...i.values()].filter(l=>!s.has(l.user_id));return{staff_on_plans_without_shifts:r,staff_with_shifts_not_on_plans:o,unmatched_shifts:a}}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this.handleVisibilityChange)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this.handleVisibilityChange)}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="date"&&e!==s&&s&&this.updateShifts()}updateShifts(){this.dispatchMessage(["staff/shifts",{from_shift_date:this.date,to_shift_date:this.date}])}closeDialog(){this.shadowRoot.querySelector("dialog").close()}showModal(){this.shadowRoot.querySelector("dialog").showModal()}render(){const{staff_on_plans_without_shifts:t,staff_with_shifts_not_on_plans:e,unmatched_shifts:s}=this.staff_shift_issues;return h`
        <div>
            ${(a=>a?h`
                <button @click=${this.showModal}>
                    <div class="bubble-container">
                        <box-icon name='circle' type='solid' color="var(--accent-color-red)" size="var(--text-font-size-large)"></box-icon>
                        <p class="in-bubble">${a}</p>
                    </div>
                </button>
            `:h`
                <button @click=${this.showModal} disabled>
                    <box-icon name='happy' color="var(--text-color-body)" size="var(--text-font-size-large)"></box-icon>
                </button>
            `)(t.length+e.length+s.length)}
        </div>
        <dialog class="modal">
            <div class="modal-content">
                <div class="spread-apart modal-header">
                    <h4>Unscheduled Appointments</h4>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
                </div>
                <div class="spread-apart list-segment">
                    <h5>Staff on Plans Without Shifts:</h5>
                    <ul class="issue-list">
                    ${t.map(a=>h`
                        <li>
                            <span>${a.name}</span>
                        </li>
                    `)}
                    </ul>
                    <h5>Shifts Not On Plans:</h5>
                    <ul class="issue-list">
                    ${e.map(a=>h`
                        <li>
                            <span>${a.name}</span>
                        </li>
                    `)}
                    </ul>
                    <label>
                        <info-dialog name="Unmatched Shifts">
                            <p>Some shifts cannot always be properly matched to a particular staff member.</p>
                            <p>This often happens when a staff member has a name in Homebase that differs from the one in AcornArranger/ResortCleaning.</p>
                        </info-dialog>
                        <h5>Unmatched Shifts:</h5>
                    </label>
                    <ul class="issue-list">
                    ${s.map(a=>h`
                        <li>
                            <span>${a.shift.first_name} ${a.shift.last_name}</span>
                        </li>
                    `)}
                    </ul>
                </div>
            </div>
        </dialog>
    `}};xs.styles=[R,U,z`

            button[disabled]:hover {
                background-color: var(--background-color-accent);
            }

            ul.issue-list {
                list-style-type: none;
                padding-top: var(--spacing-size-small);
                padding-bottom: var(--spacing-size-small);
            }

            ul.issue-list li {
                width: max-content;
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
                margin-bottom: var(--spacing-size-xsmall);
                padding: 0 var(--spacing-size-small);
            }

            .list-segment {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                align-content: space-between;
                justify-content: flex-start;
                overflow-y: auto;
                max-height: calc(var(--text-font-size-large) * 20);
                min-width: calc(var(--text-font-size-large) * 7);
                background-color: var(--background-color);
                padding: var(--spacing-size-xsmall) var(--spacing-size-small);
            }

            .list-segment::-webkit-scrollbar {
                -webkit-appearance: none;
                width: 7px;
            }

            .list-segment::-webkit-scrollbar-thumb {
                border-radius: 4px;
                background-color: rgba(0, 0, 0, .5);
                box-shadow: 0 0 1px var(--background-color-accent);
            }

            div.list-segment label {
                display: flex;
                align-items: center;
                gap: var(--spacing-size-xsmall);
            }

        `];let Vt=xs;Fi([P()],Vt.prototype,"date",2);Fi([v()],Vt.prototype,"staff_shift_issues",1);var Nr=Object.defineProperty,Lr=Object.getOwnPropertyDescriptor,H=(n,t,e,s)=>{for(var i=s>1?void 0:s?Lr(t,e):t,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=(s?r(t,e,i):r(i))||i);return s&&i&&Nr(t,e,i),i};const ve=class ve extends I{constructor(){super("acorn:model"),this.build_count=0,this.from_plan_date=qe(new Date).split("T")[0],this.per_page=10,this.page=1,this.filter_service_ids=[21942,23044],this.routing_type=1,this.cleaning_window=6,this.max_hours=6.5,this.addEventListener("build-error-dialog:no-error",()=>{this.updatePlans()}),this.addEventListener("plan-view:update",()=>{this.updatePlans()})}get plans(){return this.model.plans}get services(){return this.model.services}get build_error(){return this.model.build_error}get showing_total(){return this.plans?this.plans.length:0}get service_options(){return this.services?this.services.map(t=>({id:t.service_id,label:t.service_name})):[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["services/",{}]),this.updatePlans()}updatePlans(){this.dispatchMessage(["plans/",{from_plan_date:this.from_plan_date,per_page:this.per_page,page:this.page-1}])}buildSchedule(){this.build_error&&this.dispatchMessage(["build_error/reset",{}]),this.dispatchMessage(["plans/build",{plan_date:this.from_plan_date,build_options:{available_staff:this.model.available?this.model.available:[],services:this.filter_service_ids,omissions:this.model.omissions?this.model.omissions:[],routing_type:this.routing_type,cleaning_window:this.cleaning_window,max_hours:this.max_hours,target_staff_count:this.target_staff_count}}]),this.build_count++}copySchedule(){this.dispatchMessage(["plans/copy",{plan_date:this.from_plan_date}]),this.build_count++}sendSchedule(){this.dispatchMessage(["plans/send",{plan_date:this.from_plan_date}]),this.build_count++,this.closeSendModal(),setTimeout(()=>{this.showConfirmationDialog(),setTimeout(()=>{this.closeConfirmationDialog()},1500)},500)}addPlan(){this.dispatchMessage(["plans/add",{plan_date:this.from_plan_date}]),this.build_count++}handleTableOptionChange(t){this.handleInputChange(t);const e=t.target,{name:s}=e;(s==="per_page"||s==="from_plan_date")&&this.updatePlans()}handleInputChange(t){const e=t.target,{name:s,value:i,type:a}=e;a==="checkbox"?this.handleCheckboxChange(t):this[s]=i}handleCheckboxChange(t){const e=t.target,{name:s}=e,i=s,a=parseInt(e.value);switch(i){case"app_service":e.checked?this.filter_service_ids=[...this.filter_service_ids,a]:this.filter_service_ids=this.filter_service_ids.filter(o=>o!==a);break;default:const r=i;throw new Error(`Unhandled Auth message "${r}"`)}}previousPage(){this.page>1&&(this.page--,this.updatePlans())}nextPage(){this.page++,this.updatePlans()}closeSendModal(){this.shadowRoot.querySelector("dialog.send-modal").close()}showSendModal(){this.shadowRoot.querySelector("dialog.send-modal").showModal()}closeConfirmationDialog(){this.shadowRoot.querySelector("dialog.confirmation-dialog").close()}showConfirmationDialog(){this.shadowRoot.querySelector("dialog.confirmation-dialog").show()}render(){const t=(i,a)=>{var r;switch(a){case"app_service":r=this.filter_service_ids;break;default:const o=a;throw new Error(`Unhandled Auth message "${o}"`)}return h`
            <label>
            <input
                name=${a}
                type="checkbox"
                .value=${i.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${r.includes(i.id)}
            />
            ${i.label}
            </label>
        `},e=i=>h`
            <plan-view .plan=${i}></plan-view>
        `,s=this.plans||[];return h`
        <dialog class="confirmation-dialog modal">
            <div class="modal-content">
                <div>
                    <box-icon name='check' color="var(--text-color-body)" size="calc(var(--icon-size) * 2)"></box-icon>
                </div>
                <div class="align-center">
                    <h4>Plan Sent</h4>
                </div>
            </div>
        </dialog>
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
                            ${this.service_options.map(i=>t(i,"app_service"))}
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
                    <div class="modal-buttons">
                        <build-error-dialog code=${this.build_error?this.build_error.code:`no-error:${this.build_count}`} .error=${this.build_error}></build-error-dialog>
                        <unscheduled-modal date=${this.from_plan_date} .services=${this.filter_service_ids}></unscheduled-modal>
                        <shift-check_modal date=${this.from_plan_date}></shift-check_modal>
                    </div>
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
                    <div>
                        <p>Showing: </p>
                        <div class="bubble-container">
                            <box-icon name='circle' type='solid' color="var(--accent-color)" size="var(--text-font-size-large)"></box-icon>
                            <p class="in-bubble">${this.showing_total}</p>
                        </div>
                    </div>
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
    `}};ve.uses=lt({"plan-view":At,"available-modal":Et,"omissions-modal":V,"build-error-dialog":Jt,"info-dialog":fe,"unscheduled-modal":zt,"shift-check_modal":Vt}),ve.styles=[R,U,z`

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

            .modal-buttons {
                display: flex;
                justify-content: flex-start;
                gap: var(--spacing-size-small);
            }
        `];let j=ve;H([v()],j.prototype,"plans",1);H([v()],j.prototype,"services",1);H([v()],j.prototype,"build_error",1);H([v()],j.prototype,"showing_total",1);H([v()],j.prototype,"service_options",1);H([v()],j.prototype,"from_plan_date",2);H([v()],j.prototype,"per_page",2);H([v()],j.prototype,"page",2);H([v()],j.prototype,"filter_service_ids",2);H([v()],j.prototype,"routing_type",2);H([v()],j.prototype,"cleaning_window",2);H([v()],j.prototype,"max_hours",2);H([v()],j.prototype,"target_staff_count",2);var Dr=Object.defineProperty,Hr=Object.getOwnPropertyDescriptor,Pt=(n,t,e,s)=>{for(var i=s>1?void 0:s?Hr(t,e):t,a=n.length-1,r;a>=0;a--)(r=n[a])&&(i=(s?r(t,e,i):r(i))||i);return s&&i&&Dr(t,e,i),i};const Xi=z`
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
`,ws=class ws extends q{render(){return h`
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
    `}};ws.styles=[R,U,Xi,z`
    ::slotted(ul) {
        list-style-type: none;
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-size-small);
        max-width: calc(var(--spacing-size-medium) * 16);
    }
    `];let me=ws;Pt([P()],me.prototype,"property",2);const be=class be extends q{render(){return h`
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
    `}};be.uses=lt({"mu-form":ln.Element,"input-array":la.Element}),be.styles=[R,U,Xi,z`
        mu-form {
        grid-column: key / end;
        }
        mu-form input {
        grid-column: input;
        }

        a.close {
            gap: 0;
        }
    `];let Gt=be;Pt([P()],Gt.prototype,"property",2);Pt([P({attribute:!1})],Gt.prototype,"init",2);const _e=class _e extends I{constructor(){super("acorn:model"),this.edit=!1,this.properties_id=0}get property(){return this.model.property}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="properties-id"&&e!==s&&s&&(console.log("Property Page:",s),this.dispatchMessage(["properties/select",{properties_id:parseInt(s)}]))}render(){const{properties_id:t,property_name:e,address:s,status:i,estimated_cleaning_mins:a,double_unit:r=[]}=this.property||{properties_id:0},o=r.map(u=>h`
        <li>${u}</li>
        `),l=h`
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
    `;return this.edit?h`
        <property-editor
            property=${t}
            .init=${this.property}
            @mu-form:submit=${u=>this._handleSubmit(u)}>
            ${l}
        </property-editor>
        `:h`
        <property-viewer property=${t}>
            ${l}
            <span slot="estimated_cleaning_mins">${a}</span>
            <ul slot="double_unit">
            ${o}
            </ul>
        </property-viewer>
        `}_handleSubmit(t){console.log("Handling submit of mu-form"),this.dispatchMessage(["properties/save",{properties_id:this.properties_id,property:t.detail,onSuccess:()=>ui.dispatch(this,"history/navigate",{href:`/app/property/${this.properties_id}`}),onFailure:e=>console.log("ERROR:",e)}])}};_e.uses=lt({"property-viewer":me,"property-editor":Gt}),_e.styles=[R,U,z`
        li {
            width: max-content;
            background-color: var(--background-color);
            border-radius: var(--border-size-radius);
            padding: 0 var(--spacing-size-small);
        }
    `];let Ct=_e;Pt([P({type:Boolean,reflect:!0})],Ct.prototype,"edit",2);Pt([P({attribute:"properties-id",reflect:!0,type:Number})],Ct.prototype,"properties_id",2);Pt([v()],Ct.prototype,"property",1);const qr=[{path:"/app/appointments",view:()=>h`
      <appointments-view></appointments-view>
    `},{path:"/app/staff",view:()=>h`
      <staff-view></staff-view>
    `},{path:"/app/roles",view:()=>h`
      <roles-view></roles-view>
    `},{path:"/app/properties",view:()=>h`
      <properties-view></properties-view>
    `},{path:"/app/property/:id/edit",view:n=>h`
      <property-view edit properties-id=${n.id}></property-view>
    `},{path:"/app/property/:id",view:n=>h`
      <property-view properties-id=${n.id}></property-view>
    `},{path:"/app/schedule",view:()=>h`
      <plans-view></plans-view>
    `},{path:"/app",view:()=>h`
      <landing-view></landing-view>
    `},{path:"/",redirect:"/app"}];lt({"mu-auth":A.Provider,"mu-store":class extends mn.Provider{constructor(){super(Ta,Oa,"acorn:auth")}},"mu-history":ui.Provider,"mu-switch":class extends na.Element{constructor(){super(qr,"acorn:history","acorn:auth")}},"side-bar":Bt,"login-form":ar,"signup-form":rr,"restful-form":Je.FormElement,"landing-view":He,"staff-view":kt,"appointments-view":D,"roles-view":Wt,"properties-view":St,"plans-view":j,"property-view":Ct});export{A as a,lt as d,Zt as e};
