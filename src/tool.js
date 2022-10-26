/**
 * @typedef {import('../docs').NS} NS
 * @typedef {Object.<string, {last: string, next: string[]}>} Tree
 */

/**
 * @param {NS} ns
 * @return {Tree}
*/
export function getTree(ns) {
  /** @type {Tree} */
  let tree = { 'home': {} };
  let more = ['home'];
  while (more.length != 0) {
    let host = more.shift();
    /** @type {string[]} */
    let next = [];
    let scan = ns.scan(host);
    for (let node of scan) {
      if (!tree.hasOwnProperty(node)) {
        tree[node] = { last: host };
        next.push(node);
        if (!more.includes(node)) {
          more.push(node);
        }
      }
    }
    tree[host].next = next;
  }
  return tree;
}