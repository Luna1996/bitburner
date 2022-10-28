import { exec, getTree, goto, printNode, setInput, sudo } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  const tree = getTree(ns);
  const theme = ns.ui.getTheme();

  /** 
   * @param {string} host
   * @param {string} pref
   * @return {import('react').ReactNode}
  */
  function createTree(host, pref = '') {
    const item = [pref, React.createElement('span', {
      dataName: host,
      style: { color: ns.hasRootAccess(host) ? theme.success : (sudo(ns, host, false) ? theme.successdark : theme.secondary) },
      onClick: () => goto(tree, host)
    }, host), '\n'];
    pref = pref.replaceAll('├─', '│ ').replaceAll('└─', '  ');
    const next = tree[host].next;
    if (next.length > 0) {
      for (let node of next.slice(0, -1)) {
        item.push(createTree(node, pref + '├─'));
      }
      item.push(createTree(next[next.length - 1], pref + '└─'));
    }
    return item;
  }

  printNode(React.createElement('p', { style: { margin: 0, lineHeight: 1, userSelect: 'none' } }, createTree('home')));
}
