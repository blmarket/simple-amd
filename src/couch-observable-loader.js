/**
 * own amd loader definition
 * this loader loads observable document from couchdb
 * Usage: 'modulename!docId'
 */
function create(db) {
    var util = require('./observable_pouch');
    var topic_factory = util.create_observable_document(db);
    return function (name, req, onload) {
        onload(topic_factory(name, true));
    };
}
exports.__esModule = true;
exports["default"] = create;
//# sourceMappingURL=couch-observable-loader.js.map