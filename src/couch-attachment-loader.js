/**
 * Created by blmarket on 12/31/15.
 */
function create(db) {
  return function (name, req, onload) {
    var parts = name.split('#');
    if (parts.length === 1) {
      throw 'invalid arguments';
    }
    db.getAttachment(parts[0], parts[1], function (err, doc) {
      if (err != null) {
        throw err;
      }
      if (doc instanceof Blob) {
        var reader = new FileReader();
        reader.onload = function (event) {
          onload.fromText(name, event.target.result);
        };
        reader.readAsText(doc);
      }
      else {
        onload.fromText(name, doc.toString());
      }
    });
  };
}
exports.__esModule = true;
exports["default"] = create;
//# sourceMappingURL=couch-attachment-loader.js.map
