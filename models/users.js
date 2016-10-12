const sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes){
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        isLowercase: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set: function(value){
        const salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync(value, salt);
        return this.setDataValue('password', password);
      }
    }
  }, {
    hooks: {
      beforeValidate: function(user, option){
        if(typeof user.email === 'string'){
          user.email = user.email.toLowerCase().trim();
        }
      }
    },
    classMethods: {
      comparePassword: function(body){
        return new Promise(function(resolve, reject){
          const {email} = body
          const {password} = body
          if(typeof email !== 'string' || typeof password !== 'string'){
              return reject('email or password is invalid');
          }
          user.findOne({
            where: { email }
          })
          .then(function(detail){
            const comparePw = bcrypt.compareSync(password, detail.get('password'))
            if(!detail || !comparePw){
              return reject('user does not exist or password invalid');
            }
              resolve(detail)
          })
          .catch(function(err){
            reject(err);
          })
        })
      }
    }
  })
  return user;
}
