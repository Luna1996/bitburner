import { goto } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  goto(ns.args[0])
}