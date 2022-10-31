/**
 * @typedef {import('../docs').NS} NS
 * @typedef {Object.<string, {last: string, next: string[], show: boolean}>} Tree
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

export function goto(tree, host) {
  let cmd = '';
  while (host != 'home') {
    cmd = `connect ${host};${cmd}`;
    host = tree[host].last;
  }
  setEnablePrint(false);
  exec(`home;${cmd}`);
  setEnablePrint(true);
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
    { file: 'BruteSSH.exe', port: 'sshPortOpen', hack: ns.brutessh },
    { file: 'FTPCrack.exe', port: 'ftpPortOpen', hack: ns.ftpcrack },
    { file: 'relaySMTP.exe', port: 'smtpPortOpen', hack: ns.relaysmtp },
    { file: 'HTTPWorm.exe', port: 'httpPortOpen', hack: ns.httpworm },
    { file: 'SQLInject.exe', port: 'sqlPortOpen', hack: ns.sqlinject }
  ];
  const s = ns.getServer(host);
  for (const { file, port, hack } of P.slice(0, s.numOpenPortsRequired)) {
    if (!s[port]) {
      if (ns.fileExists(file, 'home')) {
        if (act) hack(host);
      } else {
        return false;
      }
    }
  }
  if (act) ns.nuke(host);
  return true;
}

/** 
 * @param {NS} ns
 * @return {boolean}
 */
export function tryBuyHacknet(ns) {
  const hn = ns.hacknet;
  let money = ns.getServerMoneyAvailable('home');
  let num_node = hn.numNodes();
  if (money >= hn.getPurchaseNodeCost()) {
    ns.hacknet.purchaseNode();
    printHTML(`buy node${num_node}`);
    ns.print(`node${num_node}: new`);
    return true;
  }
  for (let i = 0; i < num_node; i++) {
    if (money >= hn.getLevelUpgradeCost(i, 1)) {
      hn.upgradeLevel(i, 1);
      ns.print(`node${i}: level`);
      return true;
    }
    if (money >= hn.getRamUpgradeCost(i, 1)) {
      hn.upgradeRam(i, 1);
      ns.print(`node${i}: ram`);
      return true;
    }
    if (money >= hn.getCoreUpgradeCost(i, 1)) {
      hn.upgradeCore(i, 1);
      ns.print(`node${i}: core`);
      return true;
    }
  }
  return false;
}

/** @type {()=>any[]} */
export const outputs = extra.outputs;

/** @type {(str:string)=>void} */
export const setInput = extra.input;

/** @type {()=>any} */
export const popOutput = extra.popOutput;

/** @type {(node:import('react').ReactElement)=>void} */
export const printNode = extra.printRaw;

/** @type {(html:string)=>void} */
export const printHTML = (html) => { extra.printRaw(React.createElement('div', { style: { margin: 0 }, dangerouslySetInnerHTML: { __html: html } })); };

/** @type {(str:string)=>void} */
export const exec = extra.exec;

/** @type {(isEnable:boolean)=>void} */
export const setEnablePrint = extra.setEnablePrint;