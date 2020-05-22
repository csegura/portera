class Tools {
  static sringfyObj(obj) {
    var fns = [];
    var refs = [];
    var ph_functions = "__PORTERAF__";
    var ph_circular = "__circular__";

    const dealCirculars = (k, v) => {
      if (typeof v === "object" && v !== null) {
        if (refs.indexOf(v) !== -1) {
          // circular reference found
          return ph_circular;
        }
        // collect
        refs.push(v);
      } else if (typeof v === "function") {
        fns.push(v);
        return ph_functions;
      }
      return v;
    };

    var json = JSON.stringify(obj, dealCirculars, 2);

    json = json.replace(new RegExp(`"${ph_functions}"`, "g"), () => {
      return JSON.stringify("[fn]" + fns.shift().toString().replace(/\r/gm, ""), null, 2);
    });

    return json;
  }

  static sringfyObj2(obj) {
    var fns = [];
    var refs = [];
    var ph_functions = "__PORTERAF__";
    var ph_circular = "__circular__";
    console.log("**");
    const dealCirculars = (k, v) => {
      if (typeof v === "object" && v !== null) {
        if (refs.indexOf(v) !== -1) {
          return ph_circular;
        }
        refs.push(v);
      } else if (typeof v === "function") {
        fns.push(v);
        return ph_functions;
      }
      return v;
    };

    var json = JSON.stringify(obj, dealCirculars, 2);

    json = json.replace(new RegExp(`"${ph_functions}"`, "g"), () => {
      return JSON.stringify(fns.shift().toString().replace(/\r/gm, ""), null, 2);
    });

    return json;
  }

  static removeCrLf(str) {
    return str.replace(/\r/gm, "");
  }

  static stringfyErrorJson() {
    if (!("toJSON" in Error.prototype)) {
      Object.defineProperty(Error.prototype, "toJSON", {
        value: function () {
          var alt = {};
          Object.getOwnPropertyNames(this).forEach(function (key) {
            alt[key] = this[key];
          }, this);
          return alt;
        },
        configurable: true,
        writable: true,
      });
    }
  }
}

module.exports = Tools;
