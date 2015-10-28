# http-tracer
Module for tracing of HTTP and HTTPS requests

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
        hostname: 'rawgit.com',
        path: '/frux/http-tracer/master/README.md',
        headers: {
            'X-Test-Header': 'Hello world!'
        }
    }).end();

httpTracer.disable();
```

This code will output:

```js
{ method: 'GET',
  headers: { 'x-test-header': 'Hello world!', host: 'rawgit.com' },
  rawHeaders: 'GET /frux/http-tracer/master/README.md HTTP/1.1\r\nX-Test-Header: Hello world!\r\nHost: rawgit.com\r\nConnection: close\r\n\r\n',
  protocol: 'http:',
  path: '/frux/http-tracer/master/README.md',
  host: undefined,
  hash: undefined,
  port: 80,
  query: undefined,
  search: undefined,
  body: undefined,
  startedAt: 1445977941098,
  status: 'success',
  statusCode: 200,
  elapsedTime: 597 }
```

``http-tracer`` is compatible with any module using http.request function (https, got, asker, etc.).
