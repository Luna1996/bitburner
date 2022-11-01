import { runScript } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  while (true) {
    runScript(ns);
    await ns.asleep(1000);
  }
}