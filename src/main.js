import { printHTML, runScript } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.enableLog('exec');
  printHTML('Start main loop;');
  while (true) {
    runScript(ns);
    await ns.asleep(1000);
  }
}