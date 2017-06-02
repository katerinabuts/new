module.exports = (userRepository, errors) => {
    return {login: login, login1: login1, register: register};

    function login(data) {
        return new Promise((resolve, reject) => {
            userRepository
                .findOne({where: {email: data.email}, attributes: ['id', 'password']})
                .then((user) => {
                    if (user == null || user.password != data.password) {
                        reject(errors.wrongCredentials);
                        return;
                    }
                    resolve(user.id);
                })
                .catch(reject);
        });
    }

    function login1(data) {
        return new Promise((resolve, reject) => {
            userRepository
                .findOne({where: {email: data.email}, attributes: ['id', 'password']})
                .then((user) => {
                    if (user == null) {
                        reject(errors.wrongCredentials);
                        return;
                    }
                    resolve(user.id);
                })
                .catch(reject);
        });
    }

    function register(data) {
        return new Promise((resolve, reject) => {
            const reg = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
            if (reg.test(data.email.toString())) {
                if (data.password < 4) {
                    console.log('password is not correct');
                    return reject(error.wrongCredentials);
                }
                else {
                    reg_flname = /[a-zA-Z]/;
                    if ((reg_flname.test(data.firstname.toString())
                        && reg_flname.test(data.lastname.toString()))
                        && (data.firstname != "" && data.lastname != "")) {
                        var user = {
                            email: data.email,
                            password: data.password,
                            fullname: data.firstname + " " + data.lastname,
                        };
                        Promise.all([userRepository.create(user)])
                            .then(() => resolve({success: true}))
                            .catch(reject);
                    }
                    else
                        return reject(error);
                }
            }
            else {
                return reject(error.wrongCredentials);
            }
        });
    }
};