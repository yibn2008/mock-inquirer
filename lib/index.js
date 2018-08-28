'use strict'

const path = require('path')
const mockRequire = require('mock-require')

function getDefault (def) {
  if (typeof def === 'function') {
    return def()
  } else {
    return def
  }
}

function mockInquirer (fills) {
  let inquirerFile = require.resolve('inquirer')
  let inquirer = require(inquirerFile)
  let origPrompt = inquirer.prompt

  // 对 inquirer 的 prompt 进行 mock
  inquirer.prompt = function (fields) {
    let mocks = fills.shift() || {}
    let anwsers = {}

    fields.forEach(field => {
      if (field.validate && typeof field.validate === 'function') {
        if (field.validate(mocks[field.name]) !== true) {
          throw new Error(`Validation failed for field ${field.name}`)
        }
      }

      anwsers[field.name] = mocks[field.name] || getDefault(field.default)
    })

    return Promise.resolve(anwsers)
  }

  // 对 require('inquirer') 进行 mock
  mockRequire('inquirer', inquirer)

  // 对已经加载过的 inquirer 进行 mock
  let replaces = {}
  for (let file in require.cache) {
    if (file.indexOf('inquirer') > 0) {
      let inst = require.cache[file].exports
      if (inst && inst.prompt && (path.basename(inquirerFile) === path.basename(file))) {
        // 如果是 inquirer, 就替换
        if (inst !== inquirer) {
          replaces[file] = inst.prompt
          inst.prompt = inquirer.prompt
        }
      }
    }
  }

  return function () {
    inquirer.prompt = origPrompt
    mockRequire.stop('inquirer')
    for (let file in replaces) {
      let inst = require.cache[file]
      inst.prompt = replaces[file]
      delete replaces[file]
    }
  }
}

module.exports = mockInquirer
