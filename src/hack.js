import { addScript, gcd, hackAll, money, printHTML } from './tool';

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

  let item = null;

  function logId(id) { ids.push(id); }
  function clear() {
    if (item) item.n = 0;
    for (const id of ids) ns.kill(id);
    ids = [];
  }

  ns.atExit(clear);

  while (true) {
    hackAll(ns);
    const hackingLevel = ns.getHackingLevel();
    newVictim = {};
    for (const host in extra.hacked) {
      if (host == 'home' || ns.getServerRequiredHackingLevel(host) > hackingLevel) { continue; }
      const securityPerHack = ns.hackAnalyzeSecurity(1, host);
      const securityPerWeak = ns.weakenAnalyze(1);
      const securtiyPerGrow = ns.growthAnalyzeSecurity(1, host, 1);
      const percentPerHack = ns.hackAnalyze(host);
      const growNeed = Math.ceil(ns.growthAnalyze(host, 1 / (1 - percentPerHack), 1));
      const weakNeed = Math.ceil((securityPerHack + growNeed * securtiyPerGrow) / securityPerWeak);
      const profit = percentPerHack * ns.getServerMaxMoney(host) / ns.getWeakenTime(host) / (1 + growNeed + weakNeed);
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
      clear();
      phase = newPhase;
      switch (phase) {
        case WEAK: {
          const currentSecurity = ns.getServerSecurityLevel(victim);
          const minSecurity = ns.getServerMinSecurityLevel(victim);
          const securityPerWeak = ns.weakenAnalyze(1);
          const weakNeed = Math.ceil((currentSecurity - minSecurity) / securityPerWeak);
          item = { name: 'weaker.js', n: weakNeed, args: [victim], onRun: logId };
          addScript(item);
          printHTML(
            `<span style='color:${theme.info}'>Find new victim `
            + `<span style='color:${theme.money}'>${victim}</span>, start `
            + `<span style='color:${theme.money}'>weaken</span> with `
            + `<span style='color:${theme.money}'>w:${weakNeed}</span>;\nCurrent security: `
            + `<span style='color:${theme.money}'>${currentSecurity}</span>, minimal security: `
            + `<span style='color:${theme.money}'>${minSecurity}</span>;` +
            `</span>`);
          break;
        } case GROW: {
          const currentMoney = ns.getServerMoneyAvailable(victim);
          const maxMoney = ns.getServerMaxMoney(victim);
          const growNeed = Math.ceil(ns.growthAnalyze(victim, maxMoney / currentMoney));
          const securityPerWeak = ns.weakenAnalyze(1);
          const securtiyPerGrow = ns.growthAnalyzeSecurity(1, victim, 1);
          const growPerGroup = Math.floor(securityPerWeak / securtiyPerGrow);
          const growTime = ns.getGrowTime(victim);
          const weakTime = ns.getWeakenTime(victim);
          const n = Math.ceil(growNeed / growPerGroup);
          item = {
            n,
            group: [
              { name: 'grower.js', n: growPerGroup, args: [victim, weakTime - growTime + 500], onRun: logId },
              { name: 'weaker.js', n: 1, args: [victim, 500], onRun: logId },
            ]
          };
          addScript(item);
          printHTML(
            `<span style='color:${theme.info}'>Complete weaken `
            + `<span style='color:${theme.money}'>${victim}</span>, start `
            + `<span style='color:${theme.money}'>growth</span> with `
            + `<span style='color:${theme.money}'>(g:${growPerGroup} w:1):${n}</span>;\nCurrent money: `
            + `<span style='color:${theme.money}'>${money(currentMoney)}</span>, maximal money: `
            + `<span style='color:${theme.money}'>${money(maxMoney)}</span>;` +
            `</span>`);
          break;
        } case HACK: {
          const securityPerHack = ns.hackAnalyzeSecurity(1, victim);
          const securityPerWeak = ns.weakenAnalyze(1);
          const securtiyPerGrow = ns.growthAnalyzeSecurity(1, victim, 1);
          const percentPerHack = ns.hackAnalyze(victim);
          const growNeed = Math.ceil(ns.growthAnalyze(victim, 1 / (1 - percentPerHack), 1));
          const weakNeed = Math.ceil((securityPerHack + growNeed * securtiyPerGrow) / securityPerWeak);
          const hackTime = ns.getHackTime(victim);
          const growTime = ns.getGrowTime(victim);
          const weakTime = ns.getWeakenTime(victim);
          // const n = Math.ceil((growNeed + weakNeed + 1) / 46);
          // const weakPerGroup = Math.ceil(weakNeed / n);
          // const growPerGroup = Math.ceil(growNeed / n);
          item = {
            n: Infinity,
            group: [
              { name: 'hacker.js', n: 1, args: [victim, weakTime - hackTime + 500], onRun: logId },
              { name: 'grower.js', n: growNeed, args: [victim, weakTime - growTime + 500], onRun: logId },
              { name: 'weaker.js', n: weakNeed, args: [victim, 1000], onRun: logId },
            ]
          };
          addScript(item);
          printHTML(
            `<span style='color:${theme.info}'>Complete growth `
            + `<span style='color:${theme.money}'>${victim}</span>, start `
            + `<span style='color:${theme.money}'>hacking</span> with `
            + `<span style='color:${theme.money}'>(h: 1 g:${growNeed} w:${weakNeed}):???</span>;` +
            `</span>`);
          break;
        }
      }
    }
    await ns.asleep(1000);
  }
}
