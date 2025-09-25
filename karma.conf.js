const karmaJasmine = require("karma-jasmine");
const angularCliKarma = require("@angular-devkit/build-angular/plugins/karma");
const karmaCoverage = require("karma-coverage");
const karmaChromeLauncher = require("karma-chrome-launcher");
const karmaMochaReporter = require("karma-mocha-reporter");

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      karmaJasmine,
      angularCliKarma,
      karmaCoverage,
      karmaChromeLauncher,
      karmaMochaReporter,
    ],
    singleRun: true,
    browsers: ["ChromeHeadless"],
    reporters: ["mocha"],
  });
};
