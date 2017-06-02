var express = require('express');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');

const errors = require('./utils/errors');
const config = require('./config');

const dbcontext = require('./context/db')(Sequelize, config);

const domainService = require('./services/domain')(dbcontext.domain, dbcontext.user, errors);
const authService = require('./services/auth')(dbcontext.user, dbcontext.role, errors);
const cacheService = require('./services/cache');

const apiController = require('./controllers/api')(domainService, authService, cacheService, config);

const logger = require('./utils/logger');
const auth = require('./utils/auth')(authService, config, errors);
const cache = require('./utils/cache')(cacheService);
//process.env.type="prod";

var app = express();
app.use(cookieParser(config.cookie.key));
app.use(bodyParser.json());
app.use(bodyParser.xml({
    limit: '1MB',   // Reject payload bigger than 1 MB
    xmlParseOptions: {
        normalize: true,     // Trim whitespace inside text nodes
        normalizeTags: true, // Transform tags to lowercase
        explicitArray: false // Only put nodes in array if >1
    }
}));


app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', logger);
app.use('/api', auth);
app.use('/api', cache);
app.use('/api', apiController);

dbcontext.sequelize
    .sync()
    .then(() => {
        app.listen(port = process.env.PORT || 3001, () => {
            if(process.env.type=="prod")console.log('DB: ' + config.db_heroku.name + '\nHost: ' + config.db_heroku.host);
            else console.log('DB: ' + config.db.name + '\nHost: ' + config.db.host);
            console.log('Success')
        });
    })
    .catch((err) => console.log(err));