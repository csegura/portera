const portera = require("../lib/portera");

portera({
  host: "http://localhost:3001", 
  obj: console
});

const o = {
  a: "test",
  b: "test2",
  c: 123,
};

const other = [
  {
    id: "0001",
    type: "donut",
    name: "Cake",
    ppu: 0.55,
    batters: {
      batter: [
        {
          id: "1001",
          type: "Regular",
        },
        {
          id: "1002",
          type: "Chocolate",
        },
        {
          id: "1003",
          type: "Blueberry",
        },
        {
          id: "1004",
          type: "Devil's Food",
        },
      ],
    },
    topping: [
      {
        id: "5001",
        type: "None",
      },
      {
        id: "5002",
        type: "Glazed",
      },
      {
        id: "5005",
        type: "Sugar",
      },
      {
        id: "5007",
        type: "Powdered Sugar",
      },
      {
        id: "5006",
        type: "Chocolate with Sprinkles",
      },
      {
        id: "5003",
        type: "Chocolate",
      },
      {
        id: "5004",
        type: "Maple",
      },
    ],
  },
  {
    id: "0002",
    type: "donut",
    name: "Raised",
    ppu: 0.55,
    batters: {
      batter: [
        {
          id: "1001",
          type: "Regular",
        },
      ],
    },
    topping: [
      {
        id: "5001",
        type: "None",
      },
      {
        id: "5002",
        type: "Glazed",
      },
      {
        id: "5005",
        type: "Sugar",
      },
      {
        id: "5003",
        type: "Chocolate",
      },
      {
        id: "5004",
        type: "Maple",
      },
    ],
  },
  {
    id: "0003",
    type: "donut",
    name: "Old Fashioned",
    ppu: 0.55,
    batters: {
      batter: [
        {
          id: "1001",
          type: "Regular",
        },
        {
          id: "1002",
          type: "Chocolate",
        },
      ],
    },
    topping: [
      {
        id: "5001",
        type: "None",
      },
      {
        id: "5002",
        type: "Glazed",
      },
      {
        id: "5003",
        type: "Chocolate",
      },
      {
        id: "5004",
        type: "Maple",
      },
    ],
  },
];

try {
  throw new Error("Super Error");
} catch (err) {
  console.error(err);
}

console.log("other", other);

console.assert(o.a === "sample", "o.a not is sample", o);
console.trace();
console.log(o);

setTimeout(() => {
  console.log(process.platform);
  console.log(1234);
  console.info("sample", __dirname);
  console.log("object", o, o);
  console.info(process.getuid);
  console.warn(1, 2, 3, 4);
  console.trace("Trace");
  console.log("other", other[1]);
}, 2000);

setTimeout(() => {
  console.trace("Inside timeOut");
  console.log("uno", "dos", "tres");
  console.log("uno", "dos", o);
  console.error(null);
  console.error("test");
}, 4000);

console.log("uno", "dos", "tres");
console.log("uno", "dos", o);
console.error(null);
console.error("test");

function add(a, b) {
  console.stack();
  return a + b;
}

function re_add(a, b) {
  return add(a, b);
}

add(1, 2);
re_add(55, 55);

console.assert(1 == 2, "not the same", "1 === 2");
console.trace("Test", "we are here");

console.log("exit");
setTimeout(() => process.exit(), 10000);
