import { printHTML } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  printHTML(`${4.3%2.1}`);
  ns.exec('test2.js', 'home');
  printHTML(`${ns.getServerUsedRam('home')}`);
}