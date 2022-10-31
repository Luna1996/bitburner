import { tryBuyHacknet as tryUpgradeHacknetNode } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  while (true) {
    if (tryUpgradeHacknetNode(ns)) continue;
    await ns.sleep(1000);
  }
}