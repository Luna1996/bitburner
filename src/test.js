import { outputs, popOutput, printHTML } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  outputs().pop();
  outputs().pop();
  outputs().pop();
  printHTML('YOU ARE FUCKED');
  await ns.asleep(1000);
  outputs().pop();
  printHTML('NOW');
}