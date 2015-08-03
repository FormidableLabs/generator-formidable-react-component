"use strict";

var path = require("path");
var assert = require("yeoman-generator").assert;
var helpers = require("yeoman-generator").test;
var os = require("os");

describe("generate react project", function () {

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
        ghUser: "joe-test",
        victory: false
      })
      .on("end", done);
  });

  it("creates files", function () {
    assert.file([
      ".eslintrc-base",
      ".gitignore",
      "karma.conf.js",
      "package.json",
      "README.md",
      "webpack.config.js",
      "src/components/camel-cased-component.jsx",
      "src/index.js",
      "test/client/spec/components/camel-cased-component.spec.jsx",
      "test/client/main.js"

      // **Note**: We skip the `npm install` which means `dist` isn't rebuilt and `lib` isn't built.
      // "dist/camel-cased-component.js",
      // "dist/camel-cased-component.js.map",
      // "dist/camel-cased-component.min.js",
      // "dist/camel-cased-component.min.js.map",
      // "lib/components/camel-cased-component.js",
    ]);
  });

  it("rewrites package.json", function () {
    var pkg = "package.json";
    [
      /"name": "camel-cased-component"/,
      /"version": "0.0.1"/,
      /"description": "React Component"/,
      /"url": "https:\/\/github.com\/joe-test\/camel-cased-component.git"/
    ].forEach(function (regex) {
      assert.fileContent(pkg, regex);
    });
  });

  it("rewrites src/components/camel-cased-component.jsx", function () {
    var pkg = "src/components/camel-cased-component.jsx";
    [
      /export default class CamelCasedComponent extends React.Component/
    ].forEach(function (regex) {
      assert.fileContent(pkg, regex);
    });
  });

  it("rewrites test/client/spec/components/camel-cased-component.spec.jsx", function () {
    var pkg = "test/client/spec/components/camel-cased-component.spec.jsx";
    [
      /import Component from "src\/components\/camel-cased-component";/,
      /describe\("components\/camel-cased-component"/
    ].forEach(function (regex) {
      assert.fileContent(pkg, regex);
    });
  });
});

describe("generate victory project", function () {

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
        ghUser: "joe-test",
        victory: true
      })
      .on("end", done);
  });

  it("creates files", function () {
    assert.file([
      ".eslintrc-base",
      ".gitignore",
      "karma.conf.js",
      "package.json",
      "README.md",
      "webpack.config.js",
      "src/components/camel-cased-component.jsx",
      "src/index.js",
      "test/client/spec/components/camel-cased-component.spec.jsx",
      "test/client/main.js"

      // **Note**: We skip the `npm install` which means `dist` isn't rebuilt and `lib` isn't built.
      // "dist/camel-cased-component.js",
      // "dist/camel-cased-component.js.map",
      // "dist/camel-cased-component.min.js",
      // "dist/camel-cased-component.min.js.map",
      // "lib/components/camel-cased-component.js",
    ]);
  });

  it("rewrites package.json", function () {
    var pkg = "package.json";
    [
      /"name": "camel-cased-component"/,
      /"version": "0.0.1"/,
      /"description": "Victory Component"/,
      /"url": "https:\/\/github.com\/joe-test\/camel-cased-component.git"/
    ].forEach(function (regex) {
      assert.fileContent(pkg, regex);
    });
  });

  it("rewrites src/components/camel-cased-component.jsx", function () {
    var pkg = "src/components/camel-cased-component.jsx";
    [
      /@Radium/,
      /class CamelCasedComponent extends React.Component/
    ].forEach(function (regex) {
      assert.fileContent(pkg, regex);
    });
  });

  it("rewrites test/client/spec/components/camel-cased-component.spec.jsx", function () {
    var pkg = "test/client/spec/components/camel-cased-component.spec.jsx";
    [
      /import Component from "src\/components\/camel-cased-component";/,
      /describe\("components\/camel-cased-component"/
    ].forEach(function (regex) {
      assert.fileContent(pkg, regex);
    });
  });
});
