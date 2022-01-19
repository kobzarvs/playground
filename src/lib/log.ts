let consoleFlipFlop = 0;

window.log = (...args) => {
  console.log(`%c${consoleFlipFlop++ % 2}%c`, 'color:transparent;font-size:0px;', 'color:normal;font-size:normal;', ...args);
  return '';
};

export {};
