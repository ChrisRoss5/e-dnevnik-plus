(function(e){function t(t){for(var a,i,o=t[0],s=t[1],l=t[2],u=0,j=[];u<o.length;u++)i=o[u],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&j.push(r[i][0]),r[i]=0;for(a in s)Object.prototype.hasOwnProperty.call(s,a)&&(e[a]=s[a]);p&&p(t);while(j.length)j.shift()();return c.push.apply(c,l||[]),n()}function n(){for(var e,t=0;t<c.length;t++){for(var n=c[t],a=!0,i=1;i<n.length;i++){var o=n[i];0!==r[o]&&(a=!1)}a&&(c.splice(t--,1),e=s(s.s=n[0]))}return e}var a={},i={app:0},r={app:0},c=[];function o(e){return s.p+"js/"+({}[e]||e)+"."+{"chunk-272caac7":"7010f48c","chunk-2837026a":"0d63ac1f"}[e]+".js"}function s(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.e=function(e){var t=[],n={"chunk-272caac7":1,"chunk-2837026a":1};i[e]?t.push(i[e]):0!==i[e]&&n[e]&&t.push(i[e]=new Promise((function(t,n){for(var a="css/"+({}[e]||e)+"."+{"chunk-272caac7":"ccd5570c","chunk-2837026a":"86c196f6"}[e]+".css",r=s.p+a,c=document.getElementsByTagName("link"),o=0;o<c.length;o++){var l=c[o],u=l.getAttribute("data-href")||l.getAttribute("href");if("stylesheet"===l.rel&&(u===a||u===r))return t()}var j=document.getElementsByTagName("style");for(o=0;o<j.length;o++){l=j[o],u=l.getAttribute("data-href");if(u===a||u===r)return t()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t){var a=t&&t.target&&t.target.src||r,c=new Error("Loading CSS chunk "+e+" failed.\n("+a+")");c.code="CSS_CHUNK_LOAD_FAILED",c.request=a,delete i[e],p.parentNode.removeChild(p),n(c)},p.href=r;var b=document.getElementsByTagName("head")[0];b.appendChild(p)})).then((function(){i[e]=0})));var a=r[e];if(0!==a)if(a)t.push(a[2]);else{var c=new Promise((function(t,n){a=r[e]=[t,n]}));t.push(a[2]=c);var l,u=document.createElement("script");u.charset="utf-8",u.timeout=120,s.nc&&u.setAttribute("nonce",s.nc),u.src=o(e);var j=new Error;l=function(t){u.onerror=u.onload=null,clearTimeout(p);var n=r[e];if(0!==n){if(n){var a=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src;j.message="Loading chunk "+e+" failed.\n("+a+": "+i+")",j.name="ChunkLoadError",j.type=a,j.request=i,n[1](j)}r[e]=void 0}};var p=setTimeout((function(){l({type:"timeout",target:u})}),12e4);u.onerror=u.onload=l,document.head.appendChild(u)}return Promise.all(t)},s.m=e,s.c=a,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)s.d(n,a,function(t){return e[t]}.bind(null,a));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s.oe=function(e){throw console.error(e),e};var l=window["webpackJsonp"]=window["webpackJsonp"]||[],u=l.push.bind(l);l.push=t,l=l.slice();for(var j=0;j<l.length;j++)t(l[j]);var p=u;c.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("cd49")},"01d1":function(e,t,n){"use strict";n("2c69")},"02e7":function(e,t,n){e.exports=n.p+"img/download-icon.383cf3dc.png"},"08fb":function(e,t,n){"use strict";n("b6d0")},1086:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAAXNSR0IArs4c6QAAAmhJREFUWEft10uoTlEUwPHfRSKMFAnlLRnKREzIzEAGCpkYKFOkvBIZoCgjj5I5hRlGyohkgKFHKeWVUpRXHq3bd2rffc853znfd3EHdw33Xo//WWudvdceMIpkYBSxGIOpqka/mVmMlViA8Z0gP/AM9/GyTRv0AjMZ2zC7YaAAu4KArJW2MOuxqpvTiv3buFdn2xQm9A5gQoWz53jP4A8xE/Mq9N7ifL89c6TEwQPcwq8K5wG+Ecuz/c84XWbTJDM7MSszPoFvDcs1FXsy3Se4ltt3g1mCLYnRTxxvCJGqjcPhzO4iXqdr3WDy8hzD7xKYgF6KN4jylUmU7WC2cbQpzDJsTpQvdIKVBYoyRDlChgTIlPNMD/FZl5lIa6S3kLogTWHCV5rtdzhXBKiDSY1u4FFNr7SBWYs1ZR9ZBTMR+xODql4pVNrATMHeNjBzsaNhiUKtDUxeqlP4EotFZuZjUxK8aMZiKQ6qQj7icnbY9QNzFuFzyDxzKLl5a9pj8LCKQyuVFCbWh50hmX7aj8MyU+h2AyoDCdtp2J0F/NCB+p6tt+qZKqAqkDRWzDdbs+B3cDdZW4fVbRo4B7qOx3W1y/Y2YEVn7RUuJfs9nTMFUFuQIm4MYds7IHGnhfR8AofxHMSXjYT0dTeVAUxHNGZbGZFbOw0aQ3ekPeQkvjYkKptnov+i/EOk2whRKM/Arsz2IW6i6Ifcd9Wk9wlnyj6kKUzo7cOkimy8QNzA/2QGLhjyG7dhpQbVRux1kAaN7MS7Kf60JvIUV//GuykPvqjzolz4v16UTbLRk07TBu7JeVujMZiqjP0BiBhzJCehgUgAAAAASUVORK5CYII="},"10df":function(e,t,n){},2207:function(e,t,n){e.exports=n.p+"img/browser.66ce747a.png"},2652:function(e,t,n){e.exports=n.p+"img/chrome-icon.bf83a1cc.png"},"2c69":function(e,t,n){},6897:function(e,t,n){e.exports=n.p+"img/review-icon.f6114971.png"},"6c7d":function(e,t,n){"use strict";n("10df")},"741c":function(e,t,n){},8559:function(e,t,n){"use strict";n("741c")},"97e9":function(e,t,n){e.exports=n.p+"img/code-icon.7cd7aabd.png"},"9b7c":function(e,t,n){"use strict";n("cc6a")},b6d0:function(e,t,n){},b978:function(e,t,n){e.exports=n.p+"img/edge-icon.72b8d8eb.png"},cc6a:function(e,t,n){},cd49:function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var a=n("7a23");function i(e,t,n,i,r,c){var o=Object(a["C"])("Wrapper"),s=Object(a["C"])("Previews");return Object(a["v"])(),Object(a["g"])(a["a"],null,[Object(a["k"])(o),Object(a["k"])(a["b"],{name:"previews"},{default:Object(a["H"])((function(){return[e.showPreviews?(Object(a["v"])(),Object(a["e"])(s,{key:0})):Object(a["f"])("",!0)]})),_:1})],64)}n("ac1f"),n("5319");var r={id:"wrapper"},c={id:"important"},o={key:0},s=Object(a["j"])(" Nova verzija za učenike i roditelje je stigla! "),l=Object(a["h"])("strong",null,"Postojeći korisnici trebaju potvrditi nova dopuštenja kako bi proširenje nastavilo raditi.",-1),u={id:"background"},j={id:"heading"},p=Object(a["h"])("div",{id:"ed",class:"ed"},"e-Dnevnik",-1),b=Object(a["h"])("div",{id:"plus",class:"plus"},"Plus",-1),d=Object(a["h"])("div",{id:"subtitle"},"Proširenje za školski e-Dnevnik",-1),h=Object(a["h"])("div",{style:{color:"gray"}}," Ovo proširenje nije službena CARNET-ova aplikacija. ",-1),v=Object(a["h"])("a",{class:"plus",href:"mailto:kristijan.ros@gmail.com?subject=e-Dnevnik Plus — Kontakt"}," kristijan.ros@gmail.com",-1),O=Object(a["j"])(" | "),m=Object(a["j"])(" politika privatnosti");function f(e,t,n,i,f,k){var g=Object(a["C"])("router-link"),A=Object(a["C"])("router-view");return Object(a["v"])(),Object(a["g"])("div",r,[Object(a["h"])("div",c,[e.$inApp?(Object(a["v"])(),Object(a["g"])("strong",o," Tvoja trenutno instalirana verzija proširenja: "+Object(a["E"])(e.$lastVersion),1)):(Object(a["v"])(),Object(a["g"])(a["a"],{key:1},[s,l],64))]),Object(a["h"])("div",u,[(Object(a["v"])(!0),Object(a["g"])(a["a"],null,Object(a["B"])(e.rectangles,(function(e,t){return Object(a["v"])(),Object(a["g"])("div",{key:t,class:"rect",style:Object(a["r"])(e)},null,4)})),128))]),Object(a["h"])("div",j,[Object(a["k"])(g,{to:"/",id:"title"},{default:Object(a["H"])((function(){return[p,b]})),_:1}),d]),Object(a["k"])(A,{class:"router-view"}),Object(a["h"])("div",{id:"footer",class:Object(a["q"])({default:"/"!=e.$route.path})},[h,Object(a["j"])(" 2019.-"+Object(a["E"])((new Date).getFullYear())+". | ",1),v,O,Object(a["k"])(g,{to:"politika-privatnosti",class:"plus"},{default:Object(a["H"])((function(){return[m]})),_:1})],2)])}n("99af");var k=Object(a["l"])({name:"Wrapper",data:function(){return{isHomepage:!1,rectangles:[],speed:2e4}},mounted:function(){for(var e=0;e<10;e++)this.updateRect(e,!0)},methods:{updateRect:function(e,t){var n=this,a=this.rand(30,150),i=this.rand(0,100),r=t?i+"%":-a+"px",c=this.rand(this.speed,2*this.speed)*(t?1-i/100:1);this.rectangles[e]={bottom:r,opacity:"1"},setTimeout((function(){n.rectangles[e]={bottom:"100%",opacity:"0",left:n.rand(-10,100)+"%",width:a+"px",height:a+"px",borderRadius:n.rand(a/10,a/3)+"px",animation:"rotate "+100*a+"ms linear infinite",transition:"bottom ".concat(c,"ms ease-out, opacity ").concat(.2*c,"ms ").concat(.5*c,"ms")},setTimeout((function(){return n.updateRect(e)}),c)}),100)},rand:function(e,t){return Math.floor(Math.random()*(t-e+1)+e)}}}),g=(n("6c7d"),n("d959")),A=n.n(g);const y=A()(k,[["render",f]]);var z=y,w={id:"previews"};function P(e,t){return Object(a["v"])(),Object(a["g"])("div",w)}n("9b7c");const C={},x=A()(C,[["render",P]]);var D=x,E=Object(a["l"])({name:"App",components:{Wrapper:z,Previews:D},data:function(){return{showPreviews:!1}},mounted:function(){var e=localStorage.getItem("path");e&&(localStorage.removeItem("path"),this.$router.replace(e))},watch:{$route:function(e){this.showPreviews="/"==e.path}}});n("08fb");const K=A()(E,[["render",i]]);var R=K,M=(n("d3b7"),n("3ca3"),n("ddb0"),n("6c02")),S=n("f7a0"),T=n.n(S),N=function(e){return Object(a["y"])("data-v-48434e78"),e=e(),Object(a["w"])(),e},I={class:"card content-card"},U=Object(a["j"])(" Povijest ažuriranja "),_={id:"app-types",class:"card"},V=N((function(){return Object(a["h"])("span",null,"(22.11.2021.)",-1)})),W=N((function(){return Object(a["h"])("ul",null,[Object(a["h"])("li",null,[Object(a["j"])("e-Dnevnik Plus "),Object(a["h"])("span",{class:"plus"},"App"),Object(a["j"])(":")]),Object(a["h"])("ul",null,[Object(a["h"])("li",null," Ispravljena greška: zbroj novih ocjena i bilješki uvijek je bio 3. "),Object(a["h"])("li",null,[Object(a["j"])(' Opcija "Prikaži boje ocjena" podjeljena je na dvije nove opcije: '),Object(a["h"])("ul",null,[Object(a["h"])("li",null,"Prikaži boje ocjena po ukupnom broju"),Object(a["h"])("li",null,"Prikaži boje ocjena po mjesecima")])]),Object(a["h"])("li",null,"Smanjen zum cijele aplikacije za 10%."),Object(a["h"])("li",null,"Dodana opcija prikaza lozinke kod prijave.")]),Object(a["h"])("li",null,[Object(a["j"])("e-Dnevnik Plus "),Object(a["h"])("span",{class:"plus"},"Classic"),Object(a["j"])(":")]),Object(a["h"])("ul",null,[Object(a["h"])("li",null," Dodana opcija automatske prijave (kvačica na /login stranici). ")])],-1)})),q=N((function(){return Object(a["h"])("h3",null,[Object(a["j"])("Verzija 5.0"),Object(a["h"])("span",null,"(11.11.2021.)")],-1)})),F=N((function(){return Object(a["h"])("ul",null,[Object(a["h"])("li",null,"Uklonjene sve funkcionalnosti prethodne verzije proširenja."),Object(a["h"])("li",null,[Object(a["j"])(" Novi prozor proširenja omogućuje odabir verzije e-Dnevnika: "),Object(a["h"])("span",{class:"plus"},"App"),Object(a["j"])(" ili "),Object(a["h"])("span",{class:"plus"},"Classic"),Object(a["h"])("br"),Object(a["j"])(" Odabrana verzija postaje zadana te se svaki put otvara navigacijom na "),Object(a["h"])("a",{href:"ocjene.skole.hr",class:"plus"},"ocjene.skole.hr"),Object(a["h"])("img",{class:"card",src:T.a})]),Object(a["h"])("li",null,[Object(a["h"])("span",{class:"plus"},"App"),Object(a["j"])(" verzija je nova aplikacija za napredan pregled sadržaja s e-Dnevnika: "),Object(a["h"])("ul",null,[Object(a["h"])("li",null," Osnovne lokacije su: Razred, Kalendar, Statistika ocjena i Kalkulator bodova. "),Object(a["h"])("li",null," Sve promjene ostaju automatski spremljene za prijavljenog korisnika. ")])]),Object(a["h"])("li",null,[Object(a["h"])("span",{class:"plus"},"Classic"),Object(a["j"])(" verzija dodaje prosjeke na stranici e-Dnevnika: "),Object(a["h"])("ul",null,[Object(a["h"])("li",null," Na stranici odabira predmeta, za svaki predmet i završni prosjek. "),Object(a["h"])("li",null,"Na stranici predmeta.")])])],-1)})),B=N((function(){return Object(a["h"])("h3",null,[Object(a["j"])("Verzija <= 4.8"),Object(a["h"])("span",null,"(21.3.2019.)")],-1)})),H=N((function(){return Object(a["h"])("a",{class:"plus",href:"https://chrisross5.github.io/e-Dnevnik-Plus-WEB-stari/"},"https://chrisross5.github.io/e-Dnevnik-Plus-WEB-stari/",-1)})),G=Object(a["j"])("Nema novosti.");function Y(e,t,n,i,r,c){return Object(a["v"])(),Object(a["g"])("div",I,[Object(a["h"])("h2",null,[U,Object(a["h"])("div",_,[Object(a["h"])("div",{class:Object(a["q"])({"selected-app":!e.selectedApp}),onClick:t[0]||(t[0]=function(t){return e.selectedApp=0})}," za učenike i roditelje ",2),Object(a["h"])("div",{class:Object(a["q"])({"selected-app":e.selectedApp}),onClick:t[1]||(t[1]=function(t){return e.selectedApp=1})}," za nastavnike ",2)])]),e.selectedApp?(Object(a["v"])(),Object(a["g"])(a["a"],{key:1},[G],64)):(Object(a["v"])(),Object(a["g"])(a["a"],{key:0},[Object(a["h"])("h3",null,[Object(a["j"])("Verzija "+Object(a["E"])(e.$lastVersion),1),V]),W,q,F,B,H],64))])}var Q=Object(a["l"])({name:"Changelog",data:function(){return{selectedApp:0}}});n("01d1");const Z=A()(Q,[["render",Y],["__scopeId","data-v-48434e78"]]);var L=Z,$=n("02e7"),J=n.n($),X=n("6897"),ee=n.n(X),te=n("97e9"),ne=n.n(te),ae=n("2652"),ie=n.n(ae),re=n("b978"),ce=n.n(re),oe=n("2207"),se=n.n(oe),le=n("1086"),ue=n.n(le),je=function(e){return Object(a["y"])("data-v-7bf80964"),e=e(),Object(a["w"])(),e},pe={id:"content"},be={key:0,id:"main",class:"main-message"},de={key:1,id:"main",class:"main-message"},he={key:2,id:"main"},ve=je((function(){return Object(a["h"])("div",{id:"downloads"},[Object(a["h"])("div",{class:"download-item"},[Object(a["h"])("a",{href:"https://chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe",target:"_blank",class:"card"},[Object(a["h"])("img",{src:J.a}),Object(a["j"])(" Preuzmi "),Object(a["h"])("em",null,"proširenje"),Object(a["j"])(" za učenike i roditelje ")]),Object(a["h"])("a",{href:"https://chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe/reviews",target:"_blank",class:"card"},[Object(a["h"])("img",{src:ee.a})]),Object(a["h"])("a",{href:"https://github.com/ChrisRoss5/e-Dnevnik-Plus",target:"_blank",class:"card"},[Object(a["h"])("img",{src:ne.a})])]),Object(a["h"])("div",{class:"download-item"},[Object(a["h"])("a",{href:"https://chrome.google.com/webstore/detail/e-dnevnik-plus-za-nastavn/jefappmpehdgllijkjpekdmkbmbigbnl",target:"_blank",class:"card"},[Object(a["h"])("img",{src:J.a}),Object(a["j"])(" Preuzmi "),Object(a["h"])("em",null,"proširenje"),Object(a["j"])(" za nastavnike ")]),Object(a["h"])("a",{href:"https://chrome.google.com/webstore/detail/e-dnevnik-plus-za-nastavn/jefappmpehdgllijkjpekdmkbmbigbnl/reviews",target:"_blank",class:"card"},[Object(a["h"])("img",{src:ee.a})]),Object(a["h"])("a",{href:"https://github.com/ChrisRoss5/e-Dnevnik-Plus-za-nastavnike",target:"_blank",class:"card"},[Object(a["h"])("img",{src:ne.a})])])],-1)})),Oe=je((function(){return Object(a["h"])("div",{id:"browsers",class:"card"},[Object(a["h"])("div",{style:{"padding-bottom":"10px"}},"Kompatibilni preglednici:"),Object(a["h"])("div",{id:"browser-icons"},[Object(a["h"])("div",{class:"flex-center"},[Object(a["h"])("img",{src:ie.a}),Object(a["j"])(" Chrome ")]),Object(a["h"])("div",{class:"flex-center"},[Object(a["h"])("img",{src:ce.a}),Object(a["j"])(" Edge ")])])],-1)})),me=[ve,Oe],fe=je((function(){return Object(a["h"])("div",{id:"browser"},[Object(a["h"])("img",{src:se.a})],-1)})),ke=je((function(){return Object(a["h"])("img",{src:ue.a},null,-1)}));function ge(e,t,n,i,r,c){var o=Object(a["C"])("router-link");return Object(a["v"])(),Object(a["g"])("div",pe,[Object(a["k"])(a["b"],{name:"opacity",mode:"out-in"},{default:Object(a["H"])((function(){return["#instaliran"==e.$route.hash?(Object(a["v"])(),Object(a["g"])("div",be," Proširenje je uspješno instalirano! ")):"#azuriran"==e.$route.hash?(Object(a["v"])(),Object(a["g"])("div",de," Proširenje je ažurirano na najnoviju verziju "+Object(a["E"])(e.$lastVersion)+"! ",1)):(Object(a["v"])(),Object(a["g"])("div",he,me))]})),_:1}),fe,Object(a["k"])(o,{to:"/povijest",id:"changelog"},{default:Object(a["H"])((function(){return[ke]})),_:1})])}var Ae=Object(a["l"])({name:"Home",mounted:function(){var e=this;this.$route.hash&&setTimeout((function(){return e.$router.replace({hash:"#jupiiiii"})}),6e3)}});n("8559");const ye=A()(Ae,[["render",ge],["__scopeId","data-v-7bf80964"]]);var ze=ye,we={class:"card content-card"},Pe=Object(a["i"])("<h2>Politika Privatnosti</h2> Ovaj dokument pomoći će vam razumjeti kako proširenje e-Dnevnik Plus koristi i čuva vaše osobne podatke, prikupljene prilikom njena korištenja. Dokument se može promijeniti u bilo koje vrijeme o čemu ćete biti pravovremeno obaviješteni prilikom ažuriranja proširenja. <h3>Koje osobne podatke proširenje prikuplja</h3> Prikupljeni osobni podaci su vaše korisničko ime i lozinka HUSO AAI računa. <h3>Zašto proširenje prikuplja osobne podatke</h3> Podaci se koriste u svrhu automatske prijave ili odjave iz e-Dnevnika te za spremanje korisnikovih podataka poput bilješki i postavki u kalendaru. <h3>Gdje se nalaze prikupljeni osobni podaci</h3> Svi prikupljeni podaci (ne samo osobni) ostaju spremljeni lokalno na vašem uređaju te podacima ne može pristupiti <strong>nitko osim vas</strong>. Prilikom deinstalacije svi podaci se trajno brišu. <h3>Google Analytics</h3> U svrhu pružanja bolje usluge i razumijevanja potreba korisnika koristim se alatom Google Analytics. Iako Google bilježi veliki broj informacija poput geografskih i demografskih pokazatelja, vaši osobni podaci su zaštićeni te ne postoji način identifikacije korisnika. <h3>Kontakt</h3> Upite vezane uz ovaj dokument možete tražiti putem email-a: <em>kristijan.ros@gmail.com</em>",15),Ce=[Pe];function xe(e,t,n,i,r,c){return Object(a["v"])(),Object(a["g"])("div",we,Ce)}var De=Object(a["l"])({name:"PrivacyPolicy"});const Ee=A()(De,[["render",xe]]);var Ke=Ee,Re=[{path:"/",component:ze},{path:"/politika-privatnosti",component:Ke},{path:"/povijest",component:L},{path:"/deinstalacija",component:function(){return n.e("chunk-272caac7").then(n.bind(null,"c1f9"))}},{path:"/donacije",component:function(){return n.e("chunk-2837026a").then(n.bind(null,"e4a7"))}},{path:"/:pathMatch(.*)",redirect:"/"}],Me=Object(M["a"])({history:Object(M["b"])(""),routes:Re}),Se=Me,Te=Object(a["d"])(R);function Ne(){try{return window.self!==window.top}catch(e){return!0}}Te.config.globalProperties.$lastVersion="5.0.1",Te.config.globalProperties.$inApp=Ne(),Te.use(Se).mount("#app")},f7a0:function(e,t,n){e.exports=n.p+"img/popup.3aff4797.png"}});
//# sourceMappingURL=app.a8b82969.js.map