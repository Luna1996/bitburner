import { addScript, hackAll, money, printHTML, runScript, updateTree } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  updateTree(ns);
  hackAll(ns);
  extra.scripts = [];
  addScript({
    n: 1, group: [
      { name: 'weaker.js', n: 1, args: ['n00dles'] },
      { name: 'grower.js', n: 2, args: ['n00dles'] },
    ]
  });
  runScript(ns);
}