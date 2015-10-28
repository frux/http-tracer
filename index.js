var originalRequest;

function traceResult(req, options){
    return {
        method: req.method,
        headers: req._headers,
        rawHeaders: req._header,
        protocol: req.agent.protocol || options.protocol,
        path: options.path,
        host: req._host,
        hash: options.hash,
        port: options.port || req.agent.defaultPort,
        query: options.query,
        search: options.search,
        body: options.body
    };
}

exports.enable = function(callback){
    var http = require('http');

    if(!originalRequest){
        originalRequest = http.request;
    }

    if(!exports.disable){
        exports.disable = function(){
            http.request = originalRequest;
        };
    }

    if(typeof callback === 'function'){
        http.request = function(options, originalCallback){
            var requestStartTime = +new Date,
                req = originalRequest.call(http, options, function(res){
                    var requestFinishTime = +new Date,
                        traced;

                    if(typeof originalCallback === 'function'){
                        originalCallback.call(this, res);
                    }

                    elapsedTime = requestFinishTime - requestStartTime;

                    traced = traceResult(req, options);
                    traced.startedAt = requestStartTime;
                    traced.status = 'success';
                    traced.statusCode = res.statusCode;
                    traced.elapsedTime = elapsedTime;

                    callback(traced);
                }),
                elapsedTime;

            options = options || {};

            req.on('error', function(e){
                var requestFinishTime = +new Date,
                    traced = traceResult(req, options);

                traced.startedAt = requestStartTime;
                traced.status = 'failed';
                traced.elapsedTime = requestFinishTime - requestStartTime;
                traced.error = e;

                callback(traced);
            });

            return req;
        }
    }
};