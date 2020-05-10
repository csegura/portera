[![Gitter](https://badges.gitter.im/porteralogs/community.svg)](https://gitter.im/porteralogs/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![GitHub version](https://badge.fury.io/gh/csegura%2Fportera.svg)](https://badge.fury.io/gh/csegura%2Fportera) [![github release version](https://img.shields.io/github/v/release/csegura/portera.svg?include_prereleases)](https://github.com/csegura/portera/releases/latest) [![npm version](https://badge.fury.io/js/portera.svg)](https://badge.fury.io/js/portera) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/csegura/portera/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)

# Portera

awesome remote logs for node

## Installation

Install **portera** in your dev environment

```sh
$ npm install portera --save-dev`
```

## Portera server

**portera** is a client/server program runs on port 3001 by default, you can change this using arguments when execute portera see below. To execute the server exec **npx portera** command, once running you can open your favorite browser using portera address http://<portera_server_ip>:3001

```sh
$ npx portera
```

you will see your logs in server console

![Sample Web](/docs/portera_video.gif)

**portera sessions** are stored on local machine storage you can delete this using "clear session" button on top.

By default **portera** show json at level 3, you can change this passin the parameter `?l=` to the web client. Experiment with other `?l=0` or `?l=5`

_ms_ are time between calls in your program, the time is toke prior to emit the event

## Use portera in your code

To redirect your output to portera you need import portera module

```js
const portera = require("portera");

// console outputs will be send by portera
// use your own ip:port
portera("http://localhost:3001", console);
```

Also you can maintain your current console and create a new object

```js
const portera = require("portera");
const debug = {}
portera("http://localhost:3001", debug);

debug.log(...)
debug.info(...)
```

### Portera commands

Will have the same behaviour than original ones if you replces console. List of methods

```js
portera.log(...)
portera.info(...)
portera.warn(...)
portera.error(...)
portera.trace(...)
portera.assert(...)
portera.stack()
```

### Portera server - command line arguments

**portera** server can be launched with command line arguments. These arguments can either be used from the command line directly

Use `-p` or `--port` to specify a different port
Use `-m` or `--mode` to specify two dirent forms of dispaly data in console `-m awe` by default or `-m normal`. In normal mode json will be valid json, you can copy & paste to use in another place. Awesome output is more readable otherwise json don´t have a valid format.
Use `-s` or `--silent` for silent mode, no console logs.

Sample Console in awe mode by default:
![Sample Console Image](/docs/portera_console_awe.png)

Sample Console in normal mode:
![Sample Console Image](/docs/portera_console_normal.png)


### Motivation

These days I spent more time at home by corona quarantine, this brought me to practice new things. I began to do a sample project in node for the company where I work because it was something that I have had in mind for time ago. The project its a middleware between our different management programs and third part applications, this middleware should contain all bussiness logic necesary by thrird part systems.
This part is more or less completed and I added a GraphQL interface to learn about it and how it can help us, after this I have a lot of api queries and results from my program and I needed check. Then problem was that I had only my laptop and between the code editor and web interface I didn´t have enaugh screen to show everything. Then I thought that I could use my tablet as a remote log viewer, and here is the result !!!

### Note

As always there are a lot of things todo (see below) this was a hobby for this days, but if you want to do portera better no doubt in contact with me. 

### Related Efforts

- [renderjson](https://github.com/caldwell/renderjson) - thanks to David Caldwell <david@porkrind.org> by the great renderjeson plugin, used in portera webpage.

### TODO

- [ ] Configuration object in portera
- [ ] Add custom renderers & themes
- [ ] Tests

### Maintainers

[@csegura](https://github.com/csegura).

### Contributing

Feel free to dive in! [Open an issue](https://github.com/csegura/portera/issues/new) or submit PRs.

### License

[MIT](LICENSE) © carlos segura
