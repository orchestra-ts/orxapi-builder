/**
 * Default fusebox configuration
 * @return {object}
 */
import {IOrxapiBuilderTaskConfig} from "./data";
import {buildScripts, buildStyles, clean, copy, copyTarget, displayContext} from "./tasks";

/**
 *
 * @param configdir
 * @param catalogName
 */
export function getDefaultFuseboxConfig(configdir: string, catalogName: string) {
  return {
    homeDir: `${configdir}/${catalogName}`,
    tsConfig: "tsconfig.json",
    shim: {
      jquery: {
        source: "./node_modules/jquery/dist/jquery.js",
        exports: "$"
      }
    }
  };
}

/**
 *
 */
export function getDefaultTasks(): IOrxapiBuilderTaskConfig {
  return {
    init: displayContext,
    default: ["init", "clean", "copy", "build:scripts", "build:styles", "copy:target", "check"],
    scripts: ["copy", "build:scripts", "copy:target"],
    styles: ["copy", "build:styles", "copy:target"],
    clean: clean,
    copy: copy,
    check: async (context) => {
      let fbxConfig = context.getFuseboxConfig("test-app");
      console.log("Launch check!");
    },
    "build:scripts": buildScripts,
    "build:styles": buildStyles,
    "copy:target": copyTarget
  };
}
