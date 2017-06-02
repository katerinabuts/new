global.isProd= process.env.type=="prod";
module.exports = (Sequelize, config) => {
    const options = {
        host: isProd?config.db_heroku.host:config.db.host,
        dialect: isProd?config.db_heroku.dialect:config.db.dialect,
        logging: false,
        port :isProd?config.db_heroku.port:config.db.port,
    };
    const sequelize = new Sequelize(isProd?config.db_heroku.name:config.db.name,
        isProd?config.db_heroku.user:config.db.user,
        isProd?config.db_heroku.password:config.db.password,
        options);

    //const sequelize = new Sequelize(config.db.name, config.db.userService, config.db.password, options);
    const User = require('../models/user')(Sequelize, sequelize);
    const Domain = require('../models/domain')(Sequelize, sequelize);

    Domain.belongsTo(User);
    User.hasMany(Domain);

    return {user: User, domain: Domain, sequelize: sequelize};
};