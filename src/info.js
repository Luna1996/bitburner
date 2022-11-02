import { printHTML } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  let html = '';
  for (const [k, v] of Object.entries(ns.getServer(ns.args[0]))) {
    html += `${k.toString()}: ${v.toString()}\n`;
  }
  printHTML(html);
}