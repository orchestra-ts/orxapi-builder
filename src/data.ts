export interface IOrxapiBuilderOptions {
  catalog: string[];
  page: string[];
  debug: boolean
}

export interface IOrxapiFiletype {
  extensions: string[]
  sourcedir?: string,
  tmpdir?: string,
  distdir?: string,
}

export interface IOrxapiFiletypes {
  templates: IOrxapiFiletype;
  styles: IOrxapiFiletype;
  scripts: IOrxapiFiletype;
  mocksApp: IOrxapiFiletype;
  mocksPages: IOrxapiFiletype;
  mocksComponent: IOrxapiFiletype;
  images: IOrxapiFiletype;
  fonts: IOrxapiFiletype;
}

export interface IOrxapiBuilderContext {
  options?: IOrxapiBuilderOptions;
  debugEnabled?: boolean;
  basedir?: string;
  tmpdir?: string;
  distdir?: string;
  distdirAbsolute?: string;
  resourcesdir?: string;
  targetdistdir?: string;
  configurationdir?: string;
  appdir?: string;
  catalogNames?: string[];
  defaultCatalogName?: string;
  filetypes?: IOrxapiFiletypes
  getFuseboxConfig? (catalogName: string): any;
  pages? (catalogName: string, extensions: string[]): Promise<string[]>;
  applyAsyncFunctionToCatalogName? (...args): any;
}

export interface IOrxapiBuilderTaskConfig {
  [key: string]: any;
}


export interface IOrxapiBuilderConfig {
  useSourceMap?: boolean;
  useUglify?: boolean;
  useLog?: boolean;
  useCache?: boolean;
}

export interface IOrxapiBuilderStyleConfig extends IOrxapiBuilderConfig {

}

export interface IOrxapiBuilderSriptConfig extends IOrxapiBuilderConfig {
  target: string;
}
