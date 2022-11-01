import { getTree, money, popOutput, printNode, sudo } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  popOutput();
  const tree = getTree(ns);
  const theme = ns.ui.getTheme();
  const hlv = ns.getHackingLevel();

  /** 
   * @param {string} host
   * @param {string} pref
   * @return {import('react').ReactNode}
  */
  function createTree(host, pref = '') {
    const root = ns.hasRootAccess(host);
    const canRoot = sudo(ns, host, false)
    const shlv = ns.getServerRequiredHackingLevel(host);
    const item = [
      pref,
      React.createElement('span', {
        style: { color: root ? theme.success : (canRoot ? theme.primary : theme.secondary) },
        onClick: () => cnct(tree, host)
      }, host),
      canRoot && React.createElement('span', { style: { color: theme.secondary } }, ` ${ns.getServerMaxRam(host)}G`),
      hlv < shlv && canRoot && React.createElement('span', { style: { color: theme.error } }, ` Lv.${shlv}`),
      hlv >= shlv && canRoot && host != 'home' && React.createElement('span', { style: { color: theme.money } }, ` ${money(ns.getServerMaxMoney(host))}`),
      '\n'];
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

  printNode(React.createElement('p', { style: { margin: 0, userSelect: 'none' } }, createTree('home')));
}
