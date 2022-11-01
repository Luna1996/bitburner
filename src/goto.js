import { tree } from './main';
import { cnct } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  cnct(ns.args[0])
}