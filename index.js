var http = require('http'),
	chalk = require('chalk'),
	originalOutReq = http.request,
	COLORS = {
		ok: 'green',
		error: 'red',
		dot: 'yellow'
	},
	SIGNS = {
		ok: '✓',
		error: '✘',
		dot: '●'
	};

function _defaultOutReqTracing(req){
	var url = req.agent.protocol + '//' + req._headers.host + req.path,
		startTime = Number(new Date());

	console.log(chalk.grey('-> ') + req.method + ' ' + url);

	req.on('response', function(res){
		var logString = url,
			sign;

		if(res.statusCode >= 300 && res.statusCode < 500){
			sign = 'dot';
			if(res.headers.location){
				logString += chalk.grey(' -> ' + res.headers.location);
			}
		}else if(res.statusCode >= 500){
			sign = 'error';
		}else{
			sign = 'ok';
		}

		logString = chalk[COLORS[sign]](' ' + SIGNS[sign] + ' ' + res.statusCode)  + ' ' + logString + ' ' + chalk.grey(Number(new Date()) - startTime + 'ms');

		console.log(logString);
	});
}

function enable(callback){
	var outReqTracing = callback;

	if(typeof outReqTracing !== 'function'){
		outReqTracing = _defaultOutReqTracing;
	}

	http.request = function(){
		var req = originalOutReq.apply(this, arguments);
		outReqTracing(req);
		return req;
	};
}

function disable(){
	http.request = originalOutReq;
}

module.exports = {
	enable: enable,
	disable: disable
};
