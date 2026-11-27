"use strict";
const Workflow=require("@saltcorn/data/models/workflow");
const Form=require("@saltcorn/data/models/form");
const db=require("@saltcorn/data/db");
const renderLayout=require("@saltcorn/markup/layout");
const {renderForm}=require("@saltcorn/markup");
const {headersInHead,headersInBody,alert}=require("@saltcorn/markup/layout_utils");
const {name,version}=require("./package.json");
const {clean,fields,vars,esc:e}=require("./options");
const {shell,brand,safeURL}=require("./shell");
const {preview,previewPath}=require("./preview");
const assets=`/plugins/public/${name}@${version}`;
const hints={cardTitleClass:"card-title"};
function documentPage(c,x,body){
  const rtl=!!x.req?.isRTL;
  return `<!doctype html><html lang="${e(x.req?.getLocale?.()||"de")}" dir="${rtl?"rtl":"ltr"}" data-bs-theme="${c.mode}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(x.title)}</title>
<link rel="stylesheet" href="${assets}/bootstrap${rtl?".rtl":""}.min.css"><link rel="stylesheet" href="${assets}/fa/css/all.min.css"><link rel="stylesheet" href="${assets}/layout.css"><style>${vars(c)}</style>${headersInHead(x.headers||[],c.mode==="dark")}</head>
<body class="bg-${c.page} ${e(x.bodyClass||"")}">${body}<script src="/static_assets/${e(db.connectObj.version_tag)}/jquery-3.6.0.min.js"></script><script src="${assets}/bootstrap.bundle.min.js"></script><script src="${assets}/layout.js"></script>${headersInBody(x.headers||[])}</body></html>`;
}
function renderBody(x){
  return renderLayout({blockDispatch:{},hints,req:x.req,role:x.role,alerts:x.alerts||[],layout:x.body??""});
}
function layout(options){
  const c=clean(options);
  return {hints,renderBody,wrap:x=>documentPage(c,x,shell(c,x,renderBody(x))),
    authWrap:x=>{
      const l=x.authLinks||{}, tr=(s)=>x.req?.__(s)||s;
      const link=(url,label)=>safeURL(url)?`<a href="${e(safeURL(url))}">${e(label)}</a>`:"";
      const authLinks=[[l.login,tr("Login")],[l.forgot,tr("Forgot password?")],[l.signup,tr("Create an account")]].map(([u,t])=>link(u,t)).filter(Boolean);
      const providers=(l.methods||[]).map(m=>link(m.url,m.label)).filter(Boolean);
      const body=`<header class="bl-bar text-bg-${c.navColor} px-3 py-2">${brand(x.brand)}</header><main id="page-inner-content" class="container bl-auth py-5"><div class="card mx-auto"><div class="card-body p-4"><h1 class="h3 mb-3">${e(x.title)}</h1>${(x.alerts||[]).map(a=>alert(a.type,a.msg)).join("")}${renderForm(x.form,x.csrfToken)}${providers.length?`<div class="d-grid gap-2 mt-2">${providers.join("")}</div>`:""}<div class="d-flex flex-wrap gap-3 mt-3">${authLinks.join("")}</div>${x.afterForm||""}</div></div></main>`;
      return documentPage(c,x,body);
    }};
}
module.exports={sc_plugin_api_version:1,plugin_name:name,layout,
  configuration_workflow:()=>new Workflow({steps:[{name:"Bootstrap-Layout",form:async()=>new Form({
    blurb:[`<p><a href="${previewPath}" target="_blank" rel="noopener">Layout-Werkstatt öffnen</a> · Gespeicherte Werte laden und Varianten ohne Speichern vergleichen.</p>`],
    saveAndContinueOption:true,fields:fields()})}]}),
  routes:(config)=>[{method:"get",url:previewPath,callback:(req,res)=>{
    res.set("Cache-Control","private, no-store");
    if(req.user?.role_id!==1)return res.status(403).send("Nur für Administratoren.");
    const c=clean({...clean(config),...req.query});
    return res.type("html").send(documentPage(c,{title:"Bootstrap · Layout-Werkstatt",req},preview(c)));
  }}]};
