# http-tracer
Module for tracing of HTTP and HTTPS requests

## Usage
Just enable http-tracer and do make your requests. Then disable one if you need.

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
