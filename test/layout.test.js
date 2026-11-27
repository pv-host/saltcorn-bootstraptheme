"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {clean,fields,choices,entries,vars}=require("../options");
const {shell,items,safeURL}=require("../shell");
const {preview}=require("../preview");
const ctx={menu:[{items:[{label:"Kunden",link:"/kunden"}]}],brand:{name:"Firma"},currentUrl:"/kunden"};
test("Alle angebotenen Parameter sind prüfbar und haben gültige Standardwerte",()=>{
  for(const [k,,d,o] of choices){assert.equal(clean()[k],d);for(const [v] of entries(o))assert.equal(clean({[k]:v})[k],v);}
  assert.equal(fields().length,18);
});
test("Layout- und Farbwerte aus Fremdeingaben werden verworfen",()=>{
  const c=clean({columns:'"><script>',primary:'url(x)',container:"bad",font:{name:"Georgia"},size:"1800"});
  assert.equal(c.columns,"3");assert.equal(c.primary,"#0d6efd");assert.equal(c.font,"System");assert.ok(!vars(c).includes("script"));
});
test("Beide Seitenleisten verwenden komplementäre Grid-Spalten und denselben Breakpoint",()=>{
  for(const navigation of ["start","end"])for(const columns of ["2","3","4","5"]){
    const html=shell(clean({navigation,columns,breakpoint:"xl"}),ctx,"A");
    assert.ok(html.includes(`offcanvas-xl col-xl-${columns}`));
    assert.ok(html.includes(`col-xl-${12-columns}`));
    assert.equal(html.includes("flex-xl-row-reverse"),navigation==="end");
  }
});
test("Kopfnavigation und dauerhaft eingeklappte Navigation unterscheiden sich",()=>{
  const top=shell(clean(),ctx,"Text"),drawer=shell(clean({navigation:"drawer"}),ctx,"Text");
  assert.ok(top.includes('class="bl-top d-none d-lg-block"'));
  assert.ok(!drawer.includes("bl-top"));assert.ok(drawer.includes('class="btn bl-toggle"'));
  assert.ok(!shell(clean(),{},'Text').includes('id="bl-menu"'));
});
test("Saltcorn kann die volle Inhaltsbreite anfordern",()=>{
  const html=shell(clean({container:"container-sm",px:"5",py:"2"}),{...ctx,requestFluidLayout:true},"Text");
  assert.ok(html.includes('id="page" class="container-fluid px-5 py-2"'));
});
test("Verschachtelte Menüs, aktiver Eintrag, Suche und erlaubte Saltcorn-Aktionen",()=>{
  const h=items([{label:"Firma",subitems:[{link:"/kunden",label:"<Kunden>"},{type:"Search",label:"Finden"}]},
    {type:"Action",link:"javascript:ajax_post_json('/menu/runaction/status')",label:"Status"}],"/kunden");
  for(const s of ["<details>",'aria-current="page"',"&lt;Kunden&gt;",'action="/search"', 'data-bl-action="ajax_post_json"'])assert.ok(h.includes(s));
  assert.ok(!h.includes('href="javascript:'));assert.equal(safeURL("javascript:alert(1)"),"");assert.equal(safeURL("//example.org"),"");
});
test("Vorschau ist rein lesend und gibt gespeicherte Werte nicht ungefiltert aus",()=>{
  const h=preview(clean({mode:"dark",navigation:"end",primary:"</style>"}));
  assert.ok(h.includes('method="get"'));assert.ok(h.includes('value="end" selected'));assert.ok(!h.includes("</style>"));
});
test("Eigene Farben überschreiben Links und primäre Buttons nur wenn aktiviert",()=>{
  assert.ok(!vars(clean()).includes(".btn-primary{"));
  const css=vars(clean({palette:"custom",primary:"#ffffff",link:"#345678"}));
  assert.ok(css.includes("--bl-ink:#000"));assert.ok(css.includes("--bs-link-color:#345678"));
});
