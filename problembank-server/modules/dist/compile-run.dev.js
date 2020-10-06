"use strict";

var _require = require('child_process'),
    spawn = _require.spawn;

var path = require('path');

var rs = require('randomstring');

var fs = require('fs-extra'); // TODO REFECTOR THIS


var ROOT = process.env.ROOT_PATH;
var PROBLEM_PATH = process.env.PROBLEM_TEMP_PATH;

var run = function run(projectPath, category) {
  var sourcePath = path.resolve(ROOT, projectPath);
  var docker = null;

  switch (category.toLowerCase()) {
    case "java":
      docker = spawn("docker", ["run", "--rm", "-i", "-v", "".concat(sourcePath, ":/src"), "java-compile-run:1.0"]);
      break;

    case "c":
    case "cpp":
      docker = spawn("docker", ["run", "--rm", "-i", "-v", "".concat(sourcePath, ":/src"), "c-compile-run:1.0"]);
      break;

    case "python":
      docker = spawn("docker", ["run", "--rm", "-i", "-v", "".concat(sourcePath, ":/src"), "python-compile-run:1.0"]);
      break;

    case "r":
      docker = spawn("docker", ["run", "--rm", "-i", "-v", "".concat(sourcePath, ":/src"), "r-compile-run:1.0"]);
      break;
  }

  return docker;
};

var cpplint = function cpplint(projectPath, category) {
  if (category.toLowerCase() !== "cpp") return null;
  var sourcePath = path.resolve(ROOT, projectPath);
  return spawn("docker", ["run", "--rm", "-i", "-v", "".concat(sourcePath, ":/src"), "cpp-lint:1.0"]);
};

var getProblemDocker = function getProblemDocker(source, category) {
  var hash = rs.generate(10);
  var tempPath = path.resolve(PROBLEM_PATH, hash);
  fs.mkdirSync(tempPath);
  var filename;

  switch (category) {
    case "java":
      filename = "Main.java";
      break;

    case "cpp":
      filename = "main.cpp";
      break;

    case "c":
    default:
      filename = "main.c";
      break;

    /*case "python": default:
        filename = "main.py"; break;*/
  }

  var mainFilePath = path.resolve(tempPath, filename);
  fs.createFileSync(mainFilePath);
  fs.writeFileSync(mainFilePath, Buffer.from(source));
  var docker;

  switch (category) {
    case "java":
      docker = spawn("docker", ["run", "--rm", "-i", "-v", "".concat(tempPath, ":/src"), "java-problem-run:1.0"]);
      ;
      break;

    case "cpp":
      docker = spawn("docker", ["run", "--rm", "-i", "-v", "".concat(tempPath, ":/src"), "cpp-problem-run:1.0"]);
      ;
      break;

    case "c":
    default:
      docker = spawn("docker", ["run", "--rm", "-i", "-v", "".concat(tempPath, ":/src"), "c-problem-run:1.0"]);
      ;
      break;
  }

  return docker;
};

module.exports = {
  run: run,
  cpplint: cpplint,
  getProblemDocker: getProblemDocker
};