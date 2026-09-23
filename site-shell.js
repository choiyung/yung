(()=>{"use strict";
const root=document.getElementById("yung-site-shell");if(!root)return;
const page=root.dataset.page||"landing";
root.innerHTML=`
<header class="yung-shell-header" id="main-header">
  <div class="yung-shell-left">
    <button class="yung-shell-icon" id="hamburger-btn" data-shell-open="menuPanel" aria-label="메뉴 열기">
      <span class="yung-shell-hamburger" aria-hidden="true"><span></span><span></span><span></span></span>
    </button>
  </div>
  <a class="yung-shell-logo" id="mainLogo" href="./index.html">YUNG</a>
  <div class="yung-shell-right">
    <button class="yung-shell-icon" data-shell-open="searchPanel" aria-label="검색">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke-width="1.8"/><path d="M21 21l-4.35-4.35" stroke-width="1.8" stroke-linecap="round"/></svg>
    </button>
    <button class="yung-shell-icon" data-shell-open="profilePanel" aria-label="마이페이지">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" stroke-width="1.8"/><path d="M4.5 20c1.5-4 4.5-6 7.5-6s6 2 7.5 6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button class="yung-shell-icon" data-shell-open="cartPanel" aria-label="장바구니">
      <svg class="yung-shell-cart" viewBox="0 0 20 22" fill="none" stroke="currentColor" aria-hidden="true"><path d="M6.5 7V4.5C6.5 2.567 8.067 1 10 1C11.933 1 13.5 2.567 13.5 4.5V7" stroke-width="2" stroke-linecap="round"/><rect x="1.5" y="7" width="17" height="13.5" rx=".5" stroke-width="2"/></svg>
    </button>
  </div>
</header>
<aside class="yung-shell-overlay" id="menuPanel" aria-hidden="true">
  <button class="yung-shell-close" type="button" aria-label="닫기">×</button>
  <nav class="yung-shell-menu-links">
    <a href="${page==="landing"?"#":"./index.html?view=store"}" data-shell-route="store">Store</a>
    <a href="${page==="archive"?"#":"./archive.html?latest=1"}" data-shell-route="archive">Archive</a>
    <a href="./index.html#archive-split-section">Exhibition</a>
    <a href="./index.html#credits-contact">About</a>
  </nav>
</aside>
<aside class="yung-shell-overlay" id="searchPanel" aria-hidden="true">
  <button class="yung-shell-close" type="button" aria-label="닫기">×</button>
  <form class="yung-shell-search-form" id="yungShellSearchForm">
    <label for="siteSearch">Search</label>
    <input id="siteSearch" type="search" autocomplete="off" placeholder="Search records">
  </form>
</aside>
<aside class="yung-shell-overlay yung-shell-overlay--small" id="profilePanel" aria-hidden="true">
  <button class="yung-shell-close" type="button" aria-label="닫기">×</button>
  <div class="yung-shell-small-copy"><p>Account</p><a href="#">Login</a><a href="#">Create account</a></div>
</aside>
<aside class="yung-shell-overlay yung-shell-overlay--small" id="cartPanel" aria-hidden="true">
  <button class="yung-shell-close" type="button" aria-label="닫기">×</button>
  <div class="yung-shell-small-copy"><p>Cart is empty</p></div>
</aside>`;

const overlays=[...root.querySelectorAll(".yung-shell-overlay")];
let previousOverflow="",trigger=null;
function closeAll(restoreFocus=true){const had=overlays.some(x=>x.classList.contains("is-open"));overlays.forEach(x=>{x.classList.remove("is-open");x.setAttribute("aria-hidden","true");x.inert=true});if(had)document.body.style.overflow=previousOverflow;if(had&&restoreFocus&&trigger)trigger.focus()}
function openPanel(id,button){const panel=root.querySelector("#"+id);if(!panel)return;closeAll(false);previousOverflow=document.body.style.overflow;trigger=button;panel.inert=false;panel.classList.add("is-open");panel.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";(panel.querySelector("input")||panel.querySelector("button")||panel.querySelector("a"))?.focus()}
overlays.forEach(x=>x.inert=true);
root.querySelectorAll("[data-shell-open]").forEach(b=>b.addEventListener("click",()=>openPanel(b.dataset.shellOpen,b)));
root.querySelectorAll(".yung-shell-close").forEach(b=>b.addEventListener("click",()=>closeAll()));
document.addEventListener("keydown",e=>{const panel=root.querySelector(".yung-shell-overlay.is-open");if(!panel)return;if(e.key==="Escape"){closeAll();return}if(e.key==="Tab"){const nodes=[...panel.querySelectorAll("button,a,input")].filter(x=>!x.disabled),first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
root.querySelectorAll("[data-shell-route=archive]").forEach(a=>a.addEventListener("click",e=>{if(page==="archive"){e.preventDefault();closeAll(false);document.dispatchEvent(new CustomEvent("yung:archive-latest"))}}));
root.querySelectorAll("[data-shell-route=store]").forEach(a=>a.addEventListener("click",e=>{if(page==="landing"){e.preventDefault();closeAll(false);document.dispatchEvent(new CustomEvent("yung:store"))}}));
const form=root.querySelector("#yungShellSearchForm"),input=root.querySelector("#siteSearch");
input.addEventListener("input",()=>{if(page==="archive")document.dispatchEvent(new CustomEvent("yung:search-input",{detail:{query:input.value}}))});
form.addEventListener("submit",e=>{e.preventDefault();const q=input.value.trim();if(page==="archive"){document.dispatchEvent(new CustomEvent("yung:search-submit",{detail:{query:q}}));closeAll(false)}else{location.href="./archive.html"+(q?"?search="+encodeURIComponent(q):"")}});
document.addEventListener("yung:shell-close",()=>closeAll(false));
document.dispatchEvent(new CustomEvent("yung:shell-ready"));
})();