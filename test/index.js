/* globals it */
var assert = require('assert'),
	httpTracer = require('../index'),
	http = require('http');

it('Should trace default empty request', function(done){
	httpTracer.enable(function(req){
		assert(req instanceof http.ClientRequest);
		done();
	});

	http.request().end();

	httpTracer.disable();
});

it('Should trace real requests', function(done){
	httpTracer.enable(function(req){
		assert(req instanceof http.ClientRequest);
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
