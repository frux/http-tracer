const assert = require('assert');
const got = require('got');
const test = require('ava');
const httpTracer = require('../index');
const http = require('http');

test('Should trace real requests', t => {
	httpTracer.enable((options, req) => {
		t.true(req instanceof http.ClientRequest);
	});

	return got('registry.npmjs.org/http-tracer', {
		headers: {
			'X-Test-Header': 'Hello NPM!'
		}
	})
		.then(() => httpTracer.disable())
		.catch(err => console.error(err));
});

test('Should patch request by default callback if callback is not a function', t => {
	var originalRequest = http.request;

	httpTracer.enable('not a function stuff');

	t.true(http.request !== originalRequest);
	httpTracer.disable();
});

test('Should ignore request (string)', t => {
	httpTracer.enable({
		ignore: [
			'http://registry.npmjs.org/csp-header'
		]
	}, (options, req) => {
		t.false(options.hostname === 'registry.npmjs.org' && options.pathname === '/csp-header');
	});

	return got('http://registry.npmjs.org/csp-header')
		.then(() => {
			return got('registry.npmjs.org/http-tracer')
				.then(() => httpTracer.disable());
		})
		.catch(err => console.error(err));
});

test('Should ignore request (RegExp)', t => {
	httpTracer.enable({
		ignore: [
			/registry\.npmjs\.org\/csp/
		]
	}, (options, req) => {
		t.false(options.hostname === 'registry.npmjs.org' && options.pathname === '/csp-header');
	});

	return got('http://registry.npmjs.org/csp-header')
		.then(() => {
			return got('registry.npmjs.org/http-tracer')
				.then(() => httpTracer.disable());
		})
		.catch(err => console.error(err));
});
