import * as fs from "fs";
import {join} from "path";

/**
 * Check required parameters
 * @param param
 * @param value
 */
export function checkParameter(param, value) {
  console.assert(value !== undefined && value.length > 0,
      `Parameter ${param} is mandatory`);
}

/**
 * List all directories in path
 * @param pathDir
 * @return string[]
 * @return string[]
 */
export function listDirectoryInPath(pathDir: string): string[] {
  return fs.readdirSync(pathDir).filter(f => fs.statSync(join(pathDir, f)).isDirectory())
}

/**
 * Enable to launch a callback over all catalog names.
 * Avoid using the same implementation with forEach multiple times
 * @param array
 * @param callback
 */
export async function iterateWithAsyncCallback(array: string[], callback: any) {
  for (let a in array) {
    let element = array[a];
    await callback(element);
  }
}
