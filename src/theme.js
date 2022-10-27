/** @param {import('./tool').NS} ns */
export async function main(ns) {
  const theme = ns.ui.getTheme();
  let html = '';
  for (const name in theme) {
    html += `<span style='color:${theme[name]}'>${name}\n</span>`
  }
  ns.alert(`<p style='line-height:1'>${html}</p>`);
}