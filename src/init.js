import { addScript, execRaw, hackAll, runScript, updateTree } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  execRaw('alias main="run main.js"');
  execRaw('alias tree="run tree.js"');
  execRaw('alias goto="run goto.js"');
  execRaw('alias test="run test.js"');
  execRaw('alias theme="run theme.js"');

  addScript({ name: 'main.js' }, { name: 'node.js' }, { name: 'hack.js' });

  ns.atExit(() => {
    updateTree(ns);
    hackAll(ns);
    runScript(ns);
  });
}