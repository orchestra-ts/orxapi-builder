import {IOrxapiBuilderContext} from "./data";

const {checkParameter} = require("./utils");
const {src} = require("fuse-box/sparky");

const filetypes = {
  templates: {
    extensions: [".ftl", ".html"],
    distdir: "/templates"
  },
  styles: {
    extensions: [".scss", ".css"]
  },
  scripts: {
    extensions: [".ts", ".tsx", ".js"]
  },
  mocksApp: {
    sourcedir: "/mocks",
    tmpdir: "/mocks",
    distdir: "/mocks",
    extensions: [".*"]
  },
  mocksPages: {
    sourcedir: "/pages",
    tmpdir: "/mocks/pages",
    distdir: "/mocks/pages",
    extensions: [".json"]
  },
  mocksComponent: {
    sourcedir: "/components",
    tmpdir: "/mocks/components",
    distdir: "/mocks/components",
    extensions: [".json"]
  },
  images: {
    sourcedir: "/_core",
    tmpdir: "/assets",
    distdir: "/assets",
    extensions: [".jpg", ".png", ".gif", ".svg"]
  },
  fonts: {
    sourcedir: "/_core/fonts",
    tmpdir: "/assets/fonts",
    distdir: "/assets/fonts",
    extensions: [".eot", ".woff", ".ttf", ".svg"]
  }
};

/**
 *
 * @param context
 * @param catalogNames
 * @param srcdir
 */
export async function core(context: IOrxapiBuilderContext, catalogNames: string[], srcdir) {

  let ftCore = Object.keys(filetypes).filter((ft) => {
    let tmpFt = filetypes[ft];
    return tmpFt !== filetypes.styles && tmpFt !== filetypes.scripts && tmpFt !== filetypes.fonts;
  });
  for (let i in ftCore) {
    let ft = ftCore[i];
    let filetype = filetypes[ft];
    await copyFromSrc(context, catalogNames, srcdir, filetype.extensions, filetype.sourcedir, filetype.tmpdir);
    await copyToDist(context, catalogNames, srcdir, filetype.extensions, filetype.tmpdir, filetype.distdir);
  }

}

/**
 *
 * @param fromdir
 * @param destinationdir
 */
export async function target(fromdir, destinationdir) {
  await src(`${fromdir}/**/*`).dest(destinationdir).exec();
}

/**
 *
 * @param context
 * @param catalogNames
 * @param destinationdir
 */
export async function scripts(context: IOrxapiBuilderContext, catalogNames, destinationdir) {
  await copyFromSrc(context, catalogNames, destinationdir, filetypes.scripts.extensions);
}

/**
 *
 * @param context
 * @param catalogNames
 * @param destinationdir
 */
export async function styles(context: IOrxapiBuilderContext, catalogNames, destinationdir) {
  await copyFromSrc(context, catalogNames, destinationdir, filetypes.styles.extensions);
}

/**
 *
 * @param context
 * @param catalogNames
 */
export async function fonts(context: IOrxapiBuilderContext, catalogNames) {
  let filetype = filetypes.fonts;
  await copyFromSrc(context, catalogNames, context.tmpdir, filetype.extensions, filetype.sourcedir, filetype.tmpdir);
  await copyToDist(context, catalogNames, context.tmpdir, filetype.extensions, filetype.tmpdir, filetype.distdir);
}

/**
 *
 * @param context
 * @param catalogNames
 * @param to
 * @param filetype
 * @param sourcedir
 * @param tmpdir
 */
async function copyFromSrc(context, catalogNames, to, filetype, sourcedir = "", tmpdir = "") {
  await context.applyAsyncFunctionToCatalogName(async (c: string) => {
    await orxapiBuilderCopy(context, filetype, `${context.appdir}/${context.defaultCatalogName}${sourcedir}`, `${to}/${c}${tmpdir}`);
    await orxapiBuilderCopy(context, filetype, `${context.appdir}/${c}${sourcedir}`, `${to}/${c}${tmpdir}`);
  });
}

/**
 *
 * @param context
 * @param filetype
 * @param from
 * @param catalogNames
 * @param tmpdir
 * @param distdir
 */
async function copyToDist(context: IOrxapiBuilderContext, catalogNames, from, filetype, tmpdir = "", distdir = "") {
  for (let c in catalogNames) {
    let catalogName = catalogNames[c];
    await orxapiBuilderCopy(context, filetype, `${from}/${catalogName}${tmpdir}`,
        `${context.distdir}/${catalogName}${distdir}`)
  }
}

/**
 * @param context
 * @param filetype
 * @param base
 * @param to
 */
async function orxapiBuilderCopy(context: IOrxapiBuilderContext, filetype, base, to) {
  checkParameter("filetype", filetype);
  checkParameter("to", to);
  for (let i in filetype) {
    let f = filetype[i];
    if (context.debugEnabled) {
      console.log(`--> Copy ${f} : ${base} -----> ${to}`);
    }
    await src(`**/*${f}`, {base}).dest(to).exec();
  }
}
