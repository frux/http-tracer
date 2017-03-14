# http-tracer [![Build Status](https://travis-ci.org/frux/http-tracer.svg?branch=master)](https://travis-ci.org/frux/http-tracer)
Module for tracing outcoming HTTP requests

## Usage
Install module via npm:

``npm install http-tracer``

Then just enable ``http-tracer`` and make your requests as usual. Disable tracing afterwards if you don't need one.

```js
const httpTracer = require('http-tracer');
const got = reuqire('got'); // or any another request library

httpTracer.enable();

got('http://registry.npmjs.org/http-tracer')
    .then(() => {
        httpTracer.disable();
    });
```

Example of script output:

![http-trace otput](https://habrastorage.org/files/77b/a89/4f8/77ba894f8910455fafe451ee5d48c4d0.png)

## .enable([params, [cb]])
### ``params.ignore: Array(string|RegExp) = []``

Array of regexps or strings to ignore

```js
httpTracer.enable({
    ignore: [
        /myhost\.com/,
        'http://registry.npmjs.org/npm'
    ]
});
```

### ``cb: (options, req) => void = _defaultTraceOutputFunction``
Function which trace request data. Replaces default output.

```js
httpTracer.enable({}, (options, req){
	console.log(`request on ${options.host}!`);
});
```

``http-tracer`` is compatible with any module using http.request function (https, got, asker, etc.).
