## Portera

Awesome remote logs for node

#### Motivation

Coronavirus quarantine time at home, brought me to prectice node. I began to do a sample project for the company where I work because it was something that I have in mind for some time ago. The project its like a middleware between our different management software and third part applications, this middleware should contain all bussiness logic necesary by thrird part systems.
This part is more or less completed and I added a GraphQL interface to learn also how this runs, after this I have a lot of queries and results from my program that and I needed check this. Then problem was that I have only my laptop and between code editor and web interface I haven´t enaugh screen to show query logs. Then I thought that I could use my tablet as a remote log viewer, and here is the result !!!

##### Installation

```
npm install portera --save-dev`
npx portera
```

##### Portera

Portera is a client/server program that run on port 3001 by default, you can change this using environment variable PORTERA_PORT. To run the server exec **npx portera**, once running you can open your favorite browser http://<portera_server_ip>:3001 and also you should have wonderful console logs

Sample web:
![Sample Web Image](/docs/portera_web.png)

Sample Console:
![Sample Console Image](/docs/portera_console.png)

##### Use portera in your code

To redirect your output to portera you need import portera module

```js
const portera = require('portera');

// console outputs will be send by portera
portera('http://localhost:3001', console);
```

#### Portera commands

```js
portera.log(...)
portera.info(...)
portera.warn(...)
portera.error(...)
portera.trace(...)
portera.assert(...)
portera.stack()
```
