/**
 * Created by blmarket on 2/21/16.
 */
'use strict';

import {TypeMap, PouchDB} from './common-types';
import Loader from './index';
import create_attachment_loader from './loader/couch-attachment-loader';
import create_doc_loader from './loader/couch-observable-loader';
import require_loader from './loader/require-loader';
import factory_loader from './loader/factory-loader';

function create_loader(db: PouchDB, modules: TypeMap<any>): Loader {
  const attachment_loader = create_attachment_loader(db);
  const doc_loader = create_doc_loader(db);

  const loader = new Loader({
    paths: {
      attachment: attachment_loader,
      doc: doc_loader,
      factory: factory_loader,
      require: require_loader
    }
  });

  for (let key in modules) {
    loader.define(key, [], () => modules[key]);
  }

  return loader;
}

export { create_loader, create_loader as default };
