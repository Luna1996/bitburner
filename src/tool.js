/**
 * @typedef {import('../docs').NS} NS
 * @typedef {Object.<string, {last: string, next: string[], show: boolean}>} Tree
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

/** @type {(str:string)=>void} */
export const setInput = extra.input;

/** @type {(str:string)=>void} */
export const exec = extra.exec;

/** @type {(node:import('react').ReactElement)=>void} */
export const printNode = extra.printRaw;

/** @type {(html:string)=>void} */
export const printHTML = (html) => { extra.printRaw(React.createElement('div', { style: { margin: 0 }, dangerouslySetInnerHTML: { __html: html } })); };

/** @type {(isEnable:boolean)=>void} */
export const setEnablePrint = extra.setEnablePrint;