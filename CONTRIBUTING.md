# Contributing

Want to contribute a change to Snazzy Info Window or fix an issue? Great! Follow
the steps below to setup your environment, make your change, and create a pull
request.

## Getting Started

You can clone this repository locally from GitHub by running this command
in your command line:

    git clone https://github.com/atmist/snazzy-info-window.git

If you want to make contributions to the project, [forking the project][fork]
is the easiest way to do this. You can then clone down your fork instead:

    git clone https://github.com/MY-USERNAME-HERE/snazzy-info-window.git

[fork]: https://help.github.com/articles/fork-a-repo/

## Required Libraries

- npm
- [EditorConfig][editor config] plugin for your editor of choice

[editor config]: http://editorconfig.org/

## Making Changes

Now that you have the code you can get it running locally. The project is
written in ES6 and transpiled into JavaScript with Babel so a build step is
required before using the project in the browser.

Install development dependencies:

    npm install

Run the build for testing purposes:

    gulp build:test

This will create the necessary files in the test directory. You can then open
`./test/index.html` or `./test/multi.html` for testing the plugin on a map.
Now it's time to make your change! Run `gulp help` to see other
available commands.

Run a watch:

    gulp watch

Make the necessary code changes. Every time you save a file, it will trigger
a build of the JavaScript and SCSS files and lint everything according to our
style guidelines below. You can then just refresh the browser to see your
change.

Once you've made your changes, write a good commit message, push to your fork,
and submit a [pull request][pull request]. We will respond as soon as possible.

[pull request]: https://help.github.com/articles/about-pull-requests/

## Style Guidelines

To maintain consistent code style between developers we lint both the
JavaScript and SCSS code in the project using ESLint and SASSLint.

For JavaScript we use the `airbnb-base` rules for ESLint with a
few customizations outlined in the `.eslintrc` file. SASS Lint has their own
SCSS rules with our customizations outlined in `.sass-lint.yml` file.
