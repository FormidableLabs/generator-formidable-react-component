"use strict";

var _ = require("lodash");
var chalk = require("chalk");
var yeoman = require("yeoman-generator");
var beautify = require("js-beautify");

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
    installUtilites: function () {
      var done = this.async();
      var msg = "Installing Utilities";
      this.log("\n" + chalk.cyan(msg));
      var args = ["install", "replace"];
      this.spawnCommand("npm", args).on("exit", function () {
        done();
      });
    },

    renameProject: function () {
      var done = this.async();
      var msg = "replacing \"boilerplate-component\" with \"" + this.projectName + "\"";
      this.log("\n" + chalk.cyan(msg));
      var args = ["boilerplate-component", this.projectName];
      this.spawnCommand("replace", args).on("exit", function () {
        done();
      });
    },

    renameComponent: function () {
      var done = this.async();
      var msg = "replacing \"BoilerplateComponent\" with \"" + this.componentName + "\"";
      this.log("\n" + chalk.cyan(msg));
      var args = ["BoilerplateComponent", this.componentName];
      this.spawnCommand("replace", args).on("exit", function () {
        done();
      });
    },

    renameFiles: function () {
      // TODO: figure out a more robust method to rename this file
      var done = this.async();
      var msg = "renaming src/components/boilerplate-component to src/components/" + this.projectName + "\"";
      this.log("\n" + chalk.cyan(msg));
      var args = [this.destinationRoot() + "/src/components/boilerplate-component.jsx", "./src/components/" + this.projectName + ".jsx"];
      this.spawnCommand("mv", args).on("exit", function () {
        done();
      });
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
      this.spawnCommand("rm", args).on("exit", function () {
        this.write(this.destinationRoot() + "/package.json", updatedJSON);
        done();
      }.bind(this));
    },

    uninstallUtilities: function () {
      var done = this.async();
      var msg = "Cleaning Up Utilities";
      this.log("\n" + chalk.cyan(msg));
      var args = ["uninstall", "replace"];
      this.spawnCommand("npm", args).on("exit", function () {
        done();
      });
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