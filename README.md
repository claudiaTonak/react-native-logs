![npm](https://img.shields.io/npm/v/react-native-logs.svg)
![GitHub](https://img.shields.io/github/license/onubo/react-native-logs.svg)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/onubo/react-native-logs/issues)

# react-native-logs

Performance-aware simple logger for React-Native Expo (managed and bare) and react-native-web with custom levels and transports (colored console,
file writing, etc.).

Each level has its severity: a number that represents its importance in
ascending order from the least important to the most important. Eg. _debug:0, info:1, warn:2,
error:3_.

By config the logger with a minium severity level, you will see only the logs that have it
highest. Then logs will be managed by transport: the function that will display/save/send log
messages.

It is also possible to extend the logger to create namespaced logs. In this way you will be able to see the log messages only for one or some parts of the code of your choice

**Demo console transport with custom colored levels and namespaces:**
![console log demo](https://raw.githubusercontent.com/onubo/react-native-logs/master/demo/demo-react-native-logs.png)

## Why another logging library?

After trying the most known logging libraries, like winston and bunyan, we found that for
react-native we needed something simpler, but still flexible, and without dependencies on nodejs. Comments and suggestions are welcome.

## Installation

```sh
npm install --save react-native-logs
```

OR

```sh
yarn add react-native-logs
```

OR

```sh
expo install react-native-logs
```

## Quick Start

```javascript
import { logger } from "react-native-logs";

var log = logger.createLogger();

log.debug("This is a Debug log");
log.info("This is an Info log");
log.warn("This is a Warning log");
log.error("This is an Error log");
```

By default the `createLogger()` method (called without arguments) will create a simple console logger with debug, info, warn
and error levels.

## Configuration

You can customize the logger by passing a config object to the `createLogger` method (see example
below). All params are optional and will take default values if no corresponding argument is passed.

| Parameter         | Type     | Description                                                 | Default                                   |
| ----------------- | -------- | ----------------------------------------------------------- | ----------------------------------------- |
| severity          | string   | Init logs severity (least important level you want to see)  | `debug` (or the first custom level)       |
| transport         | Function | The transport function for logs (see below for presets)     | The preset transport `consoleTransport`   |
| transportOptions  | Object   | Set custom options for transports                           | `null`                                    |
| levels            | Object   | Set custom log levels: {name:power}                         | `false`                                   |
| async             | boolean  | Set to true for async logs (to improve app performance)     | `true`                                    |
| asyncFunc         | Function | Set a cutom async function `(cb: Function)=>{return cb()}`  | `InteractionManager.runAfterInteractions` |
| dateFormat        | string   | Choose between only `time` or a date: `local`, `utc`, `iso` | `time`                                    |
| printLevel        | boolean  | Choose whether to print the log level                       | `true`                                    |
| printDate         | boolean  | Choose whether to print the log date/time                   | `true`                                    |
| enabled           | boolean  | Enable or disable logging                                   | `true`                                    |
| enabledExtensions | string[] | Enable only certain namespaces                              | `null`                                    |

#### Example with common configuration

```javascript
import { logger, consoleTransport } from "react-native-logs";

const defaultConfig = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: "debug",
  transport: consoleTransport,
  transportOptions: {
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
  },
  async: true,
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  enabled: true,
};

var log = logger.createLogger(defaultConfig);

log.debug("Debug message");
log.info({ message: "hi!" });
```

### Custom levels

Log levels have this format: `{ name : severity }` and you can create your personalized list, Eg:

```javascript
import { logger } from "react-native-logs";

const config = {
  levels: {
    trace: 0,
    info: 1,
    silly: 2,
    error: 3,
    mad: 4,
  },
};

var log = logger.createLogger(config);

log.silly("Silly message");
```

### Custom transport

You can write your own transport to send logs to a cloud service, save it in to a database, or do
whatever you want. The following parameters are received by the function:

- `msg: any`: the message formatted by logger "[time] | [namespace] | [level] | [msg]"
- `rawMsg: any`: the message (or array of messages) in its original form
- `level: { severity: number; text: string }`: the log level
- `extension?: string | null`: its namespace if it is an extended log
- `options?: any`: the transportOptions object

You can define your custom transport as follow (example in typescript)§:

```javascript
import { logger, transportFunctionType } from "react-native-logs";

const customTransport: transportFunctionType = (props) => {
  // Do here whatever you want with the log message
  // You can use any options setted in config.transportOptions
  // Eg. a console log: console.log(props.level.text, props.msg)
};

const config = {
  transport: customTransport,
};

var log = logger.createLogger(config);

log.debug("Debug message");
```

### Transport Options

By setting the `transportOptions` parameter you can insert the options that will be passed to
transports. For some transports these may be mandatory, as in the case of the `FS` option for the `fileAsyncTransport`
(see preset transports list for details).

```javascript
import { logger, fileAsyncTransport } from "react-native-logs";
import RNFS from "react-native-fs";

const config = {
  transport: fileAsyncTransport,
  transportOptions: {
    FS: RNFS,
    fileName: `log.txt`,
  },
};

var log = logger.createLogger(config);

log.debug("Debug message");
```

### Multiple Arguments

Log messages can be concatenated by adding arguments to the log function:

```javascript
var errorObject = {
  staus: 404,
  message: "Undefined Error",
};
log.error("New error occured", errorObject);
```

### Preset transports

react-native-logs includes some preset transports. You can import the one of your choice:
`import { logger, <transportName> } from 'react-native-logs';`

#### Example

```javascript
import { logger, mapConsoleTransport } from "react-native-logs";

const config = {
  transport: mapConsoleTransport,
};

var log = logger.createLogger(config);

log.debug("Debug message");
```

## List of included preset transports

### **consoleTransport**

Print the logs with a formatted `console.log` output.

| name            | type   | description                                                              | default |
| --------------- | ------ | ------------------------------------------------------------------------ | ------- |
| colors          | object | If setted you can choose the log colors, defined by level: {level:color} | `null`  |
| extensionColors | object | If setted you can choose the extension label colors: {extension:color}   | `null`  |

#### Available colors

| name          | ansi code | note                  |
| ------------- | --------- | --------------------- |
| default       | null      | default console color |
| black         | 30        |
| red           | 31        |
| green         | 32        |
| yellow        | 33        |
| blue          | 34        |
| magenta       | 35        |
| cyan          | 36        |
| white         | 37        |
| grey          | 90        |
| redBright     | 91        |
| greenBright   | 92        |
| yellowBright  | 93        |
| blueBright    | 94        |
| magentaBright | 95        |
| cyanBright    | 96        |
| whiteBright   | 97        |

#### Example

```javascript
import { logger, consoleTransport } from "react-native-logs";

const config = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  transport: consoleTransport,
  transportOptions: {
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
    extensionColors: {
      root: "magenta",
      home: "green",
    },
  },
};

var log = logger.createLogger(config);
var rootLog = log.extend("root");
var homeLog = log.extend("home");

rootLog.info("Magenta Extension and bright blue message");
homeLog.error("Green Extension and bright red message");
```

### **mapConsoleTransport**

Print the logs with a selected `console` method (`console.log`, `console.warn`, `console.error`, etc.).

| name      | type   | description                                        | default |
| --------- | ------ | -------------------------------------------------- | ------- |
| mapLevels | object | Select the console method by level: {level:method} | `null`  |

If mapLevels is not setted, the transport will try to map the console methods with the level name.

#### Example

```javascript
import { logger, mapConsoleTransport } from "react-native-logs";

const config = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    err: 3,
  },
  transport: mapConsoleTransport,
  transportOptions: {
    mapLevels: {
      debug: "log",
      info: "info",
      warn: "warn",
      err: "error",
    },
  },
};

var log = logger.createLogger(config);

log.debug("Print this with console.log");
log.err("Print this with console.error");
```

### **fileAsyncTransport**

This transport requires the installation of `react-native-fs`([install tutorial here](https://github.com/itinance/react-native-fs)) or `expo-file-system`, and allows you to save the
logs on the `<filePath>/<fileName>.txt` file.

#### Accepted Options:

| name     | type   | description                                                                | default                                                             |
| -------- | ------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| FS       | Object | MANDATORY, filesystem instance for the transport (RNFS or expo FileSystem) | `null`                                                              |
| fileName | string | set logs file name                                                         | `log`                                                               |
| filePath | string | set logs file path                                                         | `RNFS.DocumentDirectoryPath` or expo `FileSystem.documentDirectory` |

#### Example:

```javascript
import { logger, fileAsyncTransport } from "react-native-logs";
import RNFS from "react-native-fs";
/* EXPO:
 * import * as FileSystem from 'expo-file-system';
 */

let today = new Date();
let date = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();

const config = {
  severity: "debug",
  transport: fileAsyncTransport,
  transportOptions: {
    FS: RNFS,
    /* EXPO:
     * FS: FileSystem,
     */
    fileName: `logs_${date}-${month}-${year}`, // Create a new file every day
  },
};

var log = logger.createLogger(config);

log.info("Print this string to a file");
```

NOTE: Following
[this example](https://github.com/itinance/react-native-fs#file-upload-android-and-ios-only) it will
be possible to upload the file to your remote server

### **sentryTransport**

Send logs to [Sentry](https://github.com/getsentry/sentry-react-native). This transport also tries to send the error stack if it receives a JS error.

#### Accepted Options:

| name   | type   | description                                  | default |
| ------ | ------ | -------------------------------------------- | ------- |
| SENTRY | Object | MANDATORY, sentry instance for the transport | `null`  |

#### Example:

```javascript
import { logger, sentryTransport } from "react-native-logs";
import * as Sentry from "@sentry/react-native";

/*
 * Configure sentry
 */

const config = {
  severity: "debug",
  transport: sentryTransport,
  transportOptions: {
    SENTRY: Sentry,
  },
};

var log = logger.createLogger(config);

log.error("Send this log to Sentry");
```

## Extensions (Namespaced loggers)

To enable logging only for certain parts of the app, you can extend the logger to different namespaces using the "extend" method. You can enable these extensions from the configuration (`config.enabledExtensions`) or by using the `enable`/`disable` methods.

#### Example:

```javascript
import { logger, consoleTransport } from "react-native-logs";

const config = {
  transport: consoleTransport,
  enabledExtensions: ["ROOT", "HOME"],
};

var log = logger.createLogger(config);
var rootLog = log.extend("ROOT");
var homeLog = log.extend("HOME");
var profileLog = log.extend("PROFILE");

log.debug("print this"); // this will print "<time> | DEBUG | print this"
rootLog.debug("print this"); // this will print "<time> | ROOT | DEBUG | print this"
homeLog.debug("print this"); // this will print "<time> | HOME | DEBUG | print this"
profileLog.debug("not print this"); // this extension is not enabled
```

## Methods

#### enable/disable

Dynamically enable/disable loggers and extensions, if it is called without parameters then it will disable/enable the whole logger:

```javascript
import { logger, consoleTransport } from "react-native-logs";

const config = {
  transport: consoleTransport,
  enabledExtensions: ["ROOT", "HOME"],
};

var log = logger.createLogger(config);
var rootLog = log.extend("ROOT");
var homeLog = log.extend("HOME");

log.info("print this"); // this will print "<time> | ROOT | INFO | print this"
homeLog.info("print this"); // extension is enabled

log.disable("HOME");

homeLog.info("not print this"); // extension is not enabled
rootLog.info("print this"); // extension is enabled

log.disable();

homeLog.info("not print this"); // logger is not enabled
rootLog.info("not print this"); // logger is not enabled
log.info("not print this"); // logger is not enabled
```

#### getExtensions

Get an array of currently created extensions.

#### setSeverity

You can set the severity level by passing the name(string) of the least important level you want to
see. This method will overwrite any `config.severity` option set in logger creation.

```javascript
var log = logger.createLogger();

log.setSeverity("info");
log.debug("This log will not be printed");
log.info("This log will be printed correctly");
log.error("This log will be printed correctly");
```

#### getSeverity

You can get the current severity level setted.

```javascript
var log = logger.createLogger();

var defaultseverity = log.getSeverity(); // severity = debug
log.setSeverity("info");
var severity = log.getSeverity(); // severity = info
log.setSeverity("error");
var newseverity = log.getSeverity(); // newseverity = error
```

## Usage Tips

### Logs only in development mode

In reacly-native, after you have create your logger, you can set to log only in development using
the `__DEV__` as follows:

```javascript
import {
  logger,
  consoleTransport,
  fileAsyncTransport,
} from "react-native-logs";
import RNFS from "react-native-fs";

const config = {
  transport: __DEV__ ? consoleTransport : fileAsyncTransport,
  severity: __DEV__ ? "debug" : "error",
  transportOptions: {
    colors
    FS: RNFS,
  },
};

var log = logger.createLogger();
```

This will block all the logs in production, but not the errors, so the app performance will not be
affected. This will also change the transport: print to console in development and save to file in production.

### Global logger in react-native

In order to have a global logger throughout the app, i recommend using a config.js file to
initialize the logger so it can be imported wherever it is needed. Example:

```javascript
//config.js
import {
  logger,
  consoleTransport,
  fileAsyncTransport,
} from "react-native-logs";
import RNFS from "react-native-fs";

const config = {
  transport: __DEV__ ? consoleTransport : fileAsyncTransport,
  severity: __DEV__ ? "debug" : "error",
  transportOptions: {
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
    FS: RNFS,
  },
};

var LOG = logger.createLogger(config);

export { LOG };
```

```javascript
//index.js and other app files
import { LOG } from "./config";

LOG.info("app log test");
```

To use extended loggers in all files you can also re-declare them:

```javascript
//root.js
import { LOG } from "./config";
var log = LOG.extend("ROOT");

log.info("root log test");
```

```javascript
//root2.js
import { LOG } from "./config";
var log = LOG.extend("ROOT");

log.info("root log test");
```

```javascript
//home.js
import { LOG } from "./config";
var log = LOG.extend("HOME");

log.info("home log test");
```

### Use multiple transports

To use multiple transports for logs, just create a transport function that calls other transport
functions as follows:

```javascript
import {
  logger,
  consoleTransport,
  fileAsyncTransport,
  sentryTransport,
  transportFunctionType,
} from "react-native-logs";
import RNFS from "react-native-fs";
import * as Sentry from "@sentry/react-native";

var customTransport: transportFunctionType = (props) => {
  // Do here whatever you want with the log message
  // Eg. a console log: console.log(props.level.text, props.msg)
};

const log = logger.createLogger({
  transport: (props) => {
    consoleTransport(props);
    fileAsyncTransport(props);
    sentryTransport(props);
    customTransport(props);
  },
  transportOptions: {
    FS: RNFS,
    SENTRY: Sentry,
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
  },
});
```
