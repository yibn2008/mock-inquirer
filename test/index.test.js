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
    }, {
        fail: false
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

      let anwsers3 = yield inquirer.prompt([{
        type: 'confirm',
        message: 'mock inquirer will fail:',
        name: 'fail',
        default: true
      }])

      assert.equal(anwsers1.hello, 'world')
      assert.equal(anwsers2.like, true)
      assert.equal(anwsers3.fail, false)
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

  it('should not generate an answer when the when check fails', function* () {
    let reset = mockInquirer([{
        when_true: true,
        when_false: false,
        when_function: 'function'
    }]);

    try {
      let anwsers = yield inquirer.prompt([{
        type: 'confirm',
        message: 'Enter true',
          name: 'when_true',
          when: true,
      }, {
        type: 'confirm',
        message: 'Enter false',
          name: 'when_false',
          when: false,
      }, {
        type: 'input',
        message: 'Enter function',
          name: 'when_function',
          when: function(answers) {
              return answers.when_true;
          }
      }]);

        assert.equal(anwsers.when_true, true);
        assert.equal(anwsers.when_false, undefined);
        assert.equal(anwsers.when_function, 'function');
    } finally {
      reset();
    }
  })

  it('should handle answers already given to inquirer', function* () {
    let reset = mockInquirer([{
        hello: 'world'  // will auto fill 'world'
    }]);

    try {
      let anwsers = yield inquirer.prompt([{
        type: 'input',
        message: 'I say hello, you say:',
        name: 'hello'
      },
      {
        type: 'confirm',
        message: 'mock inquirer is awesome:',
        name: 'like'
      }],
      {
        like: true
      })

        assert.equal(anwsers.hello, "world");
        assert.equal(anwsers.like, true);
    } finally {
      reset();
    }
  })
})
