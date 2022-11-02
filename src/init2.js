import { execRaw, updateTree } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  extra.tree = null;
  extra.hacked = { 'home': {} };
  extra.scripts = [];
  updateTree(ns);
  execRaw('home;run init3.js;');
}