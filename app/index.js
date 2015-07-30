"use strict";

var path = require("path");
var _ = require("lodash");
var chalk = require("chalk");
var yeoman = require("yeoman-generator");
var beautify = require("js-beautify");
var fs = require("fs");
var rimraf = require("rimraf");
var replace = require("replace");

module.exports = yeoman.generators.Base.extend({

  promptUser: function () {
    var done = this.async();
    var msg = "Welcome to the Formidable React Component generator";
    this.log("\n" + chalk.bold.underline(msg));

    var prompts = [{
      type: "input",
      name: "inputName",
      message: "Please name your component"
    }, {
      type: "input",
      name: "author",
      message: "Please enter an author name"
    }, {
      type: "input",
      name: "ghUser",
      message: "What github username / organization should this package be published under?"
    }, {
      type: "list",
        name: "victory",
        message: "Are you writing a Victory component?",
        choices: [
          {
            name: "yes",
            value: true
          },
          {
            name: "no",
            value: false
          }
        ]
    }];

    this.prompt(prompts, function (props) {
      _.extend(this, props);
      this.componentName = _.capitalize(_.camelCase(this.inputName));
      this.projectName = _.kebabCase(_.deburr(this.inputName));
      this.repo = _.kebabCase(_.deburr(this.ghUser));
      this.git = "https://github.com/" + this.repo + "/" + this.projectName;
      this.destinationRoot(this.projectName);
      this.boilerplateRepo = this.victory ?
       "victory-component-boilerplate" : "formidable-react-component-boilerplate";
      done();
    }.bind(this));
  },

  getBoilerplate: function () {
    var done = this.async();
    var msg = "Fetching Boilerplate";
    this.log("\n" + chalk.cyan(msg));

    this.remote(
      "formidablelabs",
      this.boilerplateRepo,
      "master",
      function (err, remote) {
        if (err) {
          this.log("\n" + chalk.red("git remote install error: " + err));
          return done();
        }

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
        excludes: ["*.md"]
      });

      replace({
        regex: "BoilerplateComponent",
        replacement: this.componentName,
        paths: [this.destinationRoot()],
        recursive: true,
        silent: true,
        exclude: "*.md"
      });
    },

    renameFiles: function () {
      var done = this.async();
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
          done();
        }.bind(this)
      );
    },

    renameTestFiles: function () {
      var done = this.async();
      var msg = "renaming test files";
      this.log("\n" + chalk.cyan(msg));

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
          done();
        }.bind(this)
      );
    },

    updateJSON: function () {
      var done = this.async();
      var msg = "Updating package.json";
      this.log("\n" + chalk.cyan(msg));

      var jsonFile = JSON.parse(this.read(this.destinationRoot() + "/package.json"));
      jsonFile.version = "0.0.1";
      jsonFile.name = this.projectName;
      jsonFile.description = "";
      jsonFile.repository.url = this.git + ".git";
      jsonFile.author = this.author;
      jsonFile.bugs.url = this.git + "/issues";
      jsonFile.homepage = this.git;

      var updatedJSON = beautify(JSON.stringify(jsonFile), {
        /*eslint-disable camelcase*/
        indent_size: 2
        /*eslint-enable camelcase*/
      });
      var pkgPath = path.join(this.destinationRoot(), "package.json");

      rimraf(pkgPath, function () {
        this.write(pkgPath, updatedJSON);
        done();
      }.bind(this));
    },

    replaceReadme: function () {
      if (this.victory === true) {
        return;
      }
      var done = this.async();
      var msg = "Updating README.md";
      this.log("\n" + chalk.cyan(msg));
      var pkgPath = path.join(this.destinationRoot(), "README.md");

      rimraf(pkgPath, function () {
        this.template("_README.md", "README.md");
        done();
      }.bind(this));
    },

    replaceContributing: function () {
      if (this.victory === true) {
        return;
      }
      var done = this.async();
      var msg = "Updating CONTRIBUTING.md";
      this.log("\n" + chalk.cyan(msg));
      var pkgPath = path.join(this.destinationRoot(), "CONTRIBUTING.md");

      rimraf(pkgPath, function () {
        this.template("_CONTRIBUTING.md", "CONTRIBUTING.md");
        done();
      }.bind(this));
    },

    install: function () {
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
