/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mesh } from "three";

export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export function isMesh(object: any): object is Mesh {
  return object.isMesh;
}
