import { addScript, execRaw, hackAll } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  hackAll(ns);
  addScript({ name: 'node.js' }, { name: 'hack.js' });
  ns.atExit(() => execRaw('home;run main.js;'));
}