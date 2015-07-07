'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');

var ReactComponentGenerator = yeoman.generators.Base.extend({

  promptUser: function () {
    var done = this.async();
    this.log(
      '\n' + chalk.bold.underline('Welcome to Formidable React Component generator')
    );

    var prompts = [{
      type: 'input',
      name: 'inputName',
      message: 'Please name your component',
    }, {
      type: 'input',
      name: 'author',
      message: 'Please enter an author name'
    }, {
      type: 'input',
      name: 'ghUser',
      message: 'What github username / organization should this package be published under?',
    },];

    this.prompt(prompts, function (props) {
      _.extend(this, props);
      this.componentName = _.capitalize(_.camelCase(this.inputName));
      this.projectName = _.kebabCase(_.deburr(this.inputName));
      this.destinationRoot(this.projectName);
      done();
    }.bind(this));
  },

  scaffoldFolders: function(){
    this.mkdir('demo');
    this.mkdir('src');
    this.mkdir('test');
    this.mkdir('test/spec');
    this.mkdir('test/helpers');
  },

  copyFiles: function() {
    this.copy('eslintrc', '.eslintrc');
    this.copy('gitignore', '.gitignore');
    this.copy('_Gulpfile.js', 'Gulpfile.js');
    this.copy('_karma.config.js', 'karma.config.js');
    this.copy('_webpack.config.js', 'webpack.config.js');
    this.copy('test/helpers/_phantomjs-shims.js', 'test/helpers/phantomjs-shims.js');
    this.copy('test/helpers/_raf-polyfill.js', 'test/helpers/raf-polyfill.js');
    this.copy('demo/_index.html', 'demo/index.html');
    this.template('_package.json', 'package.json');
    this.template('src/_component.js', 'src/' + this.projectName + '.js');
    this.template('_index.js', 'index.js');
    this.template('demo/_app.js', 'demo/app.js');
    this.template('_README.md', 'README.md');
  },

  install: function() {
    this.npmInstall();
  },

  end: function() {
    this.log(
      '\n' + chalk.green.underline('SUCCESS')
    );
  }

});

module.exports = ReactComponentGenerator;