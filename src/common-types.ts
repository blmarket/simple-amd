/**
 * AMD loader which supports plugins
 */
/// <reference path="../typings/node/node.d.ts" />
'use strict';

interface TypeMap<T> {
  [key: string]: T;
}

interface Pair<T1, T2> {
  0: T1;
  1: T2;
}

interface AMDModuleDef {
  (dependencies: any[]): any;
}

interface PouchDoc {
  _id: string;
  _rev: string;
}

interface PouchDB {
  getAttachment: (docId: string, attachmentId: string, callback: (err: any, doc: Blob|Buffer) => void)
    => Promise<Object>;
  get: (docId: string) => Promise<PouchDoc>;
  put: (doc: Object) => Promise<Object>;
}

export {TypeMap, Pair, AMDModuleDef, PouchDoc, PouchDB};
