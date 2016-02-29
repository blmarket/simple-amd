/**
 * Created by blmarket on 1/29/16.
 */
'use strict';

import {Observable, Observer} from 'rxjs';

import {PouchDB} from './common-types';

interface PouchChange {
  id: string;
}

/**
 * Creates shared observable which follows recent updates.
 *
 * @param db {PouchDB} instance
 * @returns {Observable<T>} observable for database
 */
function create_change(db: any): Observable<PouchChange> {
  return Observable.create((ob: Observer<PouchChange>) => {
    const db_channel = db.changes({
      since: 'now',
      live: true
    }).on('error', (err: any) => ob.error(err))
      .on('change', (ch: PouchChange) => ob.next(ch))
      .on('complete', () => ob.complete());

    return function dispose() {
      db_channel.cancel();
    };
  }).share();
}

/**
 * @param db PouchDB database instance.
 * @returns {(String)=>Observable<PouchDocument>} factory function which creates observable for given document.
 */
function create_observable_document(db: PouchDB): (p1: string, p2: boolean) => Observable<Object> {
  const topic: Observable<PouchChange> = create_change(db);
  return function (doc_id: string, immediate: boolean): Observable<Object> {
    const ret = topic.filter(ch => ch.id === doc_id).flatMap(() => {
      return Observable.fromPromise(db.get(doc_id));
    });
    if (!immediate) {
      return ret;
    }
    return ret.merge(db.get(doc_id));
  };
}

export default create_observable_document;
