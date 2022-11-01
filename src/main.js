import { printHTML, runScript } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  printHTML('Start main loop;');
  while (true) {
    runScript(ns);
    await ns.asleep(1000);
  }
}