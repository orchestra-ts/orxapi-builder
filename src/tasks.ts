import {IOrxapiBuilderContext} from "./data";
import {src} from "fuse-box/sparky";
import {buildPageScript, buildPageStyle} from "./orxapi.builder.build";
import {core, fonts, scripts, styles, target} from "./orxapi.builder.copy";
import {checkCore} from "./orxapi.builder.test";

/**
 * Only to sample a OrxapiBuilderTask
 */
export async function sample() {
  console.log("Loading sample task");
}

/**
 * Display configuration of Fusebox Context
 * @param context
 */
export async function displayContext(context) {
  console.log("Display context configuration", context);
}

/**
 * Default check task
 * @param context
 */
export async function check(context: IOrxapiBuilderContext) {
  await checkCore(context);
}


/**
 * Clean default fusebox promise
 * @param context
 * @returns {Promise<void>}
 */
export async function clean(context: IOrxapiBuilderContext) {
  await cleanFolder(context.tmpdir, "__tmpdir has not been declared", context.debugEnabled);
  await cleanFolder(context.distdir, "__distdir has not been declared", context.debugEnabled);
  await cleanFolder(context.targetdistdir, "__targetdistdir has not been declared", context.debugEnabled);
}

async function cleanFolder(folder: string, fallbackMsg: string, isDebugEnabled: boolean = false) {
  if (folder) {
    if (isDebugEnabled) {
      console.log(`---> Clean ${folder}`);
    }
    await src(folder).clean(folder).exec();
  } else {
    console.error(fallbackMsg);
  }
}

/**
 * Launch
 * @param context
 * @returns {Promise<void>}
 */
export async function copy(context: IOrxapiBuilderContext) {
  if (context.debugEnabled) {
    console.log("Launch copy");
  }
  await styles(context, context.catalogNames, context.tmpdir);
  await scripts(context, context.catalogNames, context.tmpdir);
  await fonts(context, context.catalogNames);
  await core(context, context.catalogNames, context.tmpdir);
  if (context.debugEnabled) {
    console.log("End copy");
  }
}

/**
 * Launch
 * @param context
 * @returns {Promise<void>}
 */
export async function copyTarget(context: IOrxapiBuilderContext) {
  if (context.debugEnabled) {
    console.log("Launch copy target");
  }
  await target(context.distdir, context.resourcesdir);
  if (context.debugEnabled) {
    console.log("End copy target");
  }
}

/**
 *
 * @param context
 * @returns {Promise<void>}
 */
export async function buildScripts(context: IOrxapiBuilderContext) {
  if (context.debugEnabled) {
    console.log("Launch build:scripts");
  }
  await context.applyAsyncFunctionToCatalogName(async (catalogName: string) => {
    let pages = await context.pages(catalogName, context.filetypes.scripts.extensions);
    for(let i in pages) {
      await buildPageScript(context, catalogName, pages[i]);
    }
  });

  if (context.debugEnabled) {
    console.log("End build scripts!");
  }
}

/**
 *
 * @param context
 * @returns {Promise<void>}
 */
export async function buildStyles(context: IOrxapiBuilderContext) {
  if (context.debugEnabled) {
    console.log("Launch build styles");
  }
  await context.applyAsyncFunctionToCatalogName(async (catalogName: string) => {
    let pages = await context.pages(catalogName, context.filetypes.styles.extensions);
    for(let i in pages) {
      await buildPageStyle(context, catalogName, pages[i]);
    }
  });
  if (context.debugEnabled) {
    console.log("End build styles!");
  }
}
