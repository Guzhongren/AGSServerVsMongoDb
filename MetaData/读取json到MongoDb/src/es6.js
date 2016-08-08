function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

console.log(hw.next());
console.log(hw.next());
setTimeout(()=>{
    console.log(hw.next());
},3000);

setTimeout(()=>{
    console.log(hw.next());
},3000);
