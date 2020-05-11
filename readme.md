[![Gitter](https://badges.gitter.im/porteralogs/community.svg)](https://gitter.im/porteralogs/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![GitHub version](https://badge.fury.io/gh/csegura%2Fportera.svg)](https://badge.fury.io/gh/csegura%2Fportera) [![github release version](https://img.shields.io/github/v/release/csegura/portera.svg?include_prereleases)](https://github.com/csegura/portera/releases/latest) [![npm version](https://badge.fury.io/js/portera.svg)](https://badge.fury.io/js/portera) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/csegura/portera/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)

# Portera

awesome remote logs for node and some performance data

## Installation

Install **portera** in your dev environment

```sh
$ npm install portera --save-dev`
```

## Portera server

**portera** is a client/server program runs on port 3001 by default, you can change this using an argumen when execute portera, see below. To execute the server exec **npx portera** command, once running you can open your favorite browser using portera address http://<portera_server_ip>:3001

```sh
$ npx portera
```

you will see your logs in web server console

![Sample Web](/docs/portera_web.gif)

**portera sessions** are stored on local machine storage you can delete this using "clear session" button on top.

By default **portera** show json at level 3, you can change this using an argument in the url with the parameter `?l=`. Experiment with others like `?l=0` or `?l=5`

`http://localhost:3001/?l=2`

_ms_ displayed on log page are time between calls in your program, the time is taken prior to emit the event

## Use

To redirect your output to portera you need import portera module in your project

```js
const portera = require("portera");

// console outputs will be send by portera
// use your own ip:port
portera({
  host: "http://localhost:3001",
  obj: console,
  performance: 0,
});
```

Also you can maintain your current console and create a new object

```js
const portera = require("portera");
const debug = {}
portera({
  host: "http://localhost:3001",
  obj: debug,
  performance: 0});

debug.log(...)
debug.info(...)
```

## Portera configuration

`host` where portera server is running by default if not specified http://localhost:3001
`obj` the object to use by default console
`performance` time in ms to obtain data performance by default 0 that is disabled

## Portera performance analytics

I added it to get some analytics data that node offers. To reach performance data add `/performance` to your server url

`http://localhost:3001/performance´

![Sample Performance](/docs/portera_performance.gif)

Data is collected following the time specified in ms using `performance` parameter when portera is initialized. It is by default disabled 0. I recommend values beginning from 1000 (1s)

`event.loop` the even loop lag in ms
`cpu.user` cpu user time in ms
`cpu.system` cpu user time in ms

`heap` memory used by the heap in megabytes
`heap.total` memory available in the heap in megabytes

Sure that there are great tools to measure performance for node applications, it is only a little toy because was easy add this to portera. Please check `lib/portera.js` performance function and `bin/public/performance/performance.js` to check how this data is collected and presented. Feel free to comment anything.

### Portera methods

Will have the same behaviour than original ones if you replaces console. List of methods

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
![Sample Console Image](/docs/portera_console.gif)

### Motivation

These days I spent more time at home by corona quarantine, this brought me to practice and learn new things. I began to do a sample project in node for the company where I work, it was something that I have had in mind for time ago. The project its a middleware between our different management programs and third part applications, this middleware should contain all bussiness logic necesary by thrird part systems.
I have this part is more or less completed and I was adding a GraphQL interface to learn about it and how it can help us, after this I had a lot of api queries and results from my program and I needed inspect then, how queries were formed and check the results to understand your formats.
Then I had another problem, it was that I had only my laptop and between the code editor and web interface I didn´t have enaugh screen to show everything. Then I thought that I could use my tablet as a remote log viewer, and here is the result !!!

### Note

As always there are a lot of things todo this was a hobby for this days, but if you want to do portera better no doubt in contact with me.

### Related Efforts

- [renderjson](https://github.com/caldwell/renderjson) - thanks to David Caldwell <david@porkrind.org> by the great renderjeson plugin, used in portera webpage.

### TODO

- [ ] Add custom renderers & themes
- [ ] Tests

### Maintainers

[@csegura](https://github.com/csegura).

### Contributing

Feel free to dive in! [Open an issue](https://github.com/csegura/portera/issues/new) or submit PRs.

### License

[MIT](LICENSE) © carlos segura
