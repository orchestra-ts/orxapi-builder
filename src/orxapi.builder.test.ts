import {IOrxapiBuilderContext} from "./data";

let fs = require("fs");

/**
 * folderExists
 * @param folder
 * @return {Promise<void>}
 */
export async function folderExists(folder) {
  let promises = folder.map(f => console.assert(fs.existsSync(f), "Folder does not exist : " + f));
  await Promise.all(promises);
}

/**
 * fileExists
 * @param file
 * @return {Promise<void>}
 */
export async function fileExists(file) {
  let promises = file.map(f => console.assert(fs.existsSync(f), "File does not exist : " + f));
  await Promise.all(promises);
}

/**
 * folderContent
 * @param pathToTest
 * @param contentExpected
 */
export function folderContent(pathToTest, contentExpected) {
  let contentToTest = fs.readdirSync(pathToTest);
  console.assert(contentToTest.length === contentExpected.length, "Folder : " + pathToTest + " doesn't contain the same number of files");
  console.assert(contentExpected.filter(d => contentToTest.indexOf(d) !== -1).length === contentToTest.length, "Content expected " + contentExpected + " are not the same as the content to test " + contentToTest);
}

/**
 * Check core implementation
 * @param context
 */
export async function checkCore(context: IOrxapiBuilderContext) {
  console.log("Validation step 1");
  context.applyAsyncFunctionToCatalogName((c) => {
    let fontsDir = `${context.tmpdir}/${c}/assets/fonts`;
    console.log("--> Checking fonts directory", fontsDir);
    let files = fs.readdirSync(fontsDir);
    if (files.length === 0) {
      console.error("No files found under directory", fontsDir);
      process.exit(1);
    }
  })

}
