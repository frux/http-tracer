var assert = require('assert'),
    httpTracer = require('../index'),
    http = require('http');

it('Should trace default empty request', function(done){

    httpTracer.enable(function(trace){
        assert.strictEqual(typeof trace, 'object');
        assert.strictEqual(trace.method, 'GET');
        assert.strictEqual(trace.protocol, 'http:');
        assert.strictEqual(trace.port, 80);
        assert.deepEqual(trace.headers, { host: 'localhost' });
        assert.strictEqual(trace.rawHeaders, 'GET / HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n');

        done();
    });

    http.request().end();

    httpTracer.disable();
});

it('Should trace real requests', function(done){

    httpTracer.enable(function(trace){
        assert.strictEqual(typeof trace, 'object');
        assert.strictEqual(trace.method, 'GET');
        assert.strictEqual(trace.protocol, 'http:');
        assert.strictEqual(trace.port, 80);
        assert.deepEqual(trace.headers, { 'x-test-header': 'Hello NPM!', host: 'registry.npmjs.org' });
        assert.strictEqual(trace.rawHeaders, 'GET /http-tracer HTTP/1.1\r\nX-Test-Header: Hello NPM!\r\nHost: registry.npmjs.org\r\nConnection: close\r\n\r\n');
        assert.strictEqual(trace.path, '/http-tracer');
        assert.strictEqual(trace.status, 'success');

        done();
    });

    http.request({
        hostname: 'registry.npmjs.org',
        path: '/http-tracer',
        headers: {
            'X-Test-Header': 'Hello NPM!'
        }
    }).end();

    httpTracer.disable();
});

it('Should patch request by default callback if callback is not a function', function(){
    var originalRequest = http.request;

    httpTracer.enable('not a function stuff');

    assert.notEqual(http.request, originalRequest);
});