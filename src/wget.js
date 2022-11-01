/** @param {import('./tool').NS} ns */
export async function main(ns) {
  execRaw('home');
  ns.ui.setTheme(theme);
  ns.ui.setStyles(style);

  for (let file of files) {
    while (true) {
      printHTML(`<span style='color:${theme.secondary}'>Downloading ${file}...</span>`);
      if (await ns.wget(root + file, file, 'home')) {
        popOutput();
        printHTML(`<span style='color:${theme.success}'>Success download ${file}.</span>`);
        break;
      } else {
        popOutput();
        printHTML(`<span style='color:${theme.error}'>Fail download ${file}.</span>`);
      }
    }
  };

  ns.atExit(() => ns.exec('init.js', 'home'));
}

/** @type {(str:string)=>void} */
const execRaw = extra.execRaw;

/** @type {()=>any} */
const popOutput = extra.popOutput;

/** @type {(html:string)=>void} */
const printHTML = (html) => { extra.printRaw(React.createElement('div', { style: { margin: 0 }, dangerouslySetInnerHTML: { __html: html } })); };

const root = 'https://githubraw.com/Luna1996/bitburner/master/src/';
export const files = ['weaker.js', 'wget.js', 'tool.js', 'init.js', 'main.js', 'goto.js', 'hack.js', 'node.js', 'theme.js', 'tree.js', 'test.js'];
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