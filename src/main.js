import { _cnct, _exec, getTree, _setEnablePrint, sudo, _printHTML } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  _exec('alias main="run main.js"');
  _exec('alias tree="run tree.js"');
  _exec('alias goto="run goto.js"');
  _exec('alias test="run test.js"');
  _exec('alias theme="run theme.js"');


  const theme = ns.ui.getTheme();
  const tree = getTree(ns);

  /** @type {Object.<string, {}>} */
  const hacked = { 'home': {} };
  function hackAll() {
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

  /** @type {{name:string, args:any[]}[]} */
  const progs = [];
  function plant() {
    for (let i = progs.length - 1; i >= 0; i--) {
      const name = progs[i].name;
      const args = progs[i].args;
      const mem = ns.getScriptRam(name);
      for (const host in hacked) {
        const ram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
        if (mem <= ram) {
          _printHTML(`<span style='color:${theme.info}'>Plant ${name} on ${host}.</span>`);
          _cnct(host);
          _exec(`run ${name} ${args ? args.join(' ') : ''}`);
          progs.splice(i, 1);
        }
      }
    }
  }

  hackAll();
  progs.push({ name: 'node.js' });
  plant();
  while (true) {
    ns.grow
    await ns.asleep(1000);
  }
}