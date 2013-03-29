# jsdoc3-dash

Creates a [jsdoc3](https://github.com/jsdoc3/jsdoc3.github.com) docset for the source documentation browser, [Dash](http://kapeli.com/).

## Building

The current jsdoc3 docset is in the `build` directory. To rebuild the documentation:

- `> npm install`
- `> jake build`

This will pull the current `master` branch from the jsdoc3 repository into a `.tmp` directory and parse the source files to rebuild the docset.

## Installing

1. Open Dash
2. Go to `Dash -> Preferences -> Docsets` and click the `+` icon (Add Docset) in the lower-left of the dialog
3. Navigate to the project `build` directory
4. Choose the `jsdoc3.docset` directory to include in your Dash docsets