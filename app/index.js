"use strict";

var _ = require("lodash");
var chalk = require("chalk");
var yeoman = require("yeoman-generator");
var beautify = require("js-beautify");
var fs = require("fs");
var rimraf = require("rimraf");
var replace = require("replace");

var ReactComponentGenerator = yeoman.generators.Base.extend({

  promptUser: function () {
    var done = this.async();
    var msg = "Welcome to Formidable React Component generator";
    this.log("\n" + chalk.bold.underline(msg));

    var prompts = [{
      type: "input",
      name: "inputName",
      message: "Please name your component",
    }, {
      type: "input",
      name: "author",
      message: "Please enter an author name"
    }, {
      type: "input",
      name: "ghUser",
      message: "What github username / organization should this package be published under?",
    }];

    this.prompt(prompts, function (props) {
      _.extend(this, props);
      this.componentName = _.capitalize(_.camelCase(this.inputName));
      this.projectName = _.kebabCase(_.deburr(this.inputName));
      this.repo = _.kebabCase(_.deburr(this.ghUser));
      this.git = "https://github.com/" + this.repo + "/" + this.projectName;
      this.destinationRoot(this.projectName);
      done();
    }.bind(this));
  },

  getBoilerplate: function () {
    var done = this.async();
    var msg = "Fetching Boilerplate";
    this.log("\n" + chalk.cyan(msg));
    this.remote(
      "formidablelabs",
      "formidable-react-component-boilerplate",
      "master",
      function (err, remote) {
        remote.directory(".", ".");
        done();
      },
      true // removes the cached data so boilerplate is always up to date.
    );
  },

  install: {
    replaceNames: function () {
      var msg = "replacing boilerplate names";
      this.log("\n" + chalk.cyan(msg));
      replace({
        regex: "boilerplate-component",
        replacement: this.projectName,
        paths: [this.destinationRoot()],
        recursive: true,
        silent: true,
        excludes: ["*.MD"]
      });

      replace({
        regex: "BoilerplateComponent",
        replacement: this.componentName,
        paths: [this.destinationRoot()],
        recursive: true,
        silent: true,
        exclude: ["*.MD"]
      });
    },

    renameFiles: function () {
      var msg = "renaming files";
      this.log("\n" + chalk.cyan(msg));
      fs.rename(
        this.destinationRoot() + "/src/components/boilerplate-component.jsx",
        this.destinationRoot() + "/src/components/" + this.projectName + ".jsx",
        function (err) {
          if (err) {
            this.log("\n" + chalk.red("could not rename " +
              this.destinationRoot() +
              "/src/components/boilerplate-component.jsx")
            );
          }
        }.bind(this)
      );
      fs.rename(
        this.destinationRoot() +
        "/test/client/spec/components/boilerplate-component.spec.jsx",
        this.destinationRoot() +
        "/test/client/spec/components/" + this.projectName + ".spec.jsx",
        function (err) {
          if (err) {
            this.log("\n" + chalk.red(this.destinationRoot() +
              "/test/client/spec/components/boilerplate-component.spec.jsx")
            );
          }
        }.bind(this)
      );
    },

    updateJSON: function () {
      var done = this.async();
      var msg = "Updating package.json";
      this.log("\n" + chalk.cyan(msg));
      var jsonFile = JSON.parse(this.read(this.destinationRoot() + "/package.json"));
      jsonFile.name = this.projectName;
      jsonFile.description = "";
      jsonFile.repository.url = this.git + ".git";
      jsonFile.author = this.author;
      jsonFile.bugs.url = this.git + "/issues";
      jsonFile.homepage = this.git;
      var updatedJSON = beautify(JSON.stringify(jsonFile), {indent_size: 2});
      var args = [this.destinationRoot() + "/package.json"];
      rimraf(this.destinationRoot() + "/package.json", function () {
        this.write(this.destinationRoot() + "/package.json", updatedJSON);
        done();
      }.bind(this));
    },

    install: function() {
      this.log("\n" + chalk.cyan("Installing Project Dependencies"));
      this.npmInstall();
    }
  },

  end: {
    goodbye: function () {
      this.log("\n" + chalk.green.underline("SUCCESS"));
    }
  }
});

module.exports = ReactComponentGenerator;