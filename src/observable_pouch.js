/**
 * Created by blmarket on 1/29/16.
 */
var Rx = require('rx');
/**
 * Creates shared observable which follows recent updates.
 *
 * @param db {PouchDB} instance
 * @returns {Observable<T>} observable for database
 */
function create_change(db) {
    return Rx.Observable.create(function (ob) {
        var db_channel = db.changes({
            since: 'now',
            live: true
        }).on('error', function (err) { return ob.onError(err); })
            .on('change', function (ch) { return ob.onNext(ch); })
            .on('complete', function () { return ob.onCompleted(); });
        return function dispose() {
            db_channel.cancel();
        };
    }).share();
}
/**
 * @param db PouchDB database instance.
 * @returns {(String)=>Observable<PouchDocument>} factory function which creates observable for given document.
 */
function create_observable_document(db) {
    var topic = create_change(db);
    return function (doc_id, immediate) {
        var ret = topic.filter(function (ch) { return ch.id === doc_id; }).flatMap(function () {
            return db.get(doc_id);
        });
        if (!immediate) {
            return ret;
        }
        return ret.merge(db.get(doc_id));
    };
}
exports.__esModule = true;
exports["default"] = create_observable_document;
//# sourceMappingURL=observable_pouch.js.map