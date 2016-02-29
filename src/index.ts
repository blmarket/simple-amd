/**
 * AMD loader which supports plugins
 */
'use strict';

import {TypeMap, Pair, AMDModuleDef} from './common-types';

interface LoaderOpts {
  paths?: TypeMap<any>;
}

class Loader {
  modules: TypeMap<Promise<any>>;
  paths: TypeMap<any>;

  constructor(opts: LoaderOpts) {
    this.modules = {};
    this.paths = opts.paths || {};
  }

  static split_prefix(name: string): Pair<string, string> {
    var prefix: string,
      index = name ? name.indexOf('!') : -1;
    if (index > -1) {
      prefix = name.substring(0, index);
      name = name.substring(index + 1, name.length);
    }
    return [prefix, name];
  }

  load(orig_name: string): Promise<any> {
    if (!orig_name) {
      return Promise.resolve(null);
    }
    if (this.modules[orig_name]) {
      return this.modules[orig_name];
    }

    const vec = Loader.split_prefix(orig_name);
    const prefix = vec[0];
    const name = vec[1];

    return new Promise(resolve => {
      interface LocalFunc {
        (): any;
        fromText: (name: string, value: string) => any;
      }

      (<LocalFunc> resolve).fromText = (moduleName, text) => {
        // TODO(blmarket): cannot register name for modules defined from plugin.
        const amd_define = (deps: string[], fn: any) => {
          resolve(this.require(deps, fn));
        };
        new Function('define', text)(amd_define);
      };

      if (!prefix) {
        // we assume name is relative path, so using xhr for path resolution.
        const xhr = new XMLHttpRequest();
        xhr.open('GET', name, false); // as sync api is good enough for 'file://' paths
        xhr.send();
        const content = xhr.responseText;

        (<LocalFunc> resolve).fromText(null, content);
        return;
      }

      this.paths[prefix](name, null, resolve);
    });
  }

  // TODO(blmarket): support unnamed module? why?
  define(module_id: string, deps: string[], fn: AMDModuleDef) {
    if (this.modules[module_id]) {
      return;
    }
    this.modules[module_id] = this.require(deps, fn);
  }

  require(deps: string[], fn: AMDModuleDef) {
    return Promise.all(deps.map(it => this.load(it))).then(data => {
      return fn.apply(null, data);
    }).catch(err => {
      console.log('Error while loading', err);
      throw err;
    });
  }
}

export { LoaderOpts, Loader, Loader as default };
