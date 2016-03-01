/**
 * Created by blmarket on 2/21/16.
 */
'use strict';

const topic = require('../lib/index');
const Loader = topic.Loader;

describe('simple amd loader', function() {
  it('exists', function(done) {
    done(!Loader);
  });

  it('can be instantiated', function(done) {
    const loader = new Loader({
      paths: {
        doc(name, opt, callback) {
          callback(name);
        }
      }
    });

    loader.require(['doc!asdf'], function(data) {
      expect(data).toEqual('asdf');
      done(!loader);
    });
  });
});

