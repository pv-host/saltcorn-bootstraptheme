"use strict";
const {esc:e}=require("./options");
function safeURL(s) {
  if(typeof s!=="string" || /[\x00-\x20\\]/.test(s.trim())||s.trim().startsWith("//"))return "";
  const v=s.trim();
  return /^(?:https?:\/\/|mailto:|tel:)/i.test(v)|| !/^[a-z][a-z0-9+.-]*:/i.test(v)?v:"";
}
function items(list,url) {
  return (list||[]).map(i=>{
    const t=e(i.label), title=e(i.tooltip||i.label||"Menüpunkt");
    const icon=i.icon&&/^[a-z0-9 -]+$/i.test(i.icon)&&i.icon!=="empty"?`<i aria-hidden="true" class="${e(i.icon)}"></i> `:"";
    const label=icon+t;
    if(i.type==="Separator")return '<li aria-hidden="true"><hr class="my-2"></li>';
    if(i.type==="Search")return `<li><form action="/search" method="get" class="px-2"><input class="form-control form-control-sm" type="search" name="q" placeholder="${title}" aria-label="${title}"></form></li>`;
    if(i.subitems?.length)return `<li class="bl-group"><details><summary class="bl-item">${label}</summary><ul class="bl-sub list-unstyled">${items(i.subitems,url)}</ul></details></li>`;
    const special=typeof i.link==="string" && i.link.match(/^javascript:(ajax_modal|ajax_post_json)\('(\/[^'\\\x00-\x1f]*)'\)$/);
    if(special&&!special[2].startsWith("//")&&((special[1]==="ajax_modal"&&i.in_modal)||(special[1]==="ajax_post_json"&&i.type==="Action"&&special[2].startsWith("/menu/runaction/"))))return `<li><button type="button" class="bl-item" data-bl-action="${special[1]}" data-bl-path="${e(special[2])}">${label}</button></li>`;
    const href=safeURL(i.link);
    if(!href)return "";
    const active=href===url || (href!=="/"&&url?.startsWith(href+"/"))||(i.altlinks||[]).includes(url);
    return `<li><a class="bl-item${active?" bl-active":""}" ${active?'aria-current="page" ':''}href="${e(href)}" title="${title}"${i.target_blank?' target="_blank" rel="noopener noreferrer"':""}>${label}</a></li>`;
  }).join("");
}
function brand(b={}) {
  const logo=safeURL(b?.logo);
  return `<a class="bl-brand" href="/">${logo?`<img src="${e(logo)}" alt="">`:""}${e(b?.name||"Saltcorn")}</a>`;
}
function shell(c,ctx,body) {
  const nav=(ctx.menu||[]).flatMap(s=>s.items||[]);
  const bar=!!ctx.brand || !!ctx.menu;
  const top=c.navigation==="top", drawer=c.navigation==="drawer", side=bar&&!top&&!drawer;
  const bp=c.breakpoint, end=c.navigation==="end", width=ctx.requestFluidLayout?"container-fluid":c.container;
  const links=items(nav,ctx.currentUrl);
  const menu=`<ul class="bl-links list-unstyled m-0">${links}</ul>`;
  const trigger=`<button class="btn bl-toggle${drawer?"":` d-${bp}-none`}" type="button" data-bs-toggle="offcanvas" data-bs-target="#bl-menu" aria-controls="bl-menu" aria-label="Navigation öffnen"><span aria-hidden="true">☰</span> Menü</button>`;
  const header=bar?`<header class="bl-bar text-bg-${c.navColor} ${c.pin==="sticky"?"sticky-top":""}"><div class="${width} px-${c.px} d-flex align-items-center justify-content-between gap-2 py-2">${brand(ctx.brand)}${top?`<nav aria-label="Hauptnavigation" class="bl-top d-none d-${bp}-block">${menu}</nav>`:""}${trigger}</div></header>`:"";
  const off=`<aside id="bl-menu" aria-labelledby="bl-nav-title" tabindex="-1" class="${side?`offcanvas-${bp} col-${bp}-${c.columns}`:"offcanvas"} offcanvas-${end?"end":"start"}"><div class="offcanvas-header"><h2 id="bl-nav-title" class="h5 mb-0">Navigation</h2><button class="btn-close" type="button" data-bs-dismiss="offcanvas" data-bs-target="#bl-menu" aria-label="Schließen"></button></div><div class="offcanvas-body"><nav aria-label="Seitennavigation" class="bl-aside w-100">${menu}</nav></div></aside>`;
  const main=`<main id="bl-main" tabindex="-1" class="bl-content ${side?`col-12 col-${bp}-${12-Number(c.columns)}`:"w-100"}"><div id="page-inner-content">${body}</div></main>`;
  return `<a class="visually-hidden-focusable" href="#bl-main">Zum Inhalt</a>${header}<div id="page" class="${width} px-${c.px} py-${c.py}">${side?`<div class="row mx-0 gx-${c.gutter} ${end?`flex-${bp}-row-reverse`:""}">${off}${main}</div>`:main}</div>${bar&&!side?off:""}`;
}
module.exports={shell,brand,items,safeURL};
