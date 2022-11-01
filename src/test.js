import { printHTML } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  const p1 = ns.hack('n00dles');
  const p2 = ns.weaken('n00dles');
  await Promise.all([p1, p2]);
  printHTML('OK');
}