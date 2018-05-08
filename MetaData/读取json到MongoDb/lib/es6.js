"use strict";

var helloWorldGenerator = regeneratorRuntime.mark(function helloWorldGenerator() {
    return regeneratorRuntime.wrap(function helloWorldGenerator$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.next = 2;
                return "hello";

            case 2:
                context$1$0.next = 4;
                return "world";

            case 4:
                return context$1$0.abrupt("return", "ending");

            case 5:
            case "end":
                return context$1$0.stop();
        }
    }, helloWorldGenerator, this);
});

var hw = helloWorldGenerator();

console.log(hw.next());
console.log(hw.next());
setTimeout(function () {
    console.log(hw.next());
}, 3000);

setTimeout(function () {
    console.log(hw.next());
}, 3000);