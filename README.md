# http-tracer [![Build Status](https://travis-ci.org/frux/http-tracer.svg?branch=master)](https://travis-ci.org/frux/http-tracer)
Module for tracing outcoming HTTP requests

## Usage
Install module via npm:

``npm install http-tracer``

Then just enable ``http-tracer`` and make your requests as usual. Disable tracing afterwards if you don't need one.

```js
var httpTracer = require('http-tracer');

httpTracer.enable();

require('http').request({
        hostname: 'registry.npmjs.org',
        path: '/http-tracer',
        headers: {
            'X-Test-Header': 'Hello world!'
        }
    }).end();

httpTracer.disable();
```

You can not to provide any callback if you need just to console.log all of traced data. ``http-tracer`` do it by default.

Example of script output:

![http-trace otput](https://habrastorage.org/files/77b/a89/4f8/77ba894f8910455fafe451ee5d48c4d0.png)

``http-tracer`` is compatible with any module using http.request function (https, got, asker, etc.).
