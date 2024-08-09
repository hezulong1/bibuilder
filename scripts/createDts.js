import path from 'node:path';
import fs from 'fs-extra';

const resolve = (dir = '.') => path.join('.', dir);

const INPUT = resolve('node_modules/@vscode/codicons/src/template/mapping.json');
const OUTPUT = resolve('src/ui/codicons.d.ts');

const mapping = fs.readJSONSync(INPUT);
const icons = Object.keys(mapping).map(i => `  | '${i}'`).join('\n');

const code = `
// Auto-Generated
// DON'T EDIT THIS!!!

declare type Codicon =
${icons};
`.trimStart();

fs.removeSync(OUTPUT);
fs.writeFileSync(OUTPUT, code, 'utf8');
