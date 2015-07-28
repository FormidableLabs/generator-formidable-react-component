'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');
var spawn = require('child_process').spawn;
var replace = require('replace');

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
    }];

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
    var done = this.async();
    this.remote(
      'formidablelabs',
      'formidable-react-component-boilerplate',
      'master',
      function (err, remote) {
        remote.directory('.', '.');
        done();
      }.bind(this),
      true // removes the cached data so boilerplate is always up to date.
    );
  },

  install: function() {
    this.npmInstall();
  },

  end: {
    removeDist: function () {
      var done = this.async();
      console.log("removing built directories");
      this.spawnCommand("npm", ["run","clean-dist"]).on('exit', function () {
        done();
      });
    },

    renameProject: function () {
      var done = this.async();
      console.log("replacing \"boilerplate-component\" with \"" + this.projectName + "\"");
      var args = [this.destinationRoot(), "-type","f", "-exec", "sed", "-i", "", "s/boilerplate-component/" + this.projectName + "/g", "{}","+"];
      this.spawnCommand("find", args).on('exit', function () {
        done();
      });
    },

    renameComponent: function () {
      var done = this.async();
      console.log("replacing \"BoilerplateComponent\" with \"" + this.componentName + "\"");
      var args = [this.destinationRoot(), "-type","f", "-exec", "sed", "-i", "", "s/BoilerplateComponent/" + this.componentName + "/g", "{}","+"];
      this.spawnCommand("find", args).on('exit', function () {
        done();
      });
    },

    renameFiles: function () {
      // TODO find a more robust method
      var done = this.async();
      console.log("renaming src/components/boilerplate-component.jsx to src/components/" + this.projectName + ".jsx");
      var args = [this.destinationRoot() + "/src/components/boilerplate-component.jsx", "./src/components/" + this.projectName + ".jsx"];
      this.spawnCommand("mv", args).on('exit', function () {
        done();
      });
    },

    goodbye: function () {
      this.log(
        "\n" + chalk.green.underline("SUCCESS");
      );
    }
  }
});

module.exports = ReactComponentGenerator;