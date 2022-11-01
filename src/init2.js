import { execRaw, updateTree } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  updateTree(ns);
  execRaw('home;run init3.js;');
}