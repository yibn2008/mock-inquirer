# mock-inquirer

mock anwsers for inquirer prompt questions

## features

- mock all inqurier instances which already loaded in current process
- mock `require('inquirer')` and return mocked inquirer instance
- work well with `npm link` which may cause `require('inqurier')` load different inquirers

*Notice: mock-inquirer only mock `inquirer.prompt` method, any advanced usage may not work*

## install

```bash
npm install mock-inquirer --save
```

## Usage

Just call `mockInquirer` and pass anwsers at anywhere.

```js
const mockInquirer = require('mock-inquirer')
const inquirer = require('inquirer')
const co = require('co')

// start mock
co(function * () {
  let reset = mockInquirer([{
    hello: 'world'  // will auto fill 'world'
  }, {
    // if anwsers is empty, mockInquirer will fill with default value
  }])

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

  // print anwsers:
  // { hello: 'world' }
  // { like: true }
  console.log(anwsers1)
  console.log(anwsers2)

  // reset mock
  reset()
}).catch(err => {
  console.error(err)
})
```

## API

### `mockInquirer(anwsersList)`

- `anwsersList`, *{Array}* anwsers list for every mocked `inquirer.prompt`

The item of `anwsersList` is a key-value anwsers object which key is `name` of questions field.

If `anwsersList` is empty, then the anwsers will be filled with default value in `inquirer.prompt` questions.

## LICENSE

MIT
