import { addScript, hackAll, runScript, updateTree } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  updateTree(ns);
  hackAll(ns);
  addScript({ name: 'node.js' }, { name: 'hack.js' });
  runScript(ns);
}