(()=>{"use strict";
const n=v=>{if(v==null)return null;const m=String(v).match(/^([\d.]+)(vw|d?vh|px|%)$/);if(!m)return null;const x=+m[1],u=m[2];return{value:x,unit:u}};
const px=(v,vw,vh)=>{const p=n(v);if(!p)return null;if(p.unit==="vw"||p.unit==="%")return vw*p.value/100;if(p.unit==="vh"||p.unit==="dvh")return vh*p.value/100;return p.value};
function mergedFrameConfig(frame,presets){return Object.assign({},presets[frame.frame]||{},frame)}
function computeFrameBox(c,nw,nh,vw,vh,mode){
 const ratio=nw&&nh?nw/nh:1;
 const mobile=mode==="mobile";
 if(c.bleed&&!mobile)return{width:vw,height:vh,objectFit:"cover",objectPosition:c.objectPosition||"center"};
 const maxW=px(mobile?(c.mobileMaxWidth||"94vw"):(c.desktopWidth||"48vw"),vw,vh)||vw;
 const maxH=px(mobile?(c.mobileHeight||"72dvh"):(c.desktopMaxHeight||"86dvh"),vw,vh)||vh;
 let w=Math.min(maxW,maxH*ratio),h=w/ratio;
 if(h>maxH){h=maxH;w=h*ratio}
 if(mobile&&c.mobileFit==="crop"&&c.mobileRatio){
   const parts=String(c.mobileRatio).split("/").map(Number);const r=parts[0]/parts[1];
   h=Math.min(maxH,maxW/r);w=h*r;
   return{width:w,height:h,objectFit:"cover",objectPosition:c.mobileObjectPosition||c.objectPosition||"center"}
 }
 return{width:w,height:h,objectFit:"contain",objectPosition:(mobile?c.mobileObjectPosition:null)||c.objectPosition||"center"}
}
window.YungArchiveLayout={mergedFrameConfig,computeFrameBox};
})();