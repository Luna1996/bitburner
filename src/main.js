import { addScript, printHTML, runScript } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.enableLog('exec');
  printHTML('Start main loop;');
  let algoRunning = false;
  while (true) {
    if (extra.totalSvrRam > 128 && !algoRunning) {
      addScript({ name: 'algo.js' });
      algoRunning = true;
    }
    runScript(ns);
    await ns.asleep(1000);
  }
}