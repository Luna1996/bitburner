/**
 * @typedef {import('../docs').NS} NS
 * @typedef {Object.<string, {last: string, next: string[]}>} Tree
 * @typedef {{r: number, g: number, b: number}} RGB
 * @typedef {{name: string, n?: number, args?: (string|number|boolean)[], onRun?: (id: number)=>void}} Script
 * @typedef {{n: number, group: Script[]}} ScriptGroup
 */

/** @type {Tree} */
extra.tree = extra.tree ?? null;
/** @type {Object.<string, {}>} */
extra.hacked = extra.hacked ?? { 'home': {} };
/** @type {(Script|ScriptGroup)[]} */
extra.scripts = extra.scripts ?? [];

/** @param {Script[]|ScriptGroup[]} list */
export function addScript(...list) {
  for (const item of list) {
    item.n = item.n ?? 1;
    if (item.group) {
      for (const one of item.group) {
        one.n = one.n ?? 1;
      }
    }
  }
  extra.scripts.push(...list);
}

/** @param {NS} ns */
export function runScript(ns) {
  const time = new Date().getTime();
  let step = 0;
  const theme = ns.ui.getTheme();
  for (let i = extra.scripts.length - 1; i >= 0; i--) {
    const item = extra.scripts[i];
    if (item.group) {
      const answ = fillJobs(ns, item.group);
      if (answ) {
        item.n--;
        if (item.n > 0) {
          i++;
        } else {
          extra.scripts.splice(i, 1);
        }
        for (const { svrName: host, script: { name, n, args, onRun } } of answ) {
          const id = ns.exec(name, host, n, `${time}@${step++}`, ...(args ?? []));
          if (id == 0) { ns.tail(); }
          if (onRun) onRun(id);
          printHTML(
            `<span style='color:${theme.secondary}'>`
            + `[${id}] `
            + `${name}`
            + `${n && n != 1 ? ` ${n}` : ''}`
            + `${args ? ' ' + args.join(' ') : ''} `
            + `@${host}` +
            `</span>`);
        }
      }
    } else {
      /** @type {Script} */
      const script = item;
      const name = script.name;
      const args = script.args;
      const ram = ns.getScriptRam(name, 'home');
      for (const host in extra.hacked) {
        const ramLeft = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
        if (ramLeft >= ram) {
          const n = Math.min(script.n, Math.floor(ramLeft / ram));
          const id = ns.exec(name, host, n, `${time}@${step++}`, ...(args ?? []));
          if (id == 0) { break; }
          if (script.onRun) { script.onRun(id); }
          printHTML(
            `<span style='color:${theme.secondary}'>`
            + `[${id}] `
            + `${name}`
            + `${n && n != 1 ? ` ${n}` : ''}`
            + `${args ? ' ' + args.join(' ') : ''} `
            + `@${host}` +
            `</span>`);
          script.n -= n;
          if (script.n == 0) { extra.scripts.splice(i, 1); break; }
        }
      }
    }
  }
}

/** 
 * @param {NS} ns
 * @param {Script[]} scripts
 * @return {{svrName: string, script: Script}[]}
 */
function fillJobs(ns, scripts) {
  /** @typedef {{svrName: string, svrRam: number}} Svr */
  /** @typedef {{jobName: string, jobRam: number, jobLeft: number}} Job */
  /** @typedef {{jobName: string, jobIndex: number, svrNames: string[], svrIndex: number}} Step */

  /** @type {Svr[]} */
  const svrList = [];
  /** @type {Object.<string, Svr>} */
  const svrMap = {};
  let totalSvrRam = 0;
  for (const svrName in extra.hacked) {
    const svrRam = ns.getServerMaxRam(svrName) - ns.getServerUsedRam(svrName);
    if (svrRam > 0) {
      const svr = { svrName, svrRam };
      svrList.push(svr);
      svrMap[svrName] = svr;
      totalSvrRam += svrRam;
    }
  }

  /** @type {Job[]} */
  const jobList = [];
  /** @type {Object.<string, Job>} */
  const jobMap = {};
  /** @type {Object.<string, Script>} */
  const scriptMap = {};
  let totalJobRam = 0;
  let totalJobNum = 0;
  for (const script of scripts) {
    const { name: jobName, n: jobLeft } = script;
    scriptMap[jobName] = script;
    const jobRam = ns.getScriptRam(jobName, 'home');
    const job = { jobName, jobRam, jobLeft }
    jobList.push(job);
    jobMap[jobName] = job;
    totalJobRam += jobRam * jobLeft;
    totalJobNum += jobLeft;
  }

  if (totalSvrRam < totalJobRam) { return; }

  jobList.sort((a, b) => b.jobRam - a.jobRam);

  let jobIndex = 0;
  /** @type {Step[]} */
  let steps = [];
  while (steps.length < totalJobNum) {
    const job = jobList[jobIndex];

    /** @type {string[]} */
    const svrNames = [];
    svrList.sort((a, b) => a.svrRam - b.svrRam);
    for (const svr of svrList) {
      if (svr.svrRam >= job.jobRam) {
        svrNames.push(svr.svrName);
      }
    }

    if (svrNames.length == 0) {
      do {
        let step = steps[steps.length - 1];
        if (!step) { return; }
        const job = jobMap[step.jobName]
        svrMap[step.svrNames[step.svrIndex]].svrRam += job.jobRam;
        step.svrIndex--;
        if (step.svrIndex >= 0) {
          jobIndex = step.jobIndex;
          svrMap[step.svrNames[step.svrIndex]].svrRam -= job.jobRam;
          break;
        }
        job.jobLeft++;
        steps.pop();
      } while (true)
    } else {
      const svrIndex = svrNames.length - 1;
      const svr = svrMap[svrNames[svrIndex]];
      svr.svrRam -= job.jobRam;
      job.jobLeft--;
      if (job.jobLeft == 0) jobIndex++;
      steps.push({ jobIndex, jobName: job.jobName, svrNames, svrIndex });
    }
  }

  /** @type {Object.<string, Object.<string, number>>} */
  const answ = {};
  for (const step of steps) {
    const svrName = step.svrNames[step.svrIndex];
    const jobName = step.jobName;
    const svr = svrMap[svrName];
    svr.svrRam -= jobMap[jobName].jobRam;
    if (!answ[svrName]) answ[svrName] = {};
    if (!answ[svrName][jobName]) answ[svrName][jobName] = 1;
    else answ[svrName][jobName]++;
  }

  /** @type {{svrName: string, script: Script}[]} */
  const list = [];
  for (const [svrName, many] of Object.entries(answ)) {
    for (const [name, n] of Object.entries(many)) {
      list.push({ svrName, script: { ...scriptMap[name], n } })
    }
  }
  return list;
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
  printHTML('Updating the Tree;');
  /** @type {Tree} */
  const tree = { 'home': {} };
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
  extra.tree = tree;
}

export function goto(host) {
  let cmd = '';
  while (host != 'home') {
    cmd = `connect ${host};${cmd}`;
    host = extra.tree[host].last;
  }
  execRaw(`home;${cmd}`);
}

/** @param {NS} ns */
export function hackAll(ns) {
  const theme = ns.ui.getTheme();
  for (let host in extra.tree) {
    ns.scp(ns.ls('home', '.js'), host, 'home');
    if (host == 'home' || extra.hacked[host]) continue;
    if (ns.hasRootAccess(host)) {
      extra.hacked[host] = {};
    } else if (sudo(ns, host)) {
      printHTML(`<span style='color:${theme.success}'>Gain root access of ${host}.</span>`);
      extra.hacked[host] = {};
    }
  }
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
  if (act) { ns.nuke(host); }
  return true;
}

/** 
 * @param {NS} ns
 * @return {boolean}
 */
export function tryUpgradeHacknetNode(ns) {
  const theme = ns.ui.getTheme();
  const hn = ns.hacknet;
  let money = ns.getServerMoneyAvailable('home');
  let num_node = hn.numNodes();
  if (money >= hn.getPurchaseNodeCost()) {
    hn.purchaseNode();
    // printHTML(`<span style='color:${theme.money}'>+ node${num_node}</span>`);
    return true;
  }
  for (let i = 0; i < num_node; i++) {
    if (money >= hn.getLevelUpgradeCost(i, 1)) {
      hn.upgradeLevel(i, 1);
      // printHTML(`<span style='color:${theme.money}'>↑ node${num_node} level</span>`);
      return true;
    }
    if (money >= hn.getRamUpgradeCost(i, 1)) {
      hn.upgradeRam(i, 1);
      // printHTML(`<span style='color:${theme.money}'>↑ node${num_node} ram</span>`);
      return true;
    }
    if (money >= hn.getCoreUpgradeCost(i, 1)) {
      hn.upgradeCore(i, 1);
      // printHTML(`<span style='color:${theme.money}'>↑ node${num_node} core</span>`);
      return true;
    }
  }
  return false;
}

/**
 * @param {number} n
 * @return {string}
 */
export function money(n) {
  if (n < 1000) return `$${n.toFixed(2)}`;
  if (n < 1000000) return `$${(n / 1000).toFixed(2)}k`;
  if (n < 1000000000) return `$${(n / 1000000).toFixed(2)}m`
  if (n < 1000000000000) return `$${(n / 1000000000).toFixed(2)}b`
  return n.toString();
}

/**
 * @param {number} a
 * @param {number} b
 */
export function gcd(a, b) {
  while (b) {
    var t = b;
    b = a % b;
    a = t;
  }
  return a;
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