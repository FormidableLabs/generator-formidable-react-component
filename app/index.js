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
    }];

    this.prompt(prompts, function (props) {
      _.extend(this, props);
      this.projectName = _.kebabCase(_.deburr(this.inputName));
      this.destinationRoot(this.projectName);
      done();
    }.bind(this));
  },

  getBoilerplate: function () {
    this.remote(
      "formidablelabs",
      "formidable-react-component-boilerplate",
      function (err, remote) {
        remote.directory('.', '.');
        this.npmInstall();
      }.bind(this),
      true // removes the cached remote forcing it to download it fresh each time.
    );
  },

  end: function() {
    this.log(
      '\n' + chalk.green.underline('SUCCESS')
    );
  }

});

module.exports = ReactComponentGenerator;