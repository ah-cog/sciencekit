import {spawn,spawnSync} from 'node:child_process';
import {repo} from './paths.mjs';
import path from 'node:path';
import {existsSync} from 'node:fs';
import {root} from './paths.mjs';
if(existsSync(path.join(root,'.env'))) process.loadEnvFile(path.join(root,'.env'));
const apiPort=process.env.API_PORT || '3000';
const webPort=process.env.WEB_PORT || '8080';
const client=repo('sciencekit-ios');
const build=spawnSync(process.execPath,['scripts/build.js'],{cwd:client,env:{...process.env,SCIENCEKIT_API_URL:'http://localhost:'+apiPort},stdio:'inherit'});
if(build.status!==0) process.exit(build.status || 1);
const children=[];
let stopping=false;
function stop(code=0) { if(stopping) return;stopping=true;for(const child of children) child.kill('SIGTERM');process.exitCode=code; }
for(const [name,cwd,env] of [['server',repo('sciencekit-server'),{CLIENT_DIR:path.join(client,'www'),PORT:apiPort,CLIENT_URL:'http://localhost:'+webPort}],['client',client,{CLIENT_PORT:webPort}]]) {
  const child=spawn(process.execPath,name==='server' ? ['--env-file-if-exists=.env','app.js'] : ['scripts/serve.js'],{cwd,env:{...process.env,...env},stdio:'inherit'});
  children.push(child);
  child.on('error',error=>{console.error(error);stop(1);});
  child.on('exit',code=>{if(!stopping) {console.error(name+' exited ('+code+')');stop(code || 1);}});
}
for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>stop());
