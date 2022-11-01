import { theme } from './wget';

/**
 * @typedef {import('../docs').NS} NS
 * @typedef {Object.<string, {last: string, next: string[]}>} Tree
 * @typedef {{r: number, g: number, b: number}} RGB
 * @typedef {{name: string, n?: number, args?: (string|number|boolean)[], onRun: (id: number)=>void}} Script
 * @typedef {{n: number, onRun: (id: number)=>void, group: Object.<string, {n?: number, args?: (string|number|boolean)[]}>}} ScriptGroup
 */

/** @type {import('./tool').Tree} */
export let tree = null;
/** @type {Object.<string, {}>} */
export const hacked = { 'home': {} };
/** @type {(Script|ScriptGroup)[]} */
export const scripts = [];

/** @param {Script[]|ScriptGroup[]} script */
export function addScript(...script) { scripts.push(...script); }

/** @param {NS} ns */
export function runScript(ns) {
  for (let i = scripts.length - 1; i >= 0; i--) {
    const item = scripts[i];
    if (item.group) {
      const bags = {};
      for (const host in hacked)
        bags[host] = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
      const bids = {};
      for (const [name, { n }] in Object.entries(item.group)) {
        bids[name] = {
          size: ns.getScriptRam(name, 'home'),
          n: n || 1
        }
      }
      const answ = Object.entries(arangeJobs(bags, bids));
      if (answ) {
        if (item.n && item.n != 1) {
          item.n -= 1;
          i++;
        } else {
          scripts.splice(i, 1);
        }
        for (const [host, list] of answ) {
          for (const [name, n] of Object.entries(list)) {
            const args = item.group[name].args
            const id = ns.exec(name, host, n, ...args);
            if (item.onRun) item.onRun(id);
            printHTML(
              `<span style='color:${theme.secondary}'>[${id}]</span>` +
              `<span style='color:${theme.info}'>${name.substring(0, -3)}</span>` +
              `<span style='color:${theme.secondary}'>${args ? ' ' + args.join(' ') : ''}@${host}</span>`
            );
          }
        }
      }
    } else {
      const script = item;
      const name = script.name;
      const args = script.args;
      const mem = ns.getScriptRam(name, 'home');
      /** @type {{name: string, left: number}} */
      let target;
      for (const host in hacked) {
        const ramLeft = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - mem;
        if (ramLeft >= 0 && (!target || ramLeft < target.left)) {
          target = { name: host, left: ramLeft };
        }
      }
      if (target) {
        if (script.n && script.n != 1) {
          script.n -= 1;
          i++;
        } else {
          scripts.splice(i, 1);
        }
        const id = ns.exec(name, target.name, 1, ...args);
        if (script.onRun) script.onRun(id);
        printHTML(
          `<span style='color:${theme.secondary}'>[${id}]</span>` +
          `<span style='color:${theme.info}'>${name.substring(0, -3)}</span>` +
          `<span style='color:${theme.secondary}'>${args ? ' ' + args.join(' ') : ''}@${target.name}</span>`
        );
      }
    }
  }
}

/** 
 * @param {Object.<string, number>} svrs
 * @param {Object.<string, {jobSize: number, jobLeft: number}>} jobs
 * @return {Object.<string, Object.<string, number>>}
 */
function arangeJobs(svrs, jobs) {
  const SVRS = Object.entries(svrs);
  const JOBS = Object.entries(jobs);
  let totalSvrSize = 0;
  let totalJobSize = 0;
  let totalJobNum = 0;
  for (const [, svrSize] of SVRS) totalSvrSize += svrSize;
  for (const [, { jobSize, jobLeft }] of JOBS) { totalJobSize += jobSize * jobLeft; totalJobNum += jobLeft; }
  if (totalSvrSize < totalJobSize) return;
  SVRS.sort((a, b) => b[1] - a[1]);
  JOBS.sort((a, b) => b[1].jobSize - a[1].jobSize);
  let i = 0;
  /** @type {{i: number, job: [string, {jobSize: number, jobLeft: number}], possibleSvr: [string, number][]}[]} */
  let steps = [];
  while (steps.length < totalJobNum) {
    let job = JOBS[i];
    let possibleSvr = [];
    for (const svr of SVRS) {
      if (svr[1] >= job[1].jobSize)
        possibleSvr.push(svr);
    }
    if (possibleSvr.length == 0) {
      let step = steps.pop();
      while (step) {
        step.possibleSvr.shift()[1] += step.job[1].jobSize;
        step.job[1].jobLeft++;
        if (step.possibleSvr.length != 0) break;
        step = steps.pop();
      }
      if (!step) {
        // printHTML(`<span style='color:${theme.errordark}'>Fail to arange jobs.</span>`);
        return;
      }
      i = step.i;
      job = step.job;
      possibleSvr = step.possibleSvr;
    }
    steps.push({ i, job, possibleSvr });
    possibleSvr[0][1] -= job[1].jobSize;
    job[1].jobLeft--;
    if (job[1].jobLeft == 0) {
      i++;
    }
  }

  /** @type {Object.<string, Object.<string, number>>} */
  const answ = {};
  for (const step of steps) {
    const svr = step.possibleSvr[0][0];
    const job = step.job[0];
    if (!answ[svr]) answ[svr] = {};
    if (answ[svr][job] == undefined) answ[svr][job] == 1;
    else answ[svr][job]++;
  }
  return answ;
}

export function hackAll(ns) {
  for (let host in tree) {
    if (hacked[host]) continue;
    if (ns.hasRootAccess(host)) {
      hacked[host] = {};
    } else if (sudo(ns, host)) {
      printHTML(`<span style='color:${theme.success}'>Gain root access of ${host}.</span>`);
      hacked[host] = {};
    }
  }
}

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

/** @param {NS} ns */
export function updateTree(ns) {
  /** @type {Tree} */
  tree = { 'home': {} };
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
}

export function goto(host) {
  let cmd = '';
  while (host != 'home') {
    cmd = `connect ${host};${cmd}`;
    host = tree[host].last;
  }
  execRaw(`home;${cmd}`);
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
  const hn = ns.hacknet;
  let money = ns.getServerMoneyAvailable('home');
  let num_node = hn.numNodes();
  if (money >= hn.getPurchaseNodeCost()) {
    hn.purchaseNode();
    printHTML(`<span style='color:${theme.money}'>+ node${num_node}</span>`);
    return true;
  }
  for (let i = 0; i < num_node; i++) {
    if (money >= hn.getLevelUpgradeCost(i, 1)) {
      hn.upgradeLevel(i, 1);
      printHTML(`<span style='color:${theme.money}'>↑ node${num_node} level</span>`);
      return true;
    }
    if (money >= hn.getRamUpgradeCost(i, 1)) {
      hn.upgradeRam(i, 1);
      printHTML(`<span style='color:${theme.money}'>↑ node${num_node} ram</span>`);
      return true;
    }
    if (money >= hn.getCoreUpgradeCost(i, 1)) {
      hn.upgradeCore(i, 1);
      printHTML(`<span style='color:${theme.money}'>↑ node${num_node} core</span>`);
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
export const getOutput = extra.getOutput;

/** @type {(str:string)=>void} */
export const setInput = extra.input;

/** @type {()=>any} */
export const popOutput = extra.popOutput;

/** @type {(node:import('react').ReactElement)=>void} */
export const printNode = extra.printRaw;

/** @type {(html:string)=>void} */
export const printHTML = (html) => { extra.printRaw(React.createElement('div', { style: { margin: 0 }, dangerouslySetInnerHTML: { __html: html } })); };

/** @type {(str:string)=>void} */
export const execRaw = extra.execRaw;