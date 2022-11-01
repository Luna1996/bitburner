import { cnct, execRaw, getTree, sudo, printHTML, tree, hacked, progs } from './tool';
import { theme } from './wget';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  execRaw('alias main="run main.js"');
  execRaw('alias tree="run tree.js"');
  execRaw('alias goto="run goto.js"');
  execRaw('alias test="run test.js"');
  execRaw('alias theme="run theme.js"');


  tree = getTree(ns);

  const hackAll = () => {
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

  const plant = () => {
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
          break;
        }
      }
    }
  }

  hackAll();
  progs.push({ name: 'node.js' });
  while (true) {
    plant();
    await ns.asleep(1000);
  }
}