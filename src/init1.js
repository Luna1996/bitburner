/** @param {import('./tool').NS} ns */
export async function main(ns) {
  popOutput();

  printHTML('Setting theme & style;');
  ns.ui.setTheme(theme);
  ns.ui.setStyles(style);

  printHTML('Setting alias: main, tree, goto, test, theme;');
  execRaw('alias main="run main.js"');
  execRaw('alias tree="run tree.js"');
  execRaw('alias goto="run goto.js"');
  execRaw('alias test="run test.js"');
  execRaw('alias theme="run theme.js"');

  for (let file of files) {
    while (!ns.fileExists(file)) {
      printHTML(`<span style='color:${theme.secondary}'>Downloading ${file}...</span>`);
      if (await ns.wget(root + file, file, 'home')) {
        popOutput();
        printHTML(`Success download ${file};`);
        break;
      } else {
        popOutput();
        printHTML(`<span style='color:${theme.error}'>Fail download ${file}!</span>`);
        ns.tail();
      }
    }
  };
  execRaw('home;run init2.js;');
}

/** @type {(str:string)=>void} */
const execRaw = extra.execRaw;

/** @type {()=>any} */
const popOutput = extra.popOutput;

/** @type {(html:string)=>void} */
const printHTML = (html) => { extra.printRaw(React.createElement('div', { style: { margin: 0 }, dangerouslySetInnerHTML: { __html: html } })); };

const root = 'https://githubraw.com/Luna1996/bitburner/master/src/';
export const files = ['tool.js', 'init2.js', 'init3.js', 'main.js', 'node.js', 'hack.js', 'theme.js', 'tree.js', 'goto.js', 'test.js', 'weaker.js'];
/** @type {import('../docs').UserInterfaceTheme} */
export const theme = {
  primarylight: '#E0E0BC',
  primary: '#CCCCAE',
  primarydark: '#B8B89C',
  successlight: '#00F000',
  success: '#00D200',
  successdark: '#00B400',
  errorlight: '#F00000',
  error: '#C80000',
  errordark: '#A00000',
  secondarylight: '#B4AEAE',
  secondary: '#969090',
  secondarydark: '#787272',
  warninglight: '#F0F000',
  warning: '#C8C800',
  warningdark: '#A0A000',
  infolight: '#69f',
  info: '#36c',
  infodark: '#039',
  welllight: '#444',
  well: '#222',
  white: '#fff',
  black: '#1E1E1E',
  hp: '#dd3434',
  money: '#ffd700',
  hack: '#adff2f',
  combat: '#faffdf',
  cha: '#a671d1',
  int: '#6495ed',
  rep: '#faffdf',
  disabled: '#66cfbc',
  backgroundprimary: '#1E1E1E',
  backgroundsecondary: '#252525',
  button: '#333'
};
/** @type {import('../docs').IStyleSettings} */
const style = { fontFamily: 'Consolas', lineHeight: 1.2 };