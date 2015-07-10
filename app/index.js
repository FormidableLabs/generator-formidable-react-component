'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');
var beautify = require('js-beautify');

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
      this.repo = _.kebabCase(_.deburr(this.ghUser));
      this.git = 'https://github.com/' + this.repo + '/' + this.projectName;
      this.destinationRoot(this.projectName);
      done();
    }.bind(this));
  },

  getBoilerplate: function () {
    this.remote(
      'formidablelabs',
      'formidable-react-component-boilerplate',
      function (err, remote) {
        remote.directory('.', '.');
      }.bind(this)
    );
  },

  updateJSON: function () {
    var jsonFile = JSON.parse(this.read(this.destinationRoot() + '/package.json'));
    jsonFile.name = this.projectName;
    jsonFile.repository.url = this.git + '.git';
    jsonFile.author = this.author;
    jsonFile.bugs.url = this.git + "/issues";
    jsonFile.homepage = this.git;
    var updatedJSON = beautify(JSON.stringify(jsonFile), {indent_size: 2});
    this.write(this.destinationRoot() + '/package.json', updatedJSON);
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