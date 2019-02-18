import {OrxapiBuilderParser} from "./program";
import {IOrxapiBuilderContext, IOrxapiBuilderOptions} from "./data";
import {getDefaultFuseboxConfig} from "./config";
import {iterateWithAsyncCallback, listDirectoryInPath} from "./utils";
import {FuseBoxOptions} from "fuse-box";
import * as fs from "fs";

export class OrxapiBuilderContext implements IOrxapiBuilderContext {

  public readonly options: IOrxapiBuilderOptions;
  public readonly ctxt: IOrxapiBuilderContext;
  public readonly basedir: string = '.';
  public readonly tmpdir: string = "./tmp/build/front";
  public readonly distdir: string = "./dist";
  public readonly distdirAbsolute: string = `${__dirname}/dist`;
  public readonly resourcesdir: string = "./src/main/resources";
  public readonly targetdistdir: string = "./src/main/resources/dist";
  public readonly configurationdir: string = "./src/main/resources/configuration";
  public readonly appdir: string = "./src/main/front";
  public readonly defaultCatalogName: string = "default";
  public readonly debugEnabled: boolean;
  public catalogNames: string[];
  public readonly filetypes = {
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
   * Default constructor
   * @param args
   * @param c
   */
  constructor(args: string[] = process.argv, c: IOrxapiBuilderContext = {}) {
    console.log("---> Context OrxapiBuilder initialization ;)");
    this.options = OrxapiBuilderParser.retrieveOptions(args);
    this.debugEnabled = this.options.debug ? this.options.debug : false;
    this.loadContext(c);
    this.loadCatalogNames();
  }

  /**
   * Retrieve pages for a specific catalog configuration
   * @param catalogName
   * @param extensions
   */
  public async pages(catalogName: string, extensions: string[]): Promise<string[]> {

    let pagesFolder = `${this.tmpdir}/${catalogName}/pages`;

    let listPages = listDirectoryInPath(pagesFolder);

    const pages = this.options.page ? this.options.page : listPages;

    let filteredPages = pages.filter(p => {
      let fsl = extensions.filter(ext => fs.existsSync(`${pagesFolder}/${p}/${p}${ext}`));
      return fsl.length > 0;
    });

    console.log("filteredPages", filteredPages);

    return await filteredPages;
  }

  /**
   * Enable to launch a callback over all catalog names.
   * Avoid using the same implementation with forEach multiple times
   * @param callback
   */
  public async applyAsyncFunctionToCatalogName(callback) {
    await iterateWithAsyncCallback(this.catalogNames, callback);
  };

  /**
   * Initialize fusebox configuration
   * @param catalogName
   */
  public getFuseboxConfig(catalogName): FuseBoxOptions {
    return Object.assign({},
        getDefaultFuseboxConfig(this.tmpdir, catalogName), {
          output: `${this.distdir}/${catalogName}/assets/js/$name.js`,
          debug: true
        })
  }

  /**
   * Override context with launched parameters
   * @param c
   */
  private loadContext(c: IOrxapiBuilderContext = {}): IOrxapiBuilderContext {
    return Object.assign(this, c);
  }

  /**
   * Retrieve catalog names from configuration folder
   * @return {string[]}
   */
  private loadCatalogNames(): void {
    this.catalogNames = this.options.catalog ? this.options.catalog : listDirectoryInPath(`${this.configurationdir}`)
  }

}
