
// Implement this
class Debouncer {
  #timeouts = {}; // An empty object to store references for different callbacks timeouts.
  #duration; // A customable timeout duration (Bonus 1)
  constructor(duration = 1000) { 
    this.#duration = duration;
  }

  // Clears an existing timeout that might exist, than creating or rewriting a new timeout with a unique key named after the callback function.
  // Each time the function is being called it clears any previous timeouts for the callback being passed, than - if not cleared already by another later run() call, the function will execute the callback
  // and clear its timeout's reference from the object, to keep it free from unneeded fields.
  run(callback) {
    clearTimeout(this.#timeouts[callback])
    this.#timeouts[callback] = setTimeout(()=>{
      callback();
      delete this.#timeouts[callback];
    }, this.#duration);
  }

  // Basically, the same as the run() method, but immediatly clearing the timeout and removing its reference from the timouts object, without calling the callback function.
  // (Bonus 2)
  cancel(callback) {
    clearTimeout(this.#timeouts[callback])
    delete this.#timeouts[callback];
  }
}

// Bonus 3 - I know how to write it, but i want to submit my answer before my time will be over.
// Most of the class should be the same, but the run() function would be somthing like:

// run(callback) {
//   if (!this.#timeouts[callback]) {
//     callback();
//     this.#timeouts[callback] = setTimeout(()=>{
//       clearTimeout(this.#timeouts[callback])
//       delete this.#timeouts[callback];
//     }, this.#duration);
//   }
// }




// -- Tests --
// Run this file to see if the tests pass.
//


const assert = require('assert').strict;

runTestCases()

async function runTestCases() {

  const debouncer = new Debouncer()

  const tests = [
    async () => {
      // Calling bumpCounter1 4 times in a row, in less than a second.
      // Only the last one should actually run.
      debouncer.run(bumpCounter1)
      debouncer.run(bumpCounter1)
      debouncer.run(bumpCounter1)
      debouncer.run(bumpCounter1)
      await sleep(1500)
      assert.equal(counter1, 1, "bumpCounter1 should have ran 1 time.")
    },
    async () => {
      debouncer.run(bumpCounter2)
      await sleep(1500)
      // We've waited more than 1 second before calling bumpCounter2 again,
      // so it should run again.
      debouncer.run(bumpCounter2)
      await sleep(1500)
      assert.equal(counter2, 2, "bumpCounter2 should have ran 2 times.")
    },
    async () => {
      // Calling bumpCounter3 twice without waiting. should run once.
      debouncer.run(bumpCounter3)
      debouncer.run(bumpCounter3)
      // Calling bumpCounter4 twice without waiting. should run once.
      debouncer.run(bumpCounter4)
      debouncer.run(bumpCounter4)
      await sleep(1500)
      assert.equal(counter3, 1, "bumpCounter3 should have ran 1 time.")
      assert.equal(counter4, 1, "bumpCounter4 should have ran 1 time.")
    },  async () => {
      // Calling bumpCounter1 4 times in a row, in less than a second.
      // Only the last one should actually run.
      debouncer.run(bumpCounter5)
      debouncer.cancel(bumpCounter5)

      await sleep(1500)
      assert.equal(counter5, 0, "bumpCounter5 should have ran 0 time.")
    }
  ]

  for (let [i, testCase] of tests.entries()) {
    try {
      await testCase()
      console.log(`Test case ${i + 1} passed: `)
    } catch (e) {
      console.error(`Test case ${i + 1} failed: `, e.message)
    }
  }
  console.log("Tests finished.")

}

let counter1 = 0
let counter2 = 0
let counter3 = 0
let counter4 = 0
let counter5 = 0
function bumpCounter1() { counter1 += 1 }
function bumpCounter2() { counter2 += 1 }
function bumpCounter3() { counter3 += 1 }
function bumpCounter4() { counter4 += 1 }
function bumpCounter5() { counter5 += 1 }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
