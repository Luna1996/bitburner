import { execRaw, hackAll } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  hackAll(ns);
  addScript({ name: 'node.js' }, { name: 'hack.js' });
  execRaw('home;run main.js;');
}