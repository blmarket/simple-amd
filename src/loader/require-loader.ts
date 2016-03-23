/**
 * Instead of nodeRequire in requirejs, we provide plugin to load
 * node modules.
 */
'use strict';

function loader(name: string, req: any, onload: (param: any) => any) {
  onload(require(name));
}

export default loader;
