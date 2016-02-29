/**
 * AMD loader which supports plugins
 */
'use strict';
var Loader = (function () {
    function Loader(opts) {
        if (!opts) {
            opts = {};
        }
        this.modules = {};
        this.paths = opts.paths;
    }
    Loader.split_prefix = function (name) {
        var prefix, index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    };
    Loader.prototype.load = function (orig_name) {
        var _this = this;
        if (!orig_name) {
            return Promise.resolve(null);
        }
        if (this.modules[orig_name]) {
            return this.modules[orig_name];
        }
        var vec = Loader.split_prefix(orig_name);
        var prefix = vec[0];
        var name = vec[1];
        return new Promise(function (resolve) {
            resolve.fromText = function (moduleName, text) {
                // TODO(blmarket): cannot register name for modules defined from plugin.
                var amd_define = function (deps, fn) {
                    resolve(_this.require(deps, fn));
                };
                new Function('define', text)(amd_define);
            };
            if (!prefix) {
                // we assume name is relative path, so using xhr for path resolution.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', name, false); // as sync api is good enough for 'file://' paths
                xhr.send();
                var content = xhr.responseText;
                resolve.fromText(null, content);
                return;
            }
            _this.paths[prefix](name, null, resolve);
        });
    };
    // TODO(blmarket): support unnamed module? why?
    Loader.prototype.define = function (module_id, deps, fn) {
        if (this.modules[module_id]) {
            return;
        }
        this.modules[module_id] = this.require(deps, fn);
    };
    Loader.prototype.require = function (deps, fn) {
        var _this = this;
        return Promise.all(deps.map(function (it) { return _this.load(it); })).then(function (data) {
            return fn.apply(null, data);
        }).catch(function (err) {
            console.log('Error while loading', err);
            throw err;
        });
    };
    return Loader;
})();
exports.__esModule = true;
exports["default"] = Loader;
//# sourceMappingURL=index.js.map