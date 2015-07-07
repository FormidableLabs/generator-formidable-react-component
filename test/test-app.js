/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('running the generator', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
      .withPrompt({ someOption: true })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'package.json',
      '.eslintrc',
      '.gitignore',
      'Gulpfile.js',
      'karma.config.js',
      'webpack.config.js',
      'README.md',
      'index.js'
    ]);
  });
});