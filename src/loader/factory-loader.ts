/**
 * Use default export from module to create observable, or observable-like
 */

/// <reference path="../../typings/tsd.d.ts" />
'use strict';

import {Observable} from 'rxjs';

function createObservable<T>(factory: () => Promise<T>): Observable<T> {
  const topic: Promise<T> = factory();

  if (topic instanceof Promise) {
    const lazyRec: () => Observable<T> = () => {
      console.log('here');
      return Observable.defer(factory).concat(
          Observable.timer(60 * 60 * 1000).flatMap(() => lazyRec()));
    };

    return Observable.fromPromise(topic).concat(
        Observable.timer(60 * 60 * 1000).flatMap(() => lazyRec()));
  } else {
    return Observable.from<T>(topic);
  }
}

function loader(name: string, req: any, onload: (param: any) => any) {
  const factory = require(name).default;
  onload(createObservable(factory));
}

export default loader;
