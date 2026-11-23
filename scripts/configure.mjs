import {writeFileSync,existsSync} from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import {repo,root} from './paths.mjs';
const target=path.join(root,'.env');
if(existsSync(target)) {console.log('Preserved existing .env');process.exit(0);}
writeFileSync(target,['SERVER_DIR='+repo('sciencekit-server'),'CLIENT_DIR='+repo('sciencekit-ios'),'SESSION_SECRET='+crypto.randomBytes(32).toString('hex'),''].join('\n'),{mode:0o600});
console.log('Configured Compose build paths and a local session secret.');
