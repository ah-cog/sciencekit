import {spawnSync} from 'node:child_process';
import {repo} from './paths.mjs';
for(const name of ['sciencekit-server','sciencekit-ios']) {
  const result=spawnSync('npm',['ci'],{cwd:repo(name),stdio:'inherit'});
  if(result.status!==0) process.exit(result.status || 1);
}
