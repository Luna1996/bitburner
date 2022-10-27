import { getTree } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  window.tree = getTree(ns);
  let html = '';

  /** 
   * @param {string} host
   * @param {string} pref
  */
  function printTree(host, pref = '') {
    html += `${pref}${host}\n`;
    pref = pref.replaceAll('├─', '│&nbsp;')
    pref = pref.replaceAll('└─', '&nbsp;&nbsp;')
    const next = window.tree[host].next;
    if (next.length == 0) return;
    for (let node of next.slice(0, -1)) {
      printTree(node, pref + '├─');
    }
    printTree(next[next.length - 1], pref + '└─')
  }

  printTree('home');
  ns.alert(`<p style='line-height:1;user-select:none;'>${html}</p>`);
}
