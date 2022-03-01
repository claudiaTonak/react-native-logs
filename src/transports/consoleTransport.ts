import { Platform } from 'react-native';

import { transportFunctionType } from "../index";

const availableColors: any = {
  default: null,
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  grey: 90,
  redBright: 91,
  greenBright: 92,
  yellowBright: 93,
  blueBright: 94,
  magentaBright: 95,
  cyanBright: 96,
  whiteBright: 97,
};
const webColor: any = {
  default: null,
  black: 'background-color: #fff;color:#000000',
  red: 'background-color: #FF0000;color:#fff',
  green: 'background-color: #00FF00;color:#414141',
  yellow: 'background-color: #ff0;color:#414141',
  blue: 'background-color: #0000ff;color:#fff',
  magenta: 'background-color: #FF00FF;color:#e1e1e1',
  cyan: 'background-color: #00ffff;color:#414141',
  white: 'background-color: #414141;color:#fff',
  grey: 'background-color: #A1A1A1;color:#414141',
  redBright: 'background-color: #ff5000;color:#414141',
  greenBright: 'background-color: ##B4ffB4;color:#414141',
  yellowBright: 'background-color: #ffffb4;color:#414141',
  blueBright: 'background-color: #00c8ff;color:#414141',
  magentaBright: 'background-color: #ffb4ff;color:#414141',
  cyanBright: 'background-color: #b4ffff;color:#414141',
  whiteBright: 'background-color: #414141;color:#FDFEFF',
  violet: 'background-color: #9e34bd;color:#e1e1e1',
  mint: 'background-color: #CFFFE5;color:#414141',
  orange: 'background-color: #ffb700;color:#414141',
};

const resetColors = "\x1b[0m";

const consoleTransport: transportFunctionType = (props) => {
  if (!props) return false;

  let msg = props.msg;
  let color;

  if (
    Platform.OS === 'web' &&
    props.options?.colors &&
    props.options.colors[props.level.text] &&
    webColor[props.options.colors[props.level.text]]
  ) {
    if (props.level.text === 'mint') {
      let i = 0;
      i = i + 1;
    }
    color = `${webColor[props.options.colors[props.level.text]]}`;
  } else if (
    props.options?.colors &&
    props.options.colors[props.level.text] &&
    availableColors[props.options.colors[props.level.text]]
  ) {
    color = `\x1b[${availableColors[props.options.colors[props.level.text]]}m`;
    msg = `${color}${msg}${resetColors}`;
  }

  if (props.extension && props.options?.extensionColors) {
    let extensionColor = "\x1b[7m";

    if (
      props.options.extensionColors[props.extension] &&
      availableColors[props.options.extensionColors[props.extension]]
    ) {
      extensionColor = `\x1b[${
        availableColors[props.options.extensionColors[props.extension]] + 10
      }m`;
    }

    let extStart = color ? resetColors + extensionColor : extensionColor;
    let extEnd = color ? resetColors + color : resetColors;
    msg = msg.replace(
      props.extension,
      `${extStart} ${props.extension} ${extEnd}`
    );
  }

  if (Platform.OS === 'web') {
    console.log('%c' + msg.trim(), color);
  } else console.log(msg.trim());


  return true;
};

export { consoleTransport };
