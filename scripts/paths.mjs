import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
// Both recursive clones and the requested three-sibling layout are supported.
export function repo(name) {
  const nested=path.join(root,name);
  if(existsSync(path.join(nested,'package.json'))) return nested;
  const sibling=path.resolve(root,'..',name);
  if(existsSync(path.join(sibling,'package.json'))) return sibling;
  throw new Error('Missing '+name+'. Run git submodule update --init --recursive.');
}
