simple-amd
----------

AMD loader for isolated module environment

### Motivation

If you need some module system which does not touch anything in your desk, this would be a good choice.

Compared with [r.js](https://github.com/jrburke/r.js/), our loader provides following things

* Isolated loader system  
r.js declares shared module system, so it cannot hide some of your module from others.
* In-house loader plugin
we're trying to make `simple-amd` to use `r.js` loader plugins, additionally
some loader plugins are included that helps to get data from [pouchdb](http://pouchdb.com/). 
we also welcome plugin suggestion, please file an issue if needed.

### Usage

```javascript
const Loader = require('simple-amd').Loader;
const React = require('react'); // module to be exposed to your module system.

const loader = new Loader({});
loader.define('react', [], () => React);
loader.require('react', (React) => { ... });
```

To use loader with default plugins, use `default-loader`

```javascript
const PouchDB = require('PouchDB');
const React = require('react');
const ReactDOM = require('react-dom');

const create_loader = require('simple-amd/lib/default-loader').create_loader;
const db = new PouchDB(YOUR_HOST);

const loader = create_loader(db, {
  react: React
});
loader.require(['attachment!docId#attachmentId', 'doc!docId'], function(attachment, observableDoc) {
  observableDoc.subscribe(data => {
    // it will render react 'reactive'
    ReactDOM.render(React.createElement(attachment.SomeModule), { data: data });
  });
});
```
