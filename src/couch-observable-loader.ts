/**
 * own amd loader definition
 * this loader loads observable document from couchdb
 * Usage: 'modulename!docId'
 */
'use strict';

import {PouchDB} from './common-types';
import create_observable_document from './observable_pouch';

function create(db: PouchDB) {
  const topic_factory = create_observable_document(db);

  return function(name: any, req: any, onload: (param: any) => any) {
    onload(topic_factory(name, true));
  };
}

export default create;
