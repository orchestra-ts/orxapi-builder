import {IOrxapiBuilderContext} from "./data";

const {FuseBox} = require("fuse-box");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * Build page ts files
 * @param context
 * @param catalogName
 * @param page
 * @returns {Promise<void>}
 */
export async function buildPageScript(context: IOrxapiBuilderContext, catalogName, page) {

  // Initialize fuse
  let fuseboxConfig = context.getFuseboxConfig(catalogName);

  console.log("Build page script parameters", catalogName, page, fuseboxConfig);

  const fuse = await FuseBox.init(fuseboxConfig);

  // Create bundle
  fuse.bundle(page)
  .cache(true)
  .log(true)
  .sourceMaps(true)
  .target("browser")
  .instructions(`> pages/${page}/${page}.ts`);

  // Run build
  await fuse.run();
}

/**
 * Build page scss files
 * @param context
 * @param catalogName
 * @param page
 */
export async function buildPageStyle(context: IOrxapiBuilderContext, catalogName, page){
  await buildScss(`${context.tmpdir}/${catalogName}/pages/${page}/${page}.scss`,`${context.distdir}/${catalogName}/assets/css/${page}.css`);
}

export async function buildScss(input: string, output: string) {
  let cmd = 'node-sass ' +
      `--output-style expanded ` +
      `--source-map true ` +
      `--source-map-contents true ` +
      `--precision 6 ` +
      input +
      ` ` +
      output ;
  const {stderr } = await exec(cmd);
  if (stderr) {
    console.error(`error: ${stderr}`);
    process.exit(1);
  }
}
