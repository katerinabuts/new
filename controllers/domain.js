const jwt = require('jsonwebtoken');
var EasyXml = require('easyxml');
const xml = require('xml');
var serializer = new EasyXml({
    singularizeChildren: true,
    underscoreAttributes: true,
    rootElement: 'response',
    dateFormat: 'SQL',
    indent: 2,
    manifest: true
});

module.exports = (domainService, cacheService, config, promiseHandler) => {
    const BaseController = require('./base');

    Object.setPrototypeOf(DomainController.prototype, BaseController.prototype);
    function DomainController(domainService, promiseHandler) {
        BaseController.call(this, domainService, promiseHandler);
        this.routes['/'] = [{method: 'get', cb: readAll}];
        this.routes['/check'] = [{method: 'post', cb: check}];
        this.routes['/pay'] = [{method: 'post', cb: pay}];

        this.registerRoutes();
        return this.router;

        function readAll(req, res) {
            domainService.readChunk(req.params)
                .then((domains) => {
                    cacheService.set(req, domains);
                    var contentType = req.headers['content-type'];
                    if (contentType == 'application/json') {
                        res.header('Content-Type', 'application/json');
                        res.send(domains);
                    }
                    else if (contentType == 'application/xml') {
                        res.header('Content-Type', 'text/xml');
                        var xml = serializer.render(domains);
                        res.send(xml);
                    } else {
                        res.send(domains);
                    }
                })
                .catch((err) => res.error(err));
        }

        function check(req, res) {
            var contentType = req.headers['content-type'];
            if (contentType == 'application/json') {
                console.log('json');
                promiseHandler(res, domainService.check(req.body.domain));
            }
            else if (contentType == 'application/xml') {
                console.log('xml');
                res.send(xml(req.body))
                // promiseHandler(res, domainService.check(req.body.domain));

            }
        }

        function pay(req, res) {
            var contentType = req.headers['content-type'];
            if (contentType == 'application/x-www-form-urlencoded') {
                console.log('urlencoded');
                promiseHandler(res, domainService.pay(req.body.domain, req.cookies['x-access-token']));
            } else if (contentType == 'application/json') {
                console.log('json');
                promiseHandler(res, domainService.pay(req.body.domain, req.cookies['x-access-token']));
            }
            else if (contentType == 'application/xml') {
                console.log('xml');
                promiseHandler(res, domainService.pay(req.body.domain, req.cookies['x-access-token']));
            }
        }
    }

    return new DomainController(domainService, promiseHandler);
};