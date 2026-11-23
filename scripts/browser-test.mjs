import {existsSync} from 'node:fs';
import {spawn} from 'node:child_process';
import path from 'node:path';
import {repo,root} from './paths.mjs';
if(existsSync(path.join(root,'.env'))) process.loadEnvFile(path.join(root,'.env'));
const child=spawn(process.execPath,['tests/browser.cjs'],{cwd:repo('sciencekit-ios'),stdio:'inherit',env:{...process.env,API_URL:'http://localhost:'+(process.env.API_PORT || 3000),WEB_URL:'http://localhost:'+(process.env.WEB_PORT || 8080)}});
child.on('error',error=>{console.error(error.message);process.exitCode=1;});
child.on('exit',code=>{process.exitCode=code || 0;});
