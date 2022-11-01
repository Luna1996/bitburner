import { addScript, hacked, printHTML } from './tool';
import { theme } from './wget';

/** @typedef {SEEK|WEAK|GROW|HACK} Phase */

const SEEK = 0;
const WEAK = 1;
const GROW = 2;
const HACK = 3;

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  /** @type {string} */
  let victim;
  /** @type {{name: string, profit: number}} */
  let newVictim;
  /** @type {Phase} */
  let phase = SEEK;
  /** @type {number[]} */
  let ids = [];

  function logId(id) { ids.push(id); }

  while (true) {
    const hackingLevel = ns.getHackingLevel();
    newVictim = {};
    for (const host in hacked) {
      if (host == 'home' || ns.getServerRequiredHackingLevel(host) > hackingLevel) { continue; }
      const profit = ns.hackAnalyze(host) * ns.getServerMaxMoney(host) / ns.getHackTime(host);
      if (!newVictim.name || newVictim.profit < profit) {
        newVictim.name = host;
        newVictim.profit = profit;
      }
    }
    if (victim != newVictim.name) {
      victim = newVictim.name;
      phase = SEEK;
    }
    let newPhase = phase;
    switch (phase) {
      case SEEK: if (victim) {
        newPhase = WEAK;
        printHTML(
          `<span style='color:${theme.info}'>` +
          `Find new victim <span style='color:${theme.money}'>${victim}</span>. ` +
          `Start <span style='color:${theme.money}'>weak</span>.` +
          `</span>`);
      }
      case WEAK: if (
        ns.getServerSecurityLevel(victim) ==
        ns.getServerMinSecurityLevel(victim)) {
        newPhase = GROW;
        printHTML(
          `<span style='color:${theme.info}'>` +
          `Complete weak <span style='color:${theme.money}'>${victim}</span>. ` +
          `Start <span style='color:${theme.money}'>grow</span>.` +
          `</span>`);
      }
      case GROW: if (
        ns.getServerMoneyAvailable(victim) ==
        ns.getServerMaxMoney(victim)) {
        newPhase = HACK;
        printHTML(
          `<span style='color:${theme.info}'>` +
          `Complete grow <span style='color:${theme.money}'>${victim}</span>. ` +
          `Start <span style='color:${theme.money}'>hack</span>.` +
          `</span>`);
      }
    }
    if (phase != newPhase) {
      for (const id of ids) ns.kill(id);
      ids = [];
      phase = newPhase;
      const sdif = ns.getServerSecurityLevel(victim) - ns.getServerMinSecurityLevel(victim);
      const ones = ns.weakenAnalyze(1);
      const mdif = ns.getServerMaxMoney(victim) / ns.getServerMoneyAvailable(victim);
      switch (phase) {
        case WEAK:
          const wnum = Math.ceil(sdif / oneg);
          addScript({ name: 'weaker.js', n: wnum, args: [victim], onRun: logId });
          break;
          case GROW:
          const gnum = Math.ceil(ns.growthAnalyze(victim, mdif));
          break;
        case HACK:
          break;
      }
    }
    await ns.asleep(1000);
  }
}
