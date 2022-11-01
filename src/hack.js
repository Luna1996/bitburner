import { addScript, printHTML } from './tool';

/** @typedef {SEEK|WEAK|GROW|HACK} Phase */

const SEEK = 0;
const WEAK = 1;
const GROW = 2;
const HACK = 3;

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  const theme = ns.ui.getTheme();
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
    for (const host in extra.hacked) {
      if (host == 'home' || ns.getServerRequiredHackingLevel(host) > hackingLevel) { continue; }
      const profit = ns.hackAnalyze(host) * ns.getServerMaxMoney(host) / ns.getHackTime(host);
      if (!newVictim.name || newVictim.profit < profit) {
        newVictim.name = host;
        newVictim.profit = profit;
      }
    }
    if (newVictim.name && victim != newVictim.name) {
      victim = newVictim.name;
      phase = SEEK;
    }
    let newPhase = phase;
    switch (phase) {
      case SEEK: if (victim) {
        newPhase = WEAK;
      }
      case WEAK: if (
        ns.getServerSecurityLevel(victim) ==
        ns.getServerMinSecurityLevel(victim)) {
        newPhase = GROW;
      }
      case GROW: if (
        ns.getServerMoneyAvailable(victim) ==
        ns.getServerMaxMoney(victim)) {
        newPhase = HACK;
      }
    }
    if (phase != newPhase) {
      for (const id of ids) ns.kill(id);
      ids = [];
      phase = newPhase;
      switch (phase) {
        case WEAK: {
          const securityNeed = ns.getServerSecurityLevel(victim) - ns.getServerMinSecurityLevel(victim);
          const securityPerWeak = ns.weakenAnalyze(1);
          const weakNeed = Math.ceil(securityNeed / securityPerWeak);
          addScript({ name: 'weaker.js', n: weakNeed, args: [victim], onRun: logId });
          printHTML(
            `<span style='color:${theme.info}'>Find new victim `
            + `<span style='color:${theme.money}'>${victim}</span>. Start `
            + `<span style='color:${theme.money}'>weaken</span> with `
            + `<span style='color:${theme.money}'>w:${weakNeed}</span>.` +
            `</span>`);
          break;
        } case GROW: {
          const moneyNeed = ns.getServerMaxMoney(victim) / ns.getServerMoneyAvailable(victim);
          const growNeed = Math.ceil(ns.growthAnalyze(victim, moneyNeed));
          const securityPerWeak = ns.weakenAnalyze(1);
          const securtiyPerGrow = ns.growthAnalyzeSecurity(1, victim);
          const weakNeed = Math.ceil(growNeed * securtiyPerGrow / securityPerWeak);
          printHTML(
            `<span style='color:${theme.info}'>Complete weaken `
            + `<span style='color:${theme.money}'>${victim}</span>. Start `
            + `<span style='color:${theme.money}'>growth</span> with `
            + `<span style='color:${theme.money}'>w:${weakNeed} g:${growNeed}</span>.` +
            `</span>`);
          break;
        } case HACK: {
          const securityPerHack = ns.hackAnalyzeSecurity(1, victim);
          break;
        }
      }
    }
    await ns.asleep(1000);
  }
}
