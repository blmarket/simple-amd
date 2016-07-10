/**
 * Provide pouchdb cache layer for given source observable.
 */

/// <reference path="../../typings/tsd.d.ts" />
'use strict';

import {PouchDoc, PouchDB} from './../common-types';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs';

interface SourceModel {
  src: string; // any string which will be required recursively.
  name: string; // document id for cached data.
}

function create_cache_loader(db: PouchDB) {
  return function loader(name: string|SourceModel, req: any, onload: (param: any) => any) {
    const source: SourceModel = (typeof name === 'string' ? JSON.parse(name) : name);

    const subject = new BehaviorSubject<PouchDoc>(null);
    function update() {
      Observable.fromPromise(db.get(source.name)).subscribe(subject);
    }
    update();

    subject.subscribe(data => {
      console.log(data);
    });

    this.require([ source.src ], (src: Observable<any>) => {
      console.log(src);
      onload(Observable.of(1));
    });
  };
}

export {SourceModel, create_cache_loader};
export default create_cache_loader;
