import { getTree } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();
  let tree = getTree(ns);
  printTree('home', 0);

  /** 
   * @param {string} host
   * @param {number} deep
  */
  function printTree(host, deep) {
    ns.print(`${' '.repeat(deep)}${host}`);
    for (let next of tree[host].next) {
      printTree(next, deep + 1);
    }
  }
}
