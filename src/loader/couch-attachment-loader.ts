/**
 * Created by blmarket on 12/31/15.
 */
'use strict';

import {PouchDB} from './../common-types';

function create(db: PouchDB) {
  return function (name: string, req: any, onload: any) {
    const parts = name.split('#');
    if (parts.length === 1) {
      throw 'invalid arguments';
    }

    db.getAttachment(parts[0], parts[1], (err: any, doc: any) => {
      if (err != null) {
        throw err;
      }

      if (doc instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function (event) {
          onload.fromText(name, (<any> event.target).result);
        };
        reader.readAsText(doc);
      } else {
        onload.fromText(name, doc.toString());
      }
    });
  };
}

export default create;
