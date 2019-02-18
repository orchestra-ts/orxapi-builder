import {context, task} from "fuse-box/sparky";
import {getDefaultTasks} from "./config";
import {IOrxapiBuilderTaskConfig} from "./data";
import {OrxapiBuilderContext} from "./orxapi.builder.context";

export function init(option: IOrxapiBuilderTaskConfig = {}) {

  // @ts-ignore
  context(OrxapiBuilderContext);

  let tasks = Object.assign({}, getDefaultTasks(), option);

  Object.keys(tasks).forEach((key: string) => { task(key, tasks[key]) });

}
