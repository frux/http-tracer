const http = require('http');
const chalk = require('chalk');
const originalOutReq = http.request;
const COLORS = {
	ok: 'green',
	error: 'red',
	dot: 'yellow'
};
const SIGNS = {
	arrow: '->',
	ok: '✓',
	error: '✘',
	dot: '●'
};

function getRequestUrl(options) {
	const protocol = options.protocol || 'http';
	const host = options.host || options.hostname || 'localhost';
	return options.href || `${protocol}//${host}${options.path}`;
}

function _defaultHandleRequest(options, req) {
	const url = getRequestUrl(options);
	const startTime = Number(new Date());

	console.log(`${chalk.grey(`${SIGNS.arrow} ${req.method}`)} ${url}`);

	req.on('response', res => {
		let log = url;
		let sign;

		if(res.statusCode >= 300 && res.statusCode < 500){
			sign = 'dot';
			if(res.headers.location){
				log += chalk.grey(` ${SIGNS.arrow} ${res.headers.location}`);
			}
		}else if(res.statusCode >= 500){
			sign = 'error';
		}else{
			sign = 'ok';
		}

		const duration = Number(new Date()) - startTime;
		const prefix = chalk[COLORS[sign]](`${SIGNS[sign]} ${res.statusCode}`);

		console.log(`${prefix} ${log} ${chalk.grey(`${duration}ms`)}`);
	});
}

function enable(params, callback) {
	let handleRequest = callback;

	params = params || {};
	params.ignore = params.ignore || [];

	if (typeof callback === 'function') {
		handleRequest = callback;
	} else {
		handleRequest = _defaultHandleRequest;
	}

	http.request = function (options, cb) {
		const req = originalOutReq.call(this, options, cb);
		const reqUrl = getRequestUrl(options);
		for (const ignored of params.ignore) {
			if (typeof ignored === 'string' && reqUrl === ignored || ignored instanceof RegExp && ignored.test(reqUrl)) {
				return req;
			}
		}
		handleRequest(options, req);
		return req;
	};
}

function disable() {
	http.request = originalOutReq;
}

module.exports = {
	enable: enable,
	disable: disable
};
