
var request         = require('supertest')(userService);
var Sequelize       = require('sequelize');
var sinon           = require('sinon');
var should          = require('should');
var errors = require('./utils/errors');

var config          = require('./config');
var dbcontext       = require('./context/db')(Sequelize, config);

var userRepository  = dbcontext.user;
var userService            = require('./services/auth')(userRepository,errors);

//var userService     = require('../controllers/domain/pay')(userRepository);
var teamRepository  = dbcontext.team;
//var teamService     = require('../services/cache')(teamRepository);



var user1 =
{
    email       : 'pasha@mail.ru',
    password : '12345Q',
    firstname:'kate',
    lastname: 'buts'
};



var sandbox;
beforeEach(function ()
{
    sandbox = sinon.sandbox.create();
});

afterEach(function ()
{
    sandbox.restore();
});

describe('- User Service testing', ()=> {
    describe('Create User: ', () => {
        it('Return object Data', () => {
            sandbox.stub(userRepository, 'create').returns(Promise.resolve(user1));
            var promise = userService.register(user1);
            return promise.then((result) => {
                result.success  = true;
            })
        });
    });


});
