# http-tracer [![Build Status](https://travis-ci.org/frux/http-tracer.svg?branch=master)](https://travis-ci.org/frux/http-tracer)
Module for tracing HTTP requests

## Usage
Install module via npm:

``npm install http-tracer``

Then just enable ``http-tracer`` and make your requests as usual. Disable tracing afterwards if you don't need one.

```js
var httpTracer = require('http-tracer');

httpTracer.enable(function(tracedData){
    console.log(tracedData);
});

require('http').request({
        hostname: 'registry.npmjs.org',
        path: '/http-tracer',
        headers: {
            'X-Test-Header': 'Hello world!'
        }
    }).end();

httpTracer.disable();
```

This code will output:

```js
{ method: 'GET',
  headers: { 'x-test-header': 'Hello world!', host: 'registry.npmjs.org' },
  rawHeaders: 'GET /http-tracer HTTP/1.1\r\nX-Test-Header: Hello world!\r\nHost: registry.npmjs.org\r\nConnection: close\r\n\r\n',
  protocol: 'http:',
  path: '/http-tracer',
  host: 'registry.npmjs.org',
  hash: undefined,
  port: 80,
  query: undefined,
  search: undefined,
  body: undefined,
  startedAt: 1446032796034,
  statusCode: 200,
  status: 'success',
  elapsedTime: 734 }
```

``http-tracer`` is compatible with any module using http.request function (https, got, asker, etc.).
