"use strict";
const variants = ["primary","secondary","success","danger","warning","info","light","dark"];
const points = ["sm","md","lg","xl","xxl"];
const scale = ["0","1","2","3","4","5"];
const fonts = {System:"system-ui, sans-serif", Arial:"Arial, Helvetica, sans-serif", Verdana:"Verdana, sans-serif", Georgia:"Georgia, serif", Monospace:"ui-monospace, monospace"};
// One schema drives defaults, the Saltcorn form and the read-only preview.
const choices = [
  ["navigation","Navigation","top",{top:"Kopfnavigation",start:"Seitenleiste am Anfang (links bei LTR)",end:"Seitenleiste am Ende (rechts bei LTR)",drawer:"Offcanvas auf allen Bildschirmgrößen"}],
  ["breakpoint","Navigation ab diesem Breakpoint ausklappen","lg",points],
  ["container","Inhaltsbreite","container-fluid",["container","container-fluid",...points.map(p=>"container-"+p)]],
  ["columns","Seitenleiste: Anteil am 12-Spalten-Raster","3",["2","3","4","5"]],
  ["pin","Kopfzeile beim Scrollen","static",{static:"Mitscrollend",sticky:"Oben halten (sticky-top)"}],
  ["gutter","Spaltenabstand (gx-*)","3",scale],
  ["px","Innenabstand horizontal (px-*)","3",scale],
  ["py","Innenabstand vertikal (py-*)","3",scale],
  ["mode","Bootstrap-Farbmodus","light",{light:"Hell",dark:"Dunkel"}],
  ["navColor","Farbe der Kopfzeile","dark",variants],
  ["page","Seitenhintergrund","body",["body","body-secondary","body-tertiary"]],
  ["radius","Karten: Ecken (rounded-*)","2",scale],
  ["shadow","Karten: Schatten","shadow-sm",["shadow-none","shadow-sm","shadow","shadow-lg"]],
  ["font","Schriftart","System",Object.keys(fonts)],
  ["size","Basis-Schriftgröße (px bei Browserstandard)","16",Array.from({length:13},(_,i)=>String(i+12))],
  ["palette","Primärfarbe und Links","bootstrap",{bootstrap:"Bootstrap-Standard",custom:"Eigene Farben"}],
];
const colors = [["primary","Primärfarbe","#0d6efd"],["link","Linkfarbe","#0a58ca"]];
const entries = (o)=>Array.isArray(o)?o.map(s=>[s,s]):Object.entries(o);
function clean(src={}) {
  const out={};
  for (const [k,,d,o] of choices) out[k]=entries(o).some(([v])=>v===src?.[k])?src[k]:d;
  for (const [k,,d] of colors) out[k]=typeof src?.[k]==="string" && /^#[0-9a-f]{6}$/i.test(src[k])?src[k]:d;
  return out;
}
function fields() {
  return [...choices.map(([name,label,def,o])=>({name,label,default:def,type:"String",required:true,
    attributes:{options:entries(o).map(([name,label])=>({name,label}))}})),
    ...colors.map(([name,label,def])=>({name,label,default:def,type:"Color",showIf:{palette:"custom"}}))];
}
const esc = (s)=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
function vars(c) {
  const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
  const l=rgb(c.primary).map(v=>v/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
  const ink=l[0]*0.2126+l[1]*0.7152+l[2]*0.0722>0.17913?"#000":"#fff";
  return `html:root{font-size:${Number(c.size)*6.25}%;--bs-body-font-family:${fonts[c.font]};${c.palette==="custom"?`--bs-primary:${c.primary};--bs-primary-rgb:${rgb(c.primary)};--bs-link-color:${c.link};--bs-link-color-rgb:${rgb(c.link)};--bs-link-hover-color:${c.link};--bs-link-hover-color-rgb:${rgb(c.link)};--bl-ink:${ink}`:""}}`+
  `.bl-content .card,.bl-auth .card{--bs-card-border-radius:var(--bs-border-radius${["-0","-sm","","-lg","-xl","-xxl"][+c.radius]},0);border-radius:var(--bs-card-border-radius);box-shadow:${({"shadow-none":"none","shadow-sm":"var(--bs-box-shadow-sm)","shadow":"var(--bs-box-shadow)","shadow-lg":"var(--bs-box-shadow-lg)"})[c.shadow]}}`+
  (c.palette==="custom"?`.btn-primary{--bs-btn-bg:var(--bs-primary);--bs-btn-border-color:var(--bs-primary);--bs-btn-color:var(--bl-ink);--bs-btn-hover-bg:var(--bs-primary);--bs-btn-hover-border-color:var(--bs-primary);--bs-btn-hover-color:var(--bl-ink);--bs-btn-active-bg:var(--bs-primary);--bs-btn-active-color:var(--bl-ink);--bs-btn-active-border-color:var(--bs-primary);--bs-btn-disabled-bg:var(--bs-primary);--bs-btn-disabled-border-color:var(--bs-primary);--bs-btn-disabled-color:var(--bl-ink);--bs-btn-focus-shadow-rgb:var(--bs-primary-rgb)}.btn-primary:hover{text-decoration:underline}.bl-bar.text-bg-primary{color:var(--bl-ink)!important}`:"");
}
module.exports={choices,colors,entries,clean,fields,esc,vars};
