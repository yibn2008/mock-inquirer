'use strict'

const assert = require('assert')
const mockInquirer = require('..')
const inquirer = require('inquirer')

describe('test mock inquirer', function () {
  it('should mock inquirer', function * () {
    let reset = mockInquirer([{
      hello: 'world'  // will auto fill 'world'
    }, {
      // if anwsers is empty, mockInquirer will fill with default value
    }])

    try {
      // prompt 2 questions
      let anwsers1 = yield inquirer.prompt([{
        type: 'input',
        message: 'I say hello, you say:',
        name: 'hello'
      }])

      let anwsers2 = yield inquirer.prompt([{
        type: 'confirm',
        message: 'mock inquirer is awesome:',
        name: 'like',
        default: true
      }])

      assert.equal(anwsers1.hello, 'world')
      assert.equal(anwsers2.like, true)
    } finally {
      // reset mock
      reset()
    }
  })

  it('should throw error when validation failed', function* () {
    let reset = mockInquirer([{
      number: 'hello'
    }]);
    let hasError = false;

    try {
      yield inquirer.prompt([{
        type: 'input',
        message: 'Enter number',
        name: 'number',
        validate: function (input) {
          if (/\d+/.test(input)) return true;
          return 'Invalid number entered';
        }
      }]);
    } catch (err) {
      hasError = true;
      assert.equal(err.message, 'Validation failed for field number');
    }
    finally {
      reset();
      assert.equal(hasError, true);
    }
  })
})
