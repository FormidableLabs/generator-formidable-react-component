"use strict";

var path = require("path");
var assert = require("yeoman-generator").assert;
var helpers = require("yeoman-generator").test;
var os = require("os");

describe("generate project", function () {

  before(function (done) {

    // HACK: Manually increase timeout until we figure out slow tests in
    // https://github.com/FormidableLabs/generator-formidable-react-component/issues/10
    this.timeout(10000);

    helpers
      .run(path.join(__dirname, "../app"))
      .inDir(path.join(os.tmpdir(), "./temp-test"))
      .withOptions({
        "skip-install": true
      })
      .withPrompts({
        inputName: "camelCasedComponent",
        author: "Joe Test",
        ghUser: "joe-test"
      })
      .on("end", done);
  });

  it("creates files", function () {
    assert.file([
      "package.json",
      ".eslintrc-base",
      ".gitignore",
      "karma.conf.js",
      "webpack.config.js",
      "README.md"
    ]);
  });

});
