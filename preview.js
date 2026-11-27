"use strict";
const {choices,colors,entries,esc:e}=require("./options");
const {shell}=require("./shell");
const previewPath="/bootstrap-layout/werkstatt";
function preview(c){
  const context={brand:{name:"Layout-Werkstatt"},menu:[{items:[{label:"Musterseite",link:"#muster"},{label:"Parameter",link:"#parameter"},{label:"Farbmuster",link:"#farben"}]}]};
  const controls=choices.map(([k,l,,o])=>`<label class="col-sm-6 col-xl-4 form-label">${e(l)}<select class="form-select" name="${k}">${entries(o).map(([v,t])=>`<option value="${v}"${c[k]===v?" selected":""}>${e(t)}</option>`).join("")}</select></label>`).join("")+colors.map(([k,l])=>`<label class="col-sm-6 col-xl-4 form-label">${e(l)} (eigene Palette)<input type="color" class="form-control form-control-color" name="${k}" value="${c[k]}"></label>`).join("");
  const body=`<div id="muster" class="mb-4"><p class="text-uppercase text-body-secondary small fw-semibold mb-1">Bootstrap / Gestaltung</p><h1>Layout-Werkstatt</h1><p>Dies ist eine isolierte Musterseite. Oben oder seitlich siehst du die gewählte Navigation. Änderungen hier bleiben auf die Vorschau beschränkt.</p></div>
  <section class="card mb-4" id="farben"><div class="card-body"><h2 class="h5">Musteransicht</h2><p>So erscheinen Fließtext, <a href="#parameter">Links</a>, Karten und Aktionen im gewählten Layout.</p><div class="d-flex gap-2 flex-wrap"><a class="btn btn-primary" href="#parameter">Parameter ansehen</a><span class="badge text-bg-success align-self-center">Freigegeben</span></div></div></section>
  <section id="parameter" class="card"><div class="card-body"><h2 class="h4">Bootstrap-Parameter</h2><form action="${previewPath}" method="get"><div class="row g-3">${controls}</div><div class="d-flex align-items-center flex-wrap gap-3 mt-3"><button class="btn btn-primary">Vorschau aktualisieren</button><a href="${previewPath}">Gespeicherten Stand laden</a><a href="/plugins/configure/saltcorn-bootstrap-layout">Zur Plugin-Konfiguration</a></div></form></div></section>`;
  return shell(c,context,body);
}
module.exports={preview,previewPath};
