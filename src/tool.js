/**
 * @typedef {import('../docs').NS} NS
 * @typedef {Object.<string, {last: string, next: string[]}>} Tree
 * @typedef {{r:number, g:number, b:number}} RGB
 */

/**
 * @param {string} hex
 * @return {RGB}
*/
export function hexToRgb(hex) {
  if (hex.length == 4) {
    return {
      r: parseInt(hex.charAt(1).repeat(2), 16),
      g: parseInt(hex.charAt(2).repeat(2), 16),
      b: parseInt(hex.charAt(3).repeat(2), 16),
    };
  }
  else if (hex.length == 7) {
    return {
      r: parseInt(hex.substring(1, 3), 16),
      g: parseInt(hex.substring(3, 5), 16),
      b: parseInt(hex.substring(5, 7), 16),
    };
  }
  throw 'Wrong HEX color format!';
}

/**
 * @param {RGB} rgb
 * @return {number}
*/
export function rgbToGray(rgb) { return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b; }

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

export function _cnct(tree, host) {
  let cmd = '';
  while (host != 'home') {
    cmd = `connect ${host};${cmd}`;
    host = tree[host].last;
  }
  _setEnablePrint(false);
  _exec(`home;${cmd}`);
  _setEnablePrint(true);
}

/** 
 * @param {NS} ns
 * @param {string} host
 * @param {boolean} act
 * @return {boolean}
 */
export function sudo(ns, host, act = true) {
  if (ns.hasRootAccess(host)) return true;
  const P = [
    { file: 'BruteSSH.exe', port: 'sshPortOpen', prog: ns.brutessh },
    { file: 'FTPCrack.exe', port: 'ftpPortOpen', prog: ns.ftpcrack },
    { file: 'relaySMTP.exe', port: 'smtpPortOpen', prog: ns.relaysmtp },
    { file: 'HTTPWorm.exe', port: 'httpPortOpen', prog: ns.httpworm },
    { file: 'SQLInject.exe', port: 'sqlPortOpen', prog: ns.sqlinject }
  ];
  const s = ns.getServer(host);
  for (const { file, port, prog } of P.slice(0, s.numOpenPortsRequired)) {
    if (!s[port]) {
      if (ns.fileExists(file, 'home')) {
        if (act) prog(host);
      } else {
        return false;
      }
    }
  }
  if (act) {
    ns.nuke(host);
    ns.scp(ns.ls('home', '.js'), host, 'home');
  }
  return true;
}

/** 
 * @param {NS} ns
 * @return {boolean}
 */
export function tryUpgradeHacknetNode(ns) {
  const hn = ns.prognet;
  const theme = ns.ui.getTheme();
  let money = ns.getServerMoneyAvailable('home');
  let num_node = hn.numNodes();
  if (money >= hn.getPurchaseNodeCost()) {
    ns.prognet.purchaseNode();
    _printHTML(`<span style='color:${theme.money}'>+ node${num_node}</span>`);
    return true;
  }
  for (let i = 0; i < num_node; i++) {
    if (money >= hn.getLevelUpgradeCost(i, 1)) {
      hn.upgradeLevel(i, 1);
      _printHTML(`<span style='color:${theme.money}'>↑ node${num_node} level</span>`);
      return true;
    }
    if (money >= hn.getRamUpgradeCost(i, 1)) {
      hn.upgradeRam(i, 1);
      _printHTML(`<span style='color:${theme.money}'>↑ node${num_node} ram</span>`);
      return true;
    }
    if (money >= hn.getCoreUpgradeCost(i, 1)) {
      hn.upgradeCore(i, 1);
      _printHTML(`<span style='color:${theme.money}'>↑ node${num_node} core</span>`);
      return true;
    }
  }
  return false;
}

/**
 * @param {number} n
 * @return {str}
 */
export function money(n) {
  if (n < 1000) return `$${n}`;
  if (n < 1000000) return `$${n / 1000}k`;
  if (n < 1000000000) return `$${n / 1000000}b`
}

/** @type {()=>any[]} */
export const _getOutputs = extra.outputs;

/** @type {(str:string)=>void} */
export const _setInput = extra.input;

/** @type {()=>any} */
export const _popOutput = extra.popOutput;

/** @type {(node:import('react').ReactElement)=>void} */
export const _printNode = extra.printRaw;

/** @type {(html:string)=>void} */
export const _printHTML = (html) => { extra.printRaw(React.createElement('div', { style: { margin: 0 }, dangerouslySetInnerHTML: { __html: html } })); };

/** @type {(str:string)=>void} */
export const _exec = extra['exec'];

/** @type {(isEnable:boolean)=>void} */
export const _setEnablePrint = extra.setEnablePrint;