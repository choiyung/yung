(()=>{"use strict";
const viewport=document.querySelector("#viewport"),rail=document.querySelector("#rail"),panel=document.querySelector("#indexPanel");
const mobile=matchMedia("(max-width:800px)"),layout=window.YungArchiveLayout,entries=window.ARCHIVE_ENTRIES||[];
const latestEntry=[...entries].filter(e=>!e.demo).sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")))[0]||entries[0]||null;
const MOTION={initialPause:350,dragResumeDelay:80,wheelResumeDelay:160,keyResumeDelay:140,desktopAutoSpeed:.62,mobileAutoSpeed:.46,momentumFriction:.88};
let mode="index",activeId=null,visible=entries,offset=0,width=0,count=0,last=0,paused=true,drag=false,point=0,velocity=0,pauseUntil=0,current=[];
const $=s=>document.querySelector(s);
function cfg(f){return layout.mergedFrameConfig(f,window.FRAME_PRESETS||{})}
function card(f,i){const c=cfg(f),a=document.createElement("article");a.className="card is-photo"+(c.bleed?" is-bleed":"");a.dataset.frame=i;const im=document.createElement("img");im.className="card-media";im.src=c.image;im.alt=c.alt||"";im.draggable=false;a.append(im);return a}
function apply(a,f){const im=a.querySelector("img"),c=cfg(f),b=layout.computeFrameBox(c,im.naturalWidth,im.naturalHeight,viewport.clientWidth||innerWidth,viewport.clientHeight||innerHeight,mobile.matches?"mobile":"desktop");a.style.setProperty("--layout-w",b.width+"px");a.style.setProperty("--layout-h",b.height+"px");a.style.setProperty("--media-fit",b.objectFit);a.style.setProperty("--media-pos",b.objectPosition)}
function paint(){rail.style.transform=`translate3d(${-width-offset}px,0,0)`}
function norm(){if(width)offset=((offset%width)+width)%width}
function measure(){if(!count)return;const frac=width?offset/width:0;[...rail.children].forEach((a,i)=>apply(a,current[i%count]));const a=[...rail.children];if(!a[count])return;width=a[count].offsetLeft-a[0].offsetLeft;offset=frac*width;norm();paint()}
function setFrames(frames){current=frames||[];count=current.length;offset=width=velocity=0;const originals=current.map(card);rail.replaceChildren(...originals);for(let n=0;n<5;n++)originals.forEach(x=>{const c=x.cloneNode(true);c.classList.add("is-clone");c.setAttribute("aria-hidden","true");c.querySelector("img").alt="";rail.append(c)});measure();pauseUntil=performance.now()+MOTION.initialPause;Promise.all(originals.map(c=>c.querySelector("img").decode().catch(()=>{}))).then(measure)}
function tick(now){const dt=Math.min(now-last||16.7,40);last=now;if(!paused&&!drag&&width&&!document.hidden&&!$(".yung-shell-overlay.is-open")){if(Math.abs(velocity)>.05){offset+=velocity*dt/16.7;velocity*=Math.pow(MOTION.momentumFriction,dt/16.7)}else if(now>pauseUntil)offset+=(mobile.matches?MOTION.mobileAutoSpeed:MOTION.desktopAutoSpeed)*dt/16.7;norm();paint()}requestAnimationFrame(tick)}requestAnimationFrame(tick);
viewport.addEventListener("pointerdown",e=>{if(e.button!==0)return;drag=true;point=e.clientX;velocity=0;viewport.setPointerCapture(e.pointerId);viewport.classList.add("is-dragging")});
viewport.addEventListener("pointermove",e=>{if(!drag)return;const d=point-e.clientX;offset+=d;velocity=d;point=e.clientX;norm();paint()});
function release(){if(!drag)return;drag=false;viewport.classList.remove("is-dragging");pauseUntil=performance.now()+MOTION.dragResumeDelay}["pointerup","pointercancel","lostpointercapture"].forEach(x=>viewport.addEventListener(x,release));
viewport.addEventListener("wheel",e=>{if(paused)return;e.preventDefault();offset+=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*.8;velocity=0;pauseUntil=performance.now()+MOTION.wheelResumeDelay;norm();paint()},{passive:false});
addEventListener("resize",measure);mobile.addEventListener?.("change",measure);new ResizeObserver(measure).observe(viewport);

function changeMode(next){mode=next;document.body.classList.toggle("is-index",next==="index");panel.hidden=next!=="index";$("#viewBtn").setAttribute("aria-pressed",String(next==="view"));$("#indexBtn").setAttribute("aria-pressed",String(next==="index"));paused=next==="index"||!visible.length}
function selectEntry(id,open=true){const e=entries.find(x=>x.id===id);if(!e)return;activeId=id;setFrames(e.frames);if(open)changeMode("view")}
function renderIndex(){const list=$("#recordList");list.replaceChildren(...visible.map(e=>{const b=document.createElement("button");b.className="index-row";const im=document.createElement("img");im.src=e.cover;im.alt="";const d=document.createElement("span");d.className="date";d.textContent=e.date.replaceAll("-",".");const t=document.createElement("span");t.className="entry-copy";t.innerHTML=`<strong></strong><small></small>`;t.querySelector("strong").textContent=e.title;t.querySelector("small").textContent=e.description;const p=document.createElement("span");p.className="project";p.textContent=e.project;const k=document.createElement("span");k.className="kind";k.textContent=e.type;b.append(im,d,t,p,k);b.onclick=()=>selectEntry(e.id,true);return b}))}
function filter(){const q=$("#siteSearch").value.trim().toLowerCase();visible=entries.filter(e=>[e.date,e.title,e.description,e.project,e.type].join(" ").toLowerCase().includes(q));renderIndex()}
$("#indexBtn").onclick=()=>changeMode("index");$("#viewBtn").onclick=()=>{if(!activeId&&entries[0])selectEntry(entries[0].id,false);changeMode("view")};$("#siteSearch").oninput=filter;

document.addEventListener("yung:archive-index",()=>changeMode("index"));
document.addEventListener("yung:archive-latest",()=>{if(latestEntry)selectEntry(latestEntry.id,true)});
document.addEventListener("yung:search-input",e=>{const input=$("#siteSearch");if(input){input.value=e.detail?.query||"";filter()}});
document.addEventListener("yung:search-submit",e=>{const input=$("#siteSearch");if(input){input.value=e.detail?.query||"";filter();changeMode("index")}});
$("#siteSearch").placeholder="Search records";
const params=new URLSearchParams(location.search);const searchParam=params.get("search");if(searchParam)$("#siteSearch").value=searchParam;
filter();
const target=params.get("record");
if(searchParam){changeMode("index")}else if(target&&entries.some(e=>e.id===target)){selectEntry(target,true)}else if(latestEntry){selectEntry(latestEntry.id,true)}else{changeMode("index")}
})();