"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

require("core-js/shim");

var Person = (function () {
  function Person(name) {
    _classCallCheck(this, Person);

    this.name = name;
  }

  _createClass(Person, {
    sayHello: {
      value: function sayHello() {
        return "Hello " + this.name + "!";
      }
    },
    sayHelloThreeTimes: {
      value: function sayHelloThreeTimes() {
        var hello = this.sayHello();
        return ("" + hello + " ").repeat(3);
      }
    }
  });

  return Person;
})();

module.exports = Person;