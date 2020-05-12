# Portera

[![Gitter](https://badges.gitter.im/porteralogs/community.svg)](https://gitter.im/porteralogs/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![GitHub version](https://badge.fury.io/gh/csegura%2Fportera.svg)](https://badge.fury.io/gh/csegura%2Fportera) [![github release version](https://img.shields.io/github/v/release/csegura/portera.svg?include_prereleases)](https://github.com/csegura/portera/releases/latest) [![npm version](https://badge.fury.io/js/portera.svg)](https://badge.fury.io/js/portera) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/csegura/portera/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)

> Portera is a Node library which provides remote logs with an awesome style.

**portera** has two parts, a library that wrap your console object by default, redirecting the output to **portera** server, its receive your data and serve a web page where you can display this.

![Sample Web](/docs/portera_web.gif)

## Installation

Install **portera** in your dev environment

```
$ npm install portera --save-dev`
```

## Use

To redirect your output to **portera** server you need import portera module in your project

```js
const portera = require("portera");

// whithout any configuration
// portera should wrap console
// and use localhost:3001 as default host
portera();
```

portera using configuration

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

Also you can maintain your current console object intact and create/use a new one

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

- `host` where portera server is running by default if not specified http://localhost:3001
- `obj` the object to use by default console
- `performance` time in ms to obtain data performance by default 0 that is disabled

## Portera server

**portera** sererver runs on port 3001 by default, you can change this using an argument when execute portera, see below. once running you can open your favorite browser using portera address http://<portera_server_ip>:3001

Run portera server

```sh
$ npx portera
```

Once running you will see your otputs in the server console. To use web client yo can open your favorite browser using the portera address `http://<portera_server_ip>:3001`

## Portera web client

By default **portera** show json at level 3, you can change this using an argument in the url with the parameter `?l=`. Try others like `?l=0` or `?l=5`

> `http://localhost:3001/?l=2`

_ms_ displayed on the right of the log page are time made between calls in your source program, the time is taken before to emit the event

**portera sessions** are stored in the browser in your local machine storage you can delete this using "clear session" button on top, meanwhile you can clear your screen using "clear" button, but session will be alive.

## Portera performance analytics

I added it to show analytics data that node offers. To reach performance data add `/performance` to your server url

> `http://localhost:3001/performance`

![Sample Performance](/docs/portera_performance.gif)

Data is collected following the time specified in ms using `performance` parameter when portera is initialized. It is by default disabled 0. I recommend values beginning from 1000 (1s)

`event.loop` the even loop lag in ms
`cpu.user` cpu user time in ms
`cpu.system` cpu user time in ms

`heap` memory used by the heap in megabytes
`heap.total` memory available in the heap in megabytes

Sure that there are great tools to measure performance for node applications, it is only a little toy because was paying. Please check `lib/portera.js` performance function and `bin/public/performance/performance.js` to check how this data is collected and showed. Feel free to comment anything.

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

These days I spent more time at home by corona quarantine, time to practice and learn new things. I began to do a sample project in node for the company where I work, it was something that I had have in my mind time ago. The project its a middleware between our different management programs and third part applications, this middleware should contain all bussiness logic necesary by thrird part systems.
When I had this part finished, I was adding a GraphQL interface to learn about it. Then I had a lot of api queries and results from my program and I needed inspect then, to understand how queries were formed and verify the results.
Then I had another problem, it was that I had only my laptop and it have a little screen, between the code editor and browser I didn´t have enaugh screen to show everything. Then I thought that I could use my tablet as a remote log viewer, and here is the result !!!

### Note

As always there are a lot of things todo. this was a hobby for this days, but if you want to do portera better no doubt in contact with me.

### Related Efforts

- [renderjson](https://github.com/caldwell/renderjson) - thanks to David Caldwell <david@porkrind.org> by the great renderjeson plugin, used in portera webpage.
- [chartjs](https://github.com/chartjs/Chart.js) - thanks to all chart.js team.

### TODO

- [ ] Add custom renderers & themes
- [ ] Group log results
- [ ] Timeline
- [ ] Tests

### Maintainers

[csegura](https://github.com/csegura).

You can follow me on twitter: [![Twitter](http://i.imgur.com/wWzX9uB.png)@romheat](https://www.twitter.com/romheat)

### Contributing

Feel free to dive in! [Open an issue](https://github.com/csegura/portera/issues/new) or submit PRs.

### License

[MIT](LICENSE) © carlos segura
