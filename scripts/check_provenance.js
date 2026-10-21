// Compara los datos de la página entre la rama base y HEAD; falla si un dato cambió sin cambiar su origen.
// Uso: node scripts/check_provenance.js [rama base, por defecto origin/main]
const {execFileSync}=require('child_process');const fs=require('fs');const os=require('os');const path=require('path');
const {isDeepStrictEqual}=require('util');
const {ROOT,DATA_CONSTS,dataConsts,read}=require('../tests/lib/page.js');
const {unexplained}=require('../tests/lib/provenance.js');
const base=process.argv[2]||'origin/main';
const git=(...a)=>execFileSync('git',a,{cwd:ROOT,encoding:'utf8'}).trim();

const changedFiles=git('diff','--name-only',`${base}...HEAD`).split('\n').filter(Boolean);
const wt=fs.mkdtempSync(path.join(os.tmpdir(),'visor-base-'));
try{
  git('worktree','add','--detach',wt,git('merge-base',base,'HEAD'));
  fs.symlinkSync(path.join(ROOT,'node_modules'),path.join(wt,'node_modules'));
  execFileSync(process.execPath,['scripts/build.js'],{cwd:wt,stdio:'ignore'});
  const before=dataConsts(read(path.join(wt,'dist/index.html'))),after=dataConsts(read(path.join(ROOT,'dist/index.html')));
  const changed=DATA_CONSTS.filter(c=>!isDeepStrictEqual(before[c],after[c]));
  const errors=unexplained(changed,changedFiles);
  console.log('Constantes cambiadas:',changed.join(', ')||'ninguna');
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
}finally{git('worktree','remove','--force',wt);}
