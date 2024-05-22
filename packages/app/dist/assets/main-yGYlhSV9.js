(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();var be;class st extends Error{}st.prototype.name="InvalidTokenError";function zs(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let i=e.charCodeAt(0).toString(16).toUpperCase();return i.length<2&&(i="0"+i),"%"+i}))}function Ns(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return zs(t)}catch{return atob(t)}}function Ms(r,t){if(typeof r!="string")throw new st("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,i=r.split(".")[e];if(typeof i!="string")throw new st(`Invalid token specified: missing part #${e+1}`);let s;try{s=Ns(i)}catch(n){throw new st(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(s)}catch(n){throw new st(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Ls="mu:context",Gt=`${Ls}:change`;class Hs{constructor(t,e){this._proxy=js(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class te extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Hs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Gt,t),t}detach(t){this.removeEventListener(Gt,t)}}function js(r,t){return new Proxy(r,{get:(i,s,n)=>{if(s==="then")return;const o=Reflect.get(i,s,n);return console.log(`Context['${s}'] => ${JSON.stringify(o)}`),o},set:(i,s,n,o)=>{const l=r[s];console.log(`Context['${s.toString()}'] <= ${JSON.stringify(n)}; was ${JSON.stringify(l)}`);const a=Reflect.set(i,s,n,o);if(a){let p=new CustomEvent(Gt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(p,{property:s,oldValue:l,value:n}),t.dispatchEvent(p)}else console.log(`Context['${s}] was not set to ${n}`);return a}})}function Is(r,t){const e=Ge(t,r);return new Promise((i,s)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>i(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function Ge(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const i=t.closest(e);if(i)return i;const s=t.getRootNode();if(s instanceof ShadowRoot)return Ge(r,s.host)}class Ds extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Ze(r){return(t,...e)=>t.dispatchEvent(new Ds(e,r))}class ee{constructor(t,e,i="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=i,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const i=e.detail;this.consume(i)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Vs(r){return t=>({...t,...r})}const Zt="mu:auth:jwt",bt=class Xe extends ee{constructor(t,e){super((i,s)=>this.update(i,s),t,Xe.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:i,redirect:s}=t[1];return e(qs(i)),Ft(s);case"auth/signout":return e(Ae()),Ft(this._redirectForLogin);case"auth/redirect":return e(Ae()),Ft(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};bt.EVENT_TYPE="auth:message";bt.dispatch=Ze(bt.EVENT_TYPE);let Fs=bt;function Ft(r,t={}){if(!r)return;const e=window.location.href,i=new URL(r,e);return Object.entries(t).forEach(([s,n])=>i.searchParams.set(s,n)),()=>{console.log("Redirecting to ",r),window.location.assign(i)}}class Bs extends te{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:J.authenticateFromLocalStorage()})}connectedCallback(){new Fs(this.context,this.redirect).attach(this)}}class Y{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Zt),t}}class J extends Y{constructor(t){super();const e=Ms(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new J(t);return localStorage.setItem(Zt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Zt);return t?J.authenticate(t):new Y}}function qs(r){return Vs({user:J.authenticate(r),token:r})}function Ae(){return r=>{const t=r.user;return{user:t&&t.authenticated?Y.deauthenticate(t):t,token:""}}}function Ws(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}const g=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:J,Provider:Bs,User:Y,headers:Ws},Symbol.toStringTag,{value:"Module"}));function Ys(r,t,e){const i=r.currentTarget,s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,s),i.dispatchEvent(s),r.stopPropagation()}const se=Object.freeze(Object.defineProperty({__proto__:null,relay:Ys},Symbol.toStringTag,{value:"Module"})),Qe=class ts extends ee{constructor(t){super((e,i)=>this.update(e,i),t,ts.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:i,state:s}=t[1];e(Js(i,s));break}case"history/redirect":{const{href:i,state:s}=t[1];e(Ks(i,s));break}}}};Qe.EVENT_TYPE="history:message";let ie=Qe;class we extends te{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=t.composed?t.composedPath()[0]:t.target;if(e.tagName=="A"&&e.href&&t.button==0){const i=new URL(e.href);i.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),re(e,"history/navigate",{href:i.pathname+i.search}))}}),window.addEventListener("popstate",t=>{this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ie(this.context).attach(this)}}function Js(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function Ks(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const re=Ze(ie.EVENT_TYPE),Gs=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:we,Provider:we,Service:ie,dispatch:re},Symbol.toStringTag,{value:"Module"})),Zs=new DOMParser;function es(r,...t){const e=r.map((o,l)=>l?[t[l-1],o]:[o]).flat().join(""),i=Zs.parseFromString(e,"text/html"),s=i.head.childElementCount?i.head.children:i.body.children,n=new DocumentFragment;return n.replaceChildren(...s),n}function ss(r){const t=r.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:i};function i(s,n={mode:"open"}){const o=s.attachShadow(n);return e&&o.appendChild(e.content.cloneNode(!0)),o}}class dt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,i)=>{if(this._provider){const s=new Ee(this._provider,t);this._effects.push(s),e(s)}else Is(this._target,this._contextLabel).then(s=>{const n=new Ee(s,t);this._provider=s,this._effects.push(n),s.attach(o=>this._handleChange(o)),e(n)}).catch(s=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Ee{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ne=class is extends HTMLElement{constructor(){super(),this._state={},this._user=new Y,this._authObserver=new dt(this,"blazing:auth"),ss(is.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src){console.log("Submitting form",this._state);const e=this.isNew?"POST":"PUT",i=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Qs(s,this._state,e,this.authorization).then(n=>gt(n,this)).then(n=>{const o=`mu-rest-form:${i}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[i]:n,url:s}});this.dispatchEvent(l)})}}),this.addEventListener("change",t=>{const e=t.target;if(e){const i=e.name,s=e.value;i&&(this._state[i]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&Xt(this.src,this.authorization).then(e=>{this._state=e,gt(e,this)}))})}attributeChangedCallback(t,e,i){switch(t){case"src":this.src&&i&&i!==e&&!this.isNew&&Xt(this.src,this.authorization).then(s=>{this._state=s,gt(s,this)});break;case"new":i&&(this._state={},gt({},this));break}}};ne.observedAttributes=["src","new"];ne.template=es`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot><button type="submit">Submit</button></slot>
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
  `;let Xs=ne;function Xt(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function gt(r,t){const e=Object.entries(r);for(const[i,s]of e){const n=t.querySelector(`[name="${i}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;default:o.value=s;break}}}return r}function Qs(r,t,e="PUT",i={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...i},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()}).catch(s=>console.log("Error submitting form:",s))}const rs=Object.freeze(Object.defineProperty({__proto__:null,FormElement:Xs,fetchData:Xt},Symbol.toStringTag,{value:"Module"})),ns=class os extends ee{constructor(t,e){super(e,t,os.EVENT_TYPE,!1)}};ns.EVENT_TYPE="mu:message";let as=ns;class ti extends te{constructor(t,e,i){super(e),this._user=new Y,this._updateFn=t,this._authObserver=new dt(this,i)}connectedCallback(){const t=new as(this.context,(e,i)=>this._updateFn(e,i,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const ei=Object.freeze(Object.defineProperty({__proto__:null,Provider:ti,Service:as},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yt=globalThis,oe=yt.ShadowRoot&&(yt.ShadyCSS===void 0||yt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ae=Symbol(),Se=new WeakMap;let ls=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(oe&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=Se.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Se.set(e,t))}return t}toString(){return this.cssText}};const si=r=>new ls(typeof r=="string"?r:r+"",void 0,ae),ii=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new ls(e,r,ae)},ri=(r,t)=>{if(oe)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=yt.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},xe=oe?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return si(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ni,defineProperty:oi,getOwnPropertyDescriptor:ai,getOwnPropertyNames:li,getOwnPropertySymbols:ci,getPrototypeOf:hi}=Object,K=globalThis,Pe=K.trustedTypes,di=Pe?Pe.emptyScript:"",ke=K.reactiveElementPolyfillSupport,it=(r,t)=>r,At={toAttribute(r,t){switch(t){case Boolean:r=r?di:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},le=(r,t)=>!ni(r,t),Ce={attribute:!0,type:String,converter:At,reflect:!1,hasChanged:le};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),K.litPropertyMetadata??(K.litPropertyMetadata=new WeakMap);let F=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ce){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&oi(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=ai(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return s==null?void 0:s.call(this)},set(o){const l=s==null?void 0:s.call(this);n.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ce}static _$Ei(){if(this.hasOwnProperty(it("elementProperties")))return;const t=hi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(it("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(it("properties"))){const e=this.properties,i=[...li(e),...ci(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(xe(s))}else t!==void 0&&e.push(xe(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ri(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){var i;const s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){const o=(((i=s.converter)==null?void 0:i.toAttribute)!==void 0?s.converter:At).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=s.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((i=o.converter)==null?void 0:i.fromAttribute)!==void 0?o.converter:At;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){if(i??(i=this.constructor.getPropertyOptions(t)),!(i.hasChanged??le)(this[t],e))return;this.P(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(t=this._$EO)==null||t.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(i)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};F.elementStyles=[],F.shadowRootOptions={mode:"open"},F[it("elementProperties")]=new Map,F[it("finalized")]=new Map,ke==null||ke({ReactiveElement:F}),(K.reactiveElementVersions??(K.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=globalThis,Et=wt.trustedTypes,Te=Et?Et.createPolicy("lit-html",{createHTML:r=>r}):void 0,cs="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,hs="?"+P,ui=`<${hs}>`,M=document,ot=()=>M.createComment(""),at=r=>r===null||typeof r!="object"&&typeof r!="function",ds=Array.isArray,pi=r=>ds(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Bt=`[ 	
\f\r]`,tt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Oe=/-->/g,Re=/>/g,R=RegExp(`>|${Bt}(?:([^\\s"'>=/]+)(${Bt}*=${Bt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ue=/'/g,ze=/"/g,us=/^(?:script|style|textarea|title)$/i,fi=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),qt=fi(1),G=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Ne=new WeakMap,z=M.createTreeWalker(M,129);function ps(r,t){if(!Array.isArray(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Te!==void 0?Te.createHTML(t):t}const mi=(r,t)=>{const e=r.length-1,i=[];let s,n=t===2?"<svg>":"",o=tt;for(let l=0;l<e;l++){const a=r[l];let p,f,d=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===tt?f[1]==="!--"?o=Oe:f[1]!==void 0?o=Re:f[2]!==void 0?(us.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=R):f[3]!==void 0&&(o=R):o===R?f[0]===">"?(o=s??tt,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?R:f[3]==='"'?ze:Ue):o===ze||o===Ue?o=R:o===Oe||o===Re?o=tt:(o=R,s=void 0);const h=o===R&&r[l+1].startsWith("/>")?" ":"";n+=o===tt?a+ui:d>=0?(i.push(p),a.slice(0,d)+cs+a.slice(d)+P+h):a+P+(d===-2?l:h)}return[ps(r,n+(r[e]||"<?>")+(t===2?"</svg>":"")),i]};let Qt=class fs{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[p,f]=mi(t,e);if(this.el=fs.createElement(p,i),z.currentNode=this.el.content,e===2){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=z.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const d of s.getAttributeNames())if(d.endsWith(cs)){const c=f[o++],h=s.getAttribute(d).split(P),u=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:u[2],strings:h,ctor:u[1]==="."?_i:u[1]==="?"?gi:u[1]==="@"?yi:Ut}),s.removeAttribute(d)}else d.startsWith(P)&&(a.push({type:6,index:n}),s.removeAttribute(d));if(us.test(s.tagName)){const d=s.textContent.split(P),c=d.length-1;if(c>0){s.textContent=Et?Et.emptyScript:"";for(let h=0;h<c;h++)s.append(d[h],ot()),z.nextNode(),a.push({type:2,index:++n});s.append(d[c],ot())}}}else if(s.nodeType===8)if(s.data===hs)a.push({type:2,index:n});else{let d=-1;for(;(d=s.data.indexOf(P,d+1))!==-1;)a.push({type:7,index:n}),d+=P.length-1}n++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}};function Z(r,t,e=r,i){var s,n;if(t===G)return t;let o=i!==void 0?(s=e._$Co)==null?void 0:s[i]:e._$Cl;const l=at(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=o:e._$Cl=o),o!==void 0&&(t=Z(r,o._$AS(r,t.values),o,i)),t}let vi=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=((t==null?void 0:t.creationScope)??M).importNode(e,!0);z.currentNode=s;let n=z.nextNode(),o=0,l=0,a=i[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new ce(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new $i(n,this,t)),this._$AV.push(p),a=i[++l]}o!==(a==null?void 0:a.index)&&(n=z.nextNode(),o++)}return z.currentNode=M,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},ce=class ms{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),at(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==G&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):pi(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==b&&at(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Qt.createElement(ps(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(i);else{const o=new vi(n,this),l=o.u(this.options);o.p(i),this.T(l),this._$AH=o}}_$AC(t){let e=Ne.get(t.strings);return e===void 0&&Ne.set(t.strings,e=new Qt(t)),e}k(t){ds(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new ms(this.S(ot()),this.S(ot()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Ut=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=b}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(n===void 0)t=Z(this,t,e,0),o=!at(t)||t!==this._$AH&&t!==G,o&&(this._$AH=t);else{const l=t;let a,p;for(t=n[0],a=0;a<n.length-1;a++)p=Z(this,l[i+a],e,a),p===G&&(p=this._$AH[a]),o||(o=!at(p)||p!==this._$AH[a]),p===b?t=b:t!==b&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!s&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},_i=class extends Ut{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}},gi=class extends Ut{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}},yi=class extends Ut{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??b)===G)return;const i=this._$AH,s=t===b&&i!==b||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==b&&(i===b||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},$i=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}};const Me=wt.litHtmlPolyfillSupport;Me==null||Me(Qt,ce),(wt.litHtmlVersions??(wt.litHtmlVersions=[])).push("3.1.3");const bi=(r,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let s=i._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;i._$litPart$=s=new ce(t.insertBefore(ot(),n),n,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let q=class extends F{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=bi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return G}};q._$litElement$=!0,q.finalized=!0,(be=globalThis.litElementHydrateSupport)==null||be.call(globalThis,{LitElement:q});const Le=globalThis.litElementPolyfillSupport;Le==null||Le({LitElement:q});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ai={attribute:!0,type:String,converter:At,reflect:!1,hasChanged:le},wi=(r=Ai,t,e)=>{const{kind:i,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),n.set(e.name,r),i==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(i==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+i)};function vs(r){return(t,e)=>typeof e=="object"?wi(r,t,e):((i,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,o?{...i,wrapped:!0}:i),o?Object.getOwnPropertyDescriptor(s,n):void 0})(r,t,e)}function Ei(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Si(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var _s={};(function(r){var t=function(){var e=function(d,c,h,u){for(h=h||{},u=d.length;u--;h[d[u]]=c);return h},i=[1,9],s=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,u,v,m,_,Ht){var E=_.length-1;switch(m){case 1:return new v.Root({},[_[E-1]]);case 2:return new v.Root({},[new v.Literal({value:""})]);case 3:this.$=new v.Concat({},[_[E-1],_[E]]);break;case 4:case 5:this.$=_[E];break;case 6:this.$=new v.Literal({value:_[E]});break;case 7:this.$=new v.Splat({name:_[E]});break;case 8:this.$=new v.Param({name:_[E]});break;case 9:this.$=new v.Optional({},[_[E-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:i,13:s,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:i,13:s,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:i,13:s,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:i,12:[1,16],13:s,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let u=function(v,m){this.message=v,this.hash=m};throw u.prototype=Error,new u(c,h)}},parse:function(c){var h=this,u=[0],v=[null],m=[],_=this.table,Ht="",E=0,ge=0,Ts=2,ye=1,Os=m.slice.call(arguments,1),$=Object.create(this.lexer),T={yy:{}};for(var jt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,jt)&&(T.yy[jt]=this.yy[jt]);$.setInput(c,T.yy),T.yy.lexer=$,T.yy.parser=this,typeof $.yylloc>"u"&&($.yylloc={});var It=$.yylloc;m.push(It);var Rs=$.options&&$.options.ranges;typeof T.yy.parseError=="function"?this.parseError=T.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Us=function(){var D;return D=$.lex()||ye,typeof D!="number"&&(D=h.symbols_[D]||D),D},w,O,S,Dt,I={},vt,x,$e,_t;;){if(O=u[u.length-1],this.defaultActions[O]?S=this.defaultActions[O]:((w===null||typeof w>"u")&&(w=Us()),S=_[O]&&_[O][w]),typeof S>"u"||!S.length||!S[0]){var Vt="";_t=[];for(vt in _[O])this.terminals_[vt]&&vt>Ts&&_t.push("'"+this.terminals_[vt]+"'");$.showPosition?Vt="Parse error on line "+(E+1)+`:
`+$.showPosition()+`
Expecting `+_t.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Vt="Parse error on line "+(E+1)+": Unexpected "+(w==ye?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Vt,{text:$.match,token:this.terminals_[w]||w,line:$.yylineno,loc:It,expected:_t})}if(S[0]instanceof Array&&S.length>1)throw new Error("Parse Error: multiple actions possible at state: "+O+", token: "+w);switch(S[0]){case 1:u.push(w),v.push($.yytext),m.push($.yylloc),u.push(S[1]),w=null,ge=$.yyleng,Ht=$.yytext,E=$.yylineno,It=$.yylloc;break;case 2:if(x=this.productions_[S[1]][1],I.$=v[v.length-x],I._$={first_line:m[m.length-(x||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(x||1)].first_column,last_column:m[m.length-1].last_column},Rs&&(I._$.range=[m[m.length-(x||1)].range[0],m[m.length-1].range[1]]),Dt=this.performAction.apply(I,[Ht,ge,E,T.yy,S[1],v,m].concat(Os)),typeof Dt<"u")return Dt;x&&(u=u.slice(0,-1*x*2),v=v.slice(0,-1*x),m=m.slice(0,-1*x)),u.push(this.productions_[S[1]][0]),v.push(I.$),m.push(I._$),$e=_[u[u.length-2]][u[u.length-1]],u.push($e);break;case 3:return!0}}return!0}},p=function(){var d={EOF:1,parseError:function(h,u){if(this.yy.parser)this.yy.parser.parseError(h,u);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,u=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var v=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),u.length-1&&(this.yylineno-=u.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:u?(u.length===v.length?this.yylloc.first_column:0)+v[v.length-u.length].length-u[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var u,v,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),v=c[0].match(/(?:\r\n?|\n).*/g),v&&(this.yylineno+=v.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:v?v[v.length-1].length-v[v.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],u=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),u)return u;if(this._backtrack){for(var _ in m)this[_]=m[_];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,u,v;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),_=0;_<m.length;_++)if(u=this._input.match(this.rules[m[_]]),u&&(!h||u[0].length>h[0].length)){if(h=u,v=_,this.options.backtrack_lexer){if(c=this.test_match(u,m[_]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[v]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,u,v,m){switch(v){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=p;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Si<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(_s);function V(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var gs={Root:V("Root"),Concat:V("Concat"),Literal:V("Literal"),Splat:V("Splat"),Param:V("Param"),Optional:V("Optional")},ys=_s.parser;ys.yy=gs;var xi=ys,Pi=Object.keys(gs);function ki(r){return Pi.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var $s=ki,Ci=$s,Ti=/[\-{}\[\]+?.,\\\^$|#\s]/g;function bs(r){this.captures=r.captures,this.re=r.re}bs.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(i,s){typeof t[s+1]>"u"?e[i]=void 0:e[i]=decodeURIComponent(t[s+1])}),e};var Oi=Ci({Concat:function(r){return r.children.reduce((function(t,e){var i=this.visit(e);return{re:t.re+i.re,captures:t.captures.concat(i.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Ti,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new bs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Ri=Oi,Ui=$s,zi=Ui({Concat:function(r,t){var e=r.children.map((function(i){return this.visit(i,t)}).bind(this));return e.some(function(i){return i===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),Ni=zi,Mi=xi,Li=Ri,Hi=Ni;ut.prototype=Object.create(null);ut.prototype.match=function(r){var t=Li.visit(this.ast),e=t.match(r);return e||!1};ut.prototype.reverse=function(r){return Hi.visit(this.ast,r)};function ut(r){var t;if(this?t=this:t=Object.create(ut.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=Mi.parse(r),t}var ji=ut,Ii=ji,Di=Ii;const Vi=Ei(Di);var Fi=Object.defineProperty,Bi=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Fi(t,e,s),s};class St extends q{constructor(t,e){super(),this._cases=[],this._fallback=()=>qt`
      <h1>Not Found</h1>
    `,this._cases=t.map(i=>({...i,route:new Vi(i.path)})),this._historyObserver=new dt(this,e)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match),qt`
      <main>${(()=>{if(this._match){if("view"in this._match)return this._match.view(this._match.params||{});if("redirect"in this._match){const e=this._match.redirect;if(typeof e=="string")return this.redirect(e),qt`
              <h1>Redirecting to ${e}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:i}=t,s=new URLSearchParams(e),n=i+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:i,params:l,query:s}}}redirect(t){re(this,"history/redirect",{href:t})}}St.styles=ii`
    :host,
    main {
      display: contents;
    }
  `;Bi([vs()],St.prototype,"_match");const qi=Object.freeze(Object.defineProperty({__proto__:null,Element:St,Switch:St},Symbol.toStringTag,{value:"Module"})),Wi=class As extends HTMLElement{constructor(){if(super(),ss(As.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Wi.template=es`<template>
    <slot name="actuator"><button> Menu </button></slot>
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
  </template>`;function ws(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Yi=Object.defineProperty,Ji=Object.getOwnPropertyDescriptor,Ki=(r,t,e,i)=>{for(var s=Ji(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Yi(t,e,s),s};class pt extends q{constructor(t){super(),this._pending=[],this._observer=new dt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",e),this._context=e.context,this._pending.length&&this._pending.forEach(([i,s])=>{console.log("Dispatching queued event",s,i),i.dispatchEvent(s)}),e.setEffect(()=>{if(console.log("View effect",e,this._context),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const i=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",i),e.dispatchEvent(i)):(console.log("Queueing message event",i),this._pending.push([e,i]))}ref(t){return this.model?this.model[t]:void 0}}Ki([vs()],pt.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $t=globalThis,he=$t.ShadowRoot&&($t.ShadyCSS===void 0||$t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,de=Symbol(),He=new WeakMap;let Es=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==de)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(he&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=He.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&He.set(e,t))}return t}toString(){return this.cssText}};const Gi=r=>new Es(typeof r=="string"?r:r+"",void 0,de),j=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new Es(e,r,de)},Zi=(r,t)=>{if(he)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=$t.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},je=he?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return Gi(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Xi,defineProperty:Qi,getOwnPropertyDescriptor:tr,getOwnPropertyNames:er,getOwnPropertySymbols:sr,getPrototypeOf:ir}=Object,C=globalThis,Ie=C.trustedTypes,rr=Ie?Ie.emptyScript:"",Wt=C.reactiveElementPolyfillSupport,rt=(r,t)=>r,xt={toAttribute(r,t){switch(t){case Boolean:r=r?rr:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ue=(r,t)=>!Xi(r,t),De={attribute:!0,type:String,converter:xt,reflect:!1,hasChanged:ue};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);class B extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=De){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Qi(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=tr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return s==null?void 0:s.call(this)},set(o){const l=s==null?void 0:s.call(this);n.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??De}static _$Ei(){if(this.hasOwnProperty(rt("elementProperties")))return;const t=ir(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(rt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(rt("properties"))){const e=this.properties,i=[...er(e),...sr(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(je(s))}else t!==void 0&&e.push(je(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Zi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){var n;const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){const o=(((n=i.converter)==null?void 0:n.toAttribute)!==void 0?i.converter:xt).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){var n;const i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const o=i.getPropertyOptions(s),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:xt;this._$Em=s,this[s]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){if(i??(i=this.constructor.getPropertyOptions(t)),!(i.hasChanged??ue)(this[t],e))return;this.P(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(e)):this._$EU()}catch(s){throw t=!1,this._$EU(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}B.elementStyles=[],B.shadowRootOptions={mode:"open"},B[rt("elementProperties")]=new Map,B[rt("finalized")]=new Map,Wt==null||Wt({ReactiveElement:B}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nt=globalThis,Pt=nt.trustedTypes,Ve=Pt?Pt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ss="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,xs="?"+k,nr=`<${xs}>`,L=document,lt=()=>L.createComment(""),ct=r=>r===null||typeof r!="object"&&typeof r!="function",Ps=Array.isArray,or=r=>Ps(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Yt=`[ 	
\f\r]`,et=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Fe=/-->/g,Be=/>/g,U=RegExp(`>|${Yt}(?:([^\\s"'>=/]+)(${Yt}*=${Yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),qe=/'/g,We=/"/g,ks=/^(?:script|style|textarea|title)$/i,ar=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),y=ar(1),X=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Ye=new WeakMap,N=L.createTreeWalker(L,129);function Cs(r,t){if(!Array.isArray(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ve!==void 0?Ve.createHTML(t):t}const lr=(r,t)=>{const e=r.length-1,i=[];let s,n=t===2?"<svg>":"",o=et;for(let l=0;l<e;l++){const a=r[l];let p,f,d=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===et?f[1]==="!--"?o=Fe:f[1]!==void 0?o=Be:f[2]!==void 0?(ks.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=U):f[3]!==void 0&&(o=U):o===U?f[0]===">"?(o=s??et,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?U:f[3]==='"'?We:qe):o===We||o===qe?o=U:o===Fe||o===Be?o=et:(o=U,s=void 0);const h=o===U&&r[l+1].startsWith("/>")?" ":"";n+=o===et?a+nr:d>=0?(i.push(p),a.slice(0,d)+Ss+a.slice(d)+k+h):a+k+(d===-2?l:h)}return[Cs(r,n+(r[e]||"<?>")+(t===2?"</svg>":"")),i]};class ht{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[p,f]=lr(t,e);if(this.el=ht.createElement(p,i),N.currentNode=this.el.content,e===2){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=N.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const d of s.getAttributeNames())if(d.endsWith(Ss)){const c=f[o++],h=s.getAttribute(d).split(k),u=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:u[2],strings:h,ctor:u[1]==="."?hr:u[1]==="?"?dr:u[1]==="@"?ur:zt}),s.removeAttribute(d)}else d.startsWith(k)&&(a.push({type:6,index:n}),s.removeAttribute(d));if(ks.test(s.tagName)){const d=s.textContent.split(k),c=d.length-1;if(c>0){s.textContent=Pt?Pt.emptyScript:"";for(let h=0;h<c;h++)s.append(d[h],lt()),N.nextNode(),a.push({type:2,index:++n});s.append(d[c],lt())}}}else if(s.nodeType===8)if(s.data===xs)a.push({type:2,index:n});else{let d=-1;for(;(d=s.data.indexOf(k,d+1))!==-1;)a.push({type:7,index:n}),d+=k.length-1}n++}}static createElement(t,e){const i=L.createElement("template");return i.innerHTML=t,i}}function Q(r,t,e=r,i){var o,l;if(t===X)return t;let s=i!==void 0?(o=e._$Co)==null?void 0:o[i]:e._$Cl;const n=ct(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==n&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=s:e._$Cl=s),s!==void 0&&(t=Q(r,s._$AS(r,t.values),s,i)),t}class cr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=((t==null?void 0:t.creationScope)??L).importNode(e,!0);N.currentNode=s;let n=N.nextNode(),o=0,l=0,a=i[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new ft(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new pr(n,this,t)),this._$AV.push(p),a=i[++l]}o!==(a==null?void 0:a.index)&&(n=N.nextNode(),o++)}return N.currentNode=L,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class ft{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),ct(t)?t===A||t==null||t===""?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):or(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==A&&ct(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ht.createElement(Cs(i.h,i.h[0]),this.options)),i);if(((n=this._$AH)==null?void 0:n._$AD)===s)this._$AH.p(e);else{const o=new cr(s,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=Ye.get(t.strings);return e===void 0&&Ye.set(t.strings,e=new ht(t)),e}k(t){Ps(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new ft(this.S(lt()),this.S(lt()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class zt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=A}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(n===void 0)t=Q(this,t,e,0),o=!ct(t)||t!==this._$AH&&t!==X,o&&(this._$AH=t);else{const l=t;let a,p;for(t=n[0],a=0;a<n.length-1;a++)p=Q(this,l[i+a],e,a),p===X&&(p=this._$AH[a]),o||(o=!ct(p)||p!==this._$AH[a]),p===A?t=A:t!==A&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!s&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class hr extends zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class dr extends zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class ur extends zt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??A)===X)return;const i=this._$AH,s=t===A&&i!==A||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==A&&(i===A||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class pr{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const Jt=nt.litHtmlPolyfillSupport;Jt==null||Jt(ht,ft),(nt.litHtmlVersions??(nt.litHtmlVersions=[])).push("3.1.3");const fr=(r,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let s=i._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;i._$litPart$=s=new ft(t.insertBefore(lt(),n),n,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class W extends B{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=fr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return X}}var Ke;W._$litElement$=!0,W.finalized=!0,(Ke=globalThis.litElementHydrateSupport)==null||Ke.call(globalThis,{LitElement:W});const Kt=globalThis.litElementPolyfillSupport;Kt==null||Kt({LitElement:W});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");const mr={};function vr(r,t,e){switch(r[0]){case"properties/save":_r(r[1],e).then(s=>t(n=>({...n,property:s})));break;case"properties/select":gr(r[1],e).then(s=>t(n=>({...n,property:s})));break;case"properties/":yr(e).then(s=>t(n=>({...n,properties:s})));break;case"roles/save":$r(r[1],e).then(s=>t(n=>({...n,role:s})));break;case"roles/select":br(r[1],e).then(s=>t(n=>({...n,role:s})));break;case"roles/":Ar(e).then(s=>t(n=>({...n,roles:s})));break;case"appointments/select":wr(r[1],e).then(s=>t(n=>({...n,appointment:s})));break;case"appointments/":Er(r[1],e).then(s=>t(n=>({...n,appointments:s})));break;case"plans/select":H(r[1],e).then(s=>t(n=>({...n,plan:s})));break;case"plans/":Nt(r[1],e).then(s=>t(n=>({...n,plans:s})));break;case"plans/staff/add":Sr(r[1],e).then(s=>t(n=>({...n,plan:s})));break;case"plans/staff/remove":xr(r[1],e).then(s=>t(n=>({...n,plan:s})));break;case"plans/appointment/add":Pr(r[1],e).then(s=>t(n=>({...n,plan:s})));break;case"plans/appointment/remove":kr(r[1],e).then(s=>t(n=>({...n,plan:s})));break;case"plans/build":Cr(r[1],e).then(s=>t(n=>({...n,plans:s})));break;case"plans/send":Tr(r[1],e).then(s=>t(n=>({...n,plans:s})));break;case"plans/add":Or(r[1],e).then(s=>t(n=>({...n,plans:s})));break;case"staff/select":Rr(r[1],e).then(s=>t(n=>({...n,staff_member:s})));break;case"staff/":Ur(r[1],e).then(s=>t(n=>({...n,staff:s})));break;case"services/":zr(e).then(s=>t(n=>({...n,services:s})));break;default:const i=r[0];throw new Error(`Unhandled Auth message "${i}"`)}}function _r(r,t){return fetch(`/api/properties/${r.properties_id}`,{method:"PUT",headers:{"Content-Type":"application/json",...g.headers(t)},body:JSON.stringify(r.property)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function gr(r,t){return fetch(`/api/properties/${r.properties_id}`,{headers:g.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Property:",e),e})}function yr(r){return fetch("/api/properties",{headers:g.headers(r)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Properties:",t),t})}function $r(r,t){return fetch(`/api/roles/${r.role_id}`,{method:"PUT",headers:{"Content-Type":"application/json",...g.headers(t)},body:JSON.stringify(r.role)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function br(r,t){return fetch(`/api/roles/${r.role_id}`,{headers:g.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Role:",e),e})}function Ar(r){return fetch("/api/roles",{headers:g.headers(r)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Roles:",t),t})}function wr(r,t){return fetch(`/api/appointments/${r.appointment_id}`,{headers:g.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Appointment:",e),e})}function Er(r,t){let e=`/api/appointments?from_service_date=${r.from_service_date}&to_service_date=${r.to_service_date}`;return r.per_page&&(e+=`&${r.per_page}`),r.page&&(e+=`&${r.page}`),fetch(e,{headers:g.headers(t)}).then(i=>{if(i.status===200)return i.json()}).then(i=>{if(i)return console.log("Appointments:",i),i})}function H(r,t){return fetch(`/api/plans/${r.plan_id}`,{headers:g.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Plan:",e),e})}function Nt(r,t){let e=`/api/plans?from_service_date=${r.from_plan_date}&to_service_date=${r.to_plan_date}`;return r.per_page&&(e+=`&${r.per_page}`),r.page&&(e+=`&${r.page}`),fetch(e,{headers:g.headers(t)}).then(i=>{if(i.status===200)return i.json()}).then(i=>{if(i)return console.log("Plans:",i),i})}function Sr(r,t){return fetch(`/api/plans/${r.plan_id}/staff/${r.user_id}`,{method:"POST",headers:g.headers(t)}).then(e=>e.status===204?H(r,t):e.status===400?e.json():void 0).then(e=>{if(e){const i=e;return i.details&&(i.details==="REPEATED_ACTION"||i.details==="IMMUTABLE")?H(r,t):void 0}})}function xr(r,t){return fetch(`/api/plans/${r.plan_id}/staff/${r.user_id}`,{method:"DELETE",headers:g.headers(t)}).then(e=>{if(e.status===204)return H(r,t)})}function Pr(r,t){return fetch(`/api/plans/${r.plan_id}/appointment/${r.appointment_id}`,{method:"POST",headers:g.headers(t)}).then(e=>e.status===204?H(r,t):e.status===400?e.json():void 0).then(e=>{if(e){const i=e;return i.details&&(i.details==="REPEATED_ACTION"||i.details==="IMMUTABLE")?H(r,t):void 0}})}function kr(r,t){return fetch(`/api/plans/${r.plan_id}/appointment/${r.appointment_id}`,{method:"DELETE",headers:g.headers(t)}).then(e=>{if(e.status===204)return H(r,t)})}function Cr(r,t){return fetch(`/api/plans/build/${r.plan_date}`,{method:"POST",headers:{"Content-Type":"application/json",...g.headers(t)},body:JSON.stringify(r.build_options)}).then(e=>{if(e.status===204)return Nt({from_plan_date:r.plan_date,to_plan_date:r.plan_date},t)})}function Tr(r,t){return fetch(`/api/plans/send/${r.plan_date}`,{method:"POST",headers:g.headers(t)}).then(e=>{if(e.status===204)return Nt({from_plan_date:r.plan_date,to_plan_date:r.plan_date},t)})}function Or(r,t){return fetch(`/api/plans/add/${r.plan_date}`,{method:"POST",headers:g.headers(t)}).then(e=>{if(e.status===200)return Nt({from_plan_date:r.plan_date,to_plan_date:r.plan_date},t)})}function Rr(r,t){return fetch(`/api/staff/${r.user_id}`,{headers:g.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Staff Member:",e),e})}function Ur(r,t){let e="/api/staff";if(r.filter_status_ids&&r.filter_status_ids.length>0){const i=r.filter_status_ids.map(s=>`filter_status_id=${s}`).join("&");e+=`?${i}`}return fetch(e,{headers:g.headers(t)}).then(i=>{if(i.status===200)return i.json()}).then(i=>{if(i)return console.log("Staff:",i),i})}function zr(r){return fetch("/api/services",{headers:g.headers(r)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Services:",t),t})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nr={attribute:!0,type:String,converter:xt,reflect:!1,hasChanged:ue},Mr=(r=Nr,t,e)=>{const{kind:i,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),n.set(e.name,r),i==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(i==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+i)};function mt(r){return(t,e)=>typeof e=="object"?Mr(r,t,e):((i,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,o?{...i,wrapped:!0}:i),o?Object.getOwnPropertyDescriptor(s,n):void 0})(r,t,e)}var Lr=Object.defineProperty,Hr=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Lr(t,e,s),s};const pe=class pe extends W{constructor(){super(...arguments),this.display_name="Status: 401",this._authObserver=new dt(this,"acorn:auth")}displayNameTemplate(){return this.display_name==="Status: 401"?y`<span>Please <a href="../login.html?next=${window.location.href}" style="color: var(--text-color-link);" @click=${Je}>login</a></span>`:this.display_name===""?y`<span>Hello, user</span>`:y`<span>${this.display_name}</span>`}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&fetch("/auth/user",{headers:g.headers(t)}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).then(e=>{e&&e.user_metadata&&e.user_metadata.display_name?this.display_name=e.user_metadata.display_name:this.display_name=""}).catch(e=>this.display_name=`${e}`)})}toggleDarkMode(t){this.classList.toggle("dark-mode"),se.relay(t,"dark-mode:toggle",{})}toggleActive(){this.classList.toggle("active")}render(){return y`
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
                    <a href="../login.html?next=/" @click=${Je}>
                        <i class='bx bx-log-out'></i>
                        <span class="nav-item">Logout</span>
                    </a>
                    <span class="tooltip">Logout</span>
                </li>
            </ul>
        </nav>
    `}};pe.styles=j`
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
        /* z-index: 20; */
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
  `;let kt=pe;Hr([mt({attribute:!1})],kt.prototype,"display_name");function Je(r){se.relay(r,"auth:message",["auth/signout"])}ws({"restful-form":rs.FormElement});class jr extends W{render(){return y`
      <restful-form new src="/auth/login">
        <slot></slot>
      </restful-form>
    `}get next(){return new URLSearchParams(document.location.search).get("next")}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:i}={token:e.created.session.access_token},s=this.next||"/";console.log("Login successful",e,s),se.relay(t,"auth:message",["auth/signin",{token:i,redirect:s}])})}}const Mt=j`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
img {
  max-width: 100%;
}
`,Lt=j`
.page main {
    padding: var(--spacing-size-large) var(--spacing-size-xxlarge);
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
    /* border: 1px solid; */
    /* border-color: var(--accent-color); */
    padding: 4px 16px;
}

th {
    font-weight: var(--text-font-weight-bold);
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
    color: currentColor;
    border-color: currentColor;
    border-style: solid;
    border-radius: var(--border-size-radius);
    background-color: inherit;
    height: fit-content;
}

button:hover {
    background-color: var(--background-color-accent); 
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
`;var Ir=Object.defineProperty,Dr=Object.getOwnPropertyDescriptor,Vr=(r,t,e,i)=>{for(var s=Dr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Ir(t,e,s),s};const fe=class fe extends pt{get staff(){return this.model.staff}constructor(){super("acorn:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["staff/",{}])}render(){const t=i=>{var s,n;return y`
            <tr>
                <td>
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
                    ${(s=i.role)==null?void 0:s.title}
                    </span>
                </td>
                <td>
                    <span>
                    ${(n=i.status)==null?void 0:n.status}
                    </span>
                </td>
            </tr>
        `},e=this.staff||[];return y`
        <div class="page">
            <header>
                <h1>
                    Staff
                </h1>
            </header>
            <main>
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
                    ${e.map(i=>t(i))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};fe.styles=[Mt,Lt,j`
            
        `];let Ct=fe;Vr([mt()],Ct.prototype,"staff");var Fr=Object.defineProperty,Br=Object.getOwnPropertyDescriptor,qr=(r,t,e,i)=>{for(var s=Br(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Fr(t,e,s),s};const me=class me extends pt{get appointments(){return this.model.appointments}constructor(){super("acorn:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["appointments/",{from_service_date:"2024-05-19",to_service_date:"2024-05-20",per_page:50,page:0}])}render(){const t=s=>y`
            <li>
                <span>${s.name}</span>
            </li>
        `,e=s=>{var n,o;return y`
            <tr>
                <td>
                    <span>
                    ${s.appointment_id}
                    </span>
                </td>
                <td>
                    <span>
                    ${s.service_time}
                    </span>
                </td>
                <td>
                    <span>
                    ${s.property_info.property_name}
                    </span>
                </td>
                <td>
                    <ul>
                        ${(n=s.staff)==null?void 0:n.map(l=>t(l.staff_info))}
                    </ul>
                </td>
                <td>
                    <span>
                    ${s.service.service_name}
                    </span>
                </td>
                <td>
                    <span>
                    ${(o=s.status)==null?void 0:o.status}
                    </span>
                </td>
            </tr>
        `},i=this.appointments||[];return y`
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
                            <input name="from_service_date" autocomplete="off" value="2024-05-19" type="date" />
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>To Date:</span>
                            <input name="to_service_date" autocomplete="off" value="2024-05-20" type="date" />
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>Show:</span>
                            <input name="per_page" autocomplete="off" value="50" type="number" />
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>Page:</span>
                            <input name="page" autocomplete="off" value="1" type="number" />
                        </label>
                    </li>
                </menu>
                <table>
                    <thead>
                        <tr>
                            <th>Appointment ID</th>
                            <th>Service Time</th>
                            <th>Property</th>
                            <th>Staff</th>
                            <th>Service</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${i.map(s=>e(s))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};me.styles=[Mt,Lt,j`

            menu {
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
                list-style-type: none;
                display: flex;
                justify-content: space-evenly;
                padding: var(--spacing-size-small);
                margin-bottom: var(--spacing-size-medium);
                gap: var(--spacing-size-medium);
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
        `];let Tt=me;qr([mt()],Tt.prototype,"appointments");var Wr=Object.defineProperty,Yr=Object.getOwnPropertyDescriptor,Jr=(r,t,e,i)=>{for(var s=Yr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Wr(t,e,s),s};const ve=class ve extends pt{get roles(){return this.model.roles}constructor(){super("acorn:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["roles/",{}])}render(){const t=i=>y`
            <tr>
                <td>
                    <span>
                    ${i.priority}
                    </span>
                </td>
                <td>
                    <span>
                    ${i.title}
                    </span>
                </td>
                <td>
                    <span>
                    ${i.can_lead_team}
                    </span>
                </td>
                <td>
                    <span>
                    ${i.can_clean}
                    </span>
                </td>
            </tr>
        `,e=this.roles||[];return y`
        <div class="page">
            <header>
                <h1>
                    Staff Roles
                </h1>
            </header>
            <main>
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
                    ${e.map(i=>t(i))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};ve.styles=[Mt,Lt,j`
            
        `];let Ot=ve;Jr([mt()],Ot.prototype,"roles");var Kr=Object.defineProperty,Gr=Object.getOwnPropertyDescriptor,Zr=(r,t,e,i)=>{for(var s=Gr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Kr(t,e,s),s};const _e=class _e extends pt{get properties(){return this.model.properties}constructor(){super("acorn:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["properties/",{}])}render(){const t=s=>y`
            <li>
                <span>${s}</span>
            </li>
        `,e=s=>{var n,o;return y`
            <tr>
                <td>
                    <span>
                    ${s.properties_id}
                    </span>
                </td>
                <td>
                    <span>
                    ${s.property_name}
                    </span>
                </td>
                <td>
                    <span>
                    ${s.estimated_cleaning_mins}
                    </span>
                </td>
                <td>
                    <ul>
                    ${(n=s.double_unit)==null?void 0:n.map(l=>t(l))}
                    </ul>
                </td>
                <td>
                    <span>
                    ${(o=s.status)==null?void 0:o.status}
                    </span>
                </td>
            </tr>
        `},i=this.properties||[];return y`
        <div class="page">
            <header>
                <h1>
                    Properties
                </h1>
            </header>
            <main>
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
                    ${i.map(s=>e(s))}
                    </tbody>
                </table>
            </main>
        </div>
    `}};_e.styles=[Mt,Lt,j`
           ul {
                list-style-type: none;
                display: flex;
            }

            ul li {
                width: max-content;
                background-color: var(--background-color);
                border-radius: var(--border-size-radius);
                margin-right: var(--spacing-size-xsmall);
                padding: 0 var(--spacing-size-small);
            }
        `];let Rt=_e;Zr([mt()],Rt.prototype,"properties");const Xr=[{path:"/app/appointments",view:()=>y`
      <appointments-view></appointments-view>
    `},{path:"/app/staff",view:()=>y`
      <staff-view></staff-view>
    `},{path:"/app/roles",view:()=>y`
      <roles-view></roles-view>
    `},{path:"/app/properties",view:()=>y`
      <properties-view></properties-view>
    `},{path:"/app",redirect:"/app/appointments"},{path:"/",redirect:"/app"}];ws({"mu-auth":g.Provider,"mu-store":class extends ei.Provider{constructor(){super(vr,mr,"acorn:auth")}},"mu-history":Gs.Provider,"mu-switch":class extends qi.Element{constructor(){super(Xr,"acorn:history")}},"side-bar":kt,"login-form":jr,"restful-form":rs.FormElement,"staff-view":Ct,"appointments-view":Tt,"roles-view":Ot,"properties-view":Rt});export{g as a,ws as d,se as e};
