/** @param {import('./tool').NS} ns */
export async function main(ns) {
  ns.ui.setTheme(theme);
  ns.ui.setStyles(style);

  for (let file of files) {
    await ns.wget(root + file, file, 'home');
  };

  ns.atExit(() => { ns.exec('main.js', 'home'); });
}

const root = 'https://cdn.githubraw.com/Luna1996/bitburner/fa8d8d4a/src/';
const files = ['goto.js', 'hack.js', 'main.js', 'node.js', 'theme.js', 'tool.js', 'tree.js'];
/** @type {import('../docs').UserInterfaceTheme} */
const theme = {
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