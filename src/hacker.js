/** @param {import('./tool').NS} ns */
export async function main(ns) {
  await ns.hack(ns.args[1]);
  if (ns.args[2]) await ns.asleep(ns.args[2]);
}