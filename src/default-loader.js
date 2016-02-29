/**
 * Created by blmarket on 2/21/16.
 */
'use strict';
var index_1 = require('./index');
var couch_attachment_loader_1 = require('./couch-attachment-loader');
var couch_observable_loader_1 = require('./couch-observable-loader');
function create_loader(db, modules) {
  var attachment_loader = couch_attachment_loader_1.create(db);
  var doc_loader = couch_observable_loader_1.create(db);
  var loader = new index_1["default"]({
    paths: {
      attachment: attachment_loader,
      doc: doc_loader
    }
  });
  for (var _i = 0; _i < modules.length; _i++) {
    var it = modules[_i];
    loader.define(it, [], function () {
      return modules[it];
    });
  }
}
exports.__esModule = true;
exports["default"] = create_loader;
//# sourceMappingURL=default-loader.js.map
