const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password,config
);

db.sequelize = sequelize;

const basename = path.basename(__filename);
fs.
  readdirSync(__dirname) // 현재 폴더의 모든 파일을 조회
  .filter(file=>{ // 숨김 파일, index.js 파일, js 확장자가 아닌 파일들만 필터링
    return (file.indexOf('.') !== 0) && !file.includes('test') && (file !== basename) 
    && (file.slice(-3) === '.js');
  })
  .forEach(file=>{ // 조건에 부합하는 파일들의 모델을 불러와서 init
    const model = require(path.join(__dirname,file));
    console.log(file,model.name);
    db[model.name] = model;
    model.initiate(sequelize);
  })

  Object.keys(db).forEach(modelName =>{ // associate 호출
    if(db[modelName].associate){
      db[modelName].associate(db);
    }
  })

module.exports = db;