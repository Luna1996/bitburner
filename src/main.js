import { cnct, execRaw, getTree, sudo, printHTML } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  execRaw('alias main="run main.js"');
  execRaw('alias tree="run tree.js"');
  execRaw('alias goto="run goto.js"');
  execRaw('alias test="run test.js"');
  execRaw('alias theme="run theme.js"');


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
          printHTML(`<span style='color:${theme.info}'>Plant ${name} on ${host}.</span>`);
          cnct(host);
          execRaw(`run ${name} ${args ? args.join(' ') : ''}`);
          execRaw('home');
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