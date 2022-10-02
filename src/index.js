const R = require('ramda')
const fs = require('fs-extra')
const path = require('path')
const toml = require('toml')
const yargs = require('yargs-parser')
const { Reset, FgCyan, FgGreen, FgRed } = require('./colors')

// --[ local utils ]-----------------------------------------------------------
// handle terminal messaging
const CYAN = `${FgCyan}%s${Reset}`
const GREEN = `${FgGreen}%s${Reset}`
const RED = `${FgRed}%s${Reset}`

// handle file pathing options
const CONFIG_FILE = path.join(__dirname, '../parse-config.toml')
const INPUT_DIR = (str) => path.join(__dirname, `../${str}/`)
const OUTPUT_DIR = (str) => path.join(__dirname, `../${str}/`)

const readDir = ({ inputFolder, outputFolder }) =>
  R.tryCatch(
    () => ({
      fileNames: fs
        .readdirSync(inputFolder)
        .map((name) => name.split('.toml')[0]),
      inputFolder,
      outputFolder,
    }),
    (error) => {
      console.log(RED, error)
      return null
    }
  )()

const readFile = ({ inputFolder, fileNames }) =>
  fileNames.map((fileName) =>
    R.tryCatch(
      () => fs.readFileSync(`${inputFolder}/${fileName}.toml`),
      (error) => {
        console.log(RED, error)
        return null
      }
    )()
  )

const write = ({ outputFolder, data, fileNames }) =>
  data.map((datum, index) =>
    R.tryCatch(
      () => {
        fs.writeFileSync(
          `${outputFolder}${fileNames[index]}.json`,
          JSON.stringify(datum)
        )
        console.log(
          GREEN,
          `Writing file ${outputFolder}${fileNames[index]}.json`
        )
      },
      (error) => {
        console.log(RED, 'An error occured writing file(s)')
        console.log(RED, error)
      }
    )()
  )

const createJSON = ({ fileNames, inputFolder, outputFolder }) => {
  if (fileNames) {
    const tomlFiles = readFile({ inputFolder, fileNames })
    const parsedToml = tomlFiles.map((file) => toml.parse(file))
    write({ outputFolder, data: parsedToml, fileNames })
  } else {
    console.log(RED, 'Unable to find files to read')
  }
}

const useConfigFile = (config) =>
  R.tryCatch(
    () => {
      console.log(CYAN, '[ Using config file ]')
      const file = config ? path.join(__dirname, `../${config}`) : CONFIG_FILE
      const tomlFile = fs.readFileSync(file)
      const configFile = toml.parse(tomlFile)
      const inputFolder = INPUT_DIR(configFile['input-directory'])
      const outputFolder = OUTPUT_DIR(configFile['output-directory'])
      return readDir({
        inputFolder,
        outputFolder,
      })
    },
    (error) => {
      console.log(RED, error)
      return null
    }
  )()

const useArgv = (argv) => {
  console.log(CYAN, '[ Using arguments from argv ]')
  const [input, output, ...fileNames] = argv
  if (fileNames.length) {
    const inputFolder = INPUT_DIR(input)
    const outputFolder = OUTPUT_DIR(output)
    return {
      fileNames: fileNames.map((name) => name.split('.toml')[0]),
      inputFolder,
      outputFolder,
    }
  } else {
    return readDir({
      inputFolder: INPUT_DIR(input),
      outputFolder: OUTPUT_DIR(output),
    })
  }
}

// --[ RUN SCRIPT ]------------------------------------------------------------

// get command line arguments
const { _: argv } = yargs(process.argv.slice(2))

if (argv.length === 0) {
  createJSON(useConfigFile())
} else if (argv.length === 1) {
  createJSON(useConfigFile(argv[0]))
} else if (argv.length >= 2) {
  createJSON(useArgv(argv))
} else {
  console.log(RED, 'Invalid number of arguments')
}
