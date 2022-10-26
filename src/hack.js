/** @param {import('./tool').NS} ns */
export async function main(ns) {
  ns.tail();
  ns.print(ns.scan('n00dles'));
}
