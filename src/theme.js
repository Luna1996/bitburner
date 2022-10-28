import { printHTML } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  const theme = ns.ui.getTheme();
  let html = '';
  for (const name in theme) {
    html += `<span style='color:${theme[name]};user-select:text;'>${name}</span>${' '.repeat(20 - name.length)}<span style='background-color:${theme[name]}'>${' '.repeat(35)}</span>\n`
  }
  printHTML(`<p style='line-height:1;margin:0;user-select:none;'>${html}</p>`);
}