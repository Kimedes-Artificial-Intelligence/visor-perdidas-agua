const fs=require('fs');
const t=require('es-atlas/es/municipalities.json');
const cat=t.objects.municipalities.geometries.filter(g=>/^(08|17|25|43)/.test(g.id)).map(g=>({ine:g.id,name:g.properties.name}));
const norm=s=>{s=s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[’`]/g,"'").trim();
  const m=s.match(/^(.*),\s*(el|la|les|els|l'|l)$/); if(m) s=m[2].replace(/^l$/,"l'")+(m[2].endsWith("'")||m[2]==='l'?'':' ')+m[1];
  return s.replace(/l' /g,"l'").replace(/[-'\s.]+/g,' ').replace(/\b(el|la|les|els|l)\b/g,'').replace(/\s+/g,' ').trim();};
const idx={}; for(const m of cat){(idx[norm(m.name)]??=[]).push(m);}
// manual aliases (old names / spellings)
const alias={'calonge':'Calonge i Sant Antoni','sant carles de rapita':'la Ràpita','rapita':'la Ràpita','vilaseca':'Vila-seca','palamos mont ras':null,'salou vila seca':null};
function find(name){let k=norm(name); if(alias[k]!==undefined){if(alias[k]===null)return null;k=norm(alias[k]);} const r=idx[k]; return r&&r.length===1?r[0]:null;}
module.exports={cat,norm,find,idx};
if(require.main===module){
 console.log('es-atlas cat',cat.length,'dup keys',Object.entries(idx).filter(([k,v])=>v.length>1).map(([k,v])=>v.map(x=>x.name+':'+x.ine).join('/')));
 for(const f of process.argv.slice(2)){const L=fs.readFileSync(f,'utf8').trim().split('\n').filter(l=>!l.startsWith('#'));let ok=0,miss=[];
  for(const l of L){const p=l.split('|');const nm=f.includes('powerbi')?p[1]:p[0];const m=find(nm);if(m)ok++;else miss.push(nm);}
  console.log(f,L.length,'ok',ok,'miss',miss);}
}
