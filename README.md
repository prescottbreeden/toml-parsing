# toml-parsing

## Description

There are many use cases when creating JSON configuration files can help
improve reusability of different componetns (e.g. navigation menus) and make it
simpler to update hard-coded constants. This could be done directly with TOML,
but comes with some limitations:
- TOML files have to live where you wish to import the files from
- TOML parsing has to happen inside the component that imports the file

This package makes it simpler to define TOML configurations anywhere within an
app and export them to a location of disire in JSON format. JSON is convenient
when consuming because JSON parsing is available in any language and in
JavaScript applications doesn't need to be parsed to consume the data.


## Install

This package is not yet available on NPM. Clone this package into your project
directory to use.

## To Run

### Using a configuration file (recommended)

parse-config.toml
```toml
input-directory = "config-files"
output-directory = "test_output"
```

`$ node {path-to-src}/index.js`

### Using a custom-named configuration file

custom-name.toml
```toml
input-directory = "config-files"
output-directory = "test_output"
```

`$ node {path-to-src}/index.js custom-name.toml`

### Using no configuration file

`$ node {path-to-src}/index.js <path to toml files> <path to json output> [<toml file names>]`

You can target specific TOML files by adding them to the end of the run
command. By default, if no files are specified, the script will convert all
TOML files found within the directory path specified by the first argument.

## TODO
Current laundry debt:

- ignore non-toml files in a directory
- convert to typescript
- add tests
- remove boiler-plate folders and files used for local testing
