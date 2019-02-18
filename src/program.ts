import {IOrxapiBuilderOptions} from "./data";

const program = require("commander");

function listHandler(val: string) {
  return val.split(',');
}

export class OrxapiBuilderParser {

  public static retrieveOptions(args: any[]): IOrxapiBuilderOptions {
    console.log("args logged", args);
    return program
    .arguments("<file>")
    .option("-d, --debug", "Enable debug mode")
    .option("-c, --catalog <catalogName>", "The catalog to build", listHandler)
    .option("-p, --page <pageCode>", "The page to build", listHandler)
    .action(function (file) {
      console.log("catalog: %s page: %s",
          program.catalog, program.page, file);
    })
    .parse(args);
  }

}
