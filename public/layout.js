"use strict";
document.addEventListener("click",event=>{
  const node=event.target.closest?.("[data-bl-action]");
  if(node){
    const path=node.dataset.blPath,action=node.dataset.blAction;
    if(/^\/(?!\/)/.test(path)&&!/[\\\x00-\x1f]/.test(path)){
      if(action==="ajax_modal")window.ajax_modal?.(path);
      if(action==="ajax_post_json"&&path.startsWith("/menu/runaction/"))window.ajax_post_json?.(path);
    }
  }
  document.querySelectorAll(".bl-top details[open]").forEach(d=>{if(!d.contains(event.target))d.open=false});
  const anchor=event.target.closest?.('#bl-menu a[href^="#"]');
  if(anchor)window.bootstrap?.Offcanvas.getInstance(document.getElementById("bl-menu"))?.hide();
});
document.addEventListener("keydown",event=>{
  if(event.key==="Escape"){
    const menu=event.target.closest?.("details[open]");
    if(menu){menu.open=false;menu.querySelector("summary")?.focus()}
  }
});
