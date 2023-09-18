// 시퀄라이즈 임포트
const Sequelize = require('sequelize'); 

/* 
현재 실행환경 설정. 여기서는 NODE_ENV에서 설정해 놓은 값을 따르지만
설정된 값이 따로 존재하지 않는다면 'development' 모드로 실행한다
*/
const env = process.env.NODE_ENV||'development';

/*
config/config.json의 데이터를 가져온다.
가져온 데이터는 객체로써 가져와 지는데 env의 키를 가진 설정 값을 가져온다
*/
const config = require('../config/config.json')[env];

// DB를 담을 빈 객체 생성
const db = {};

// DB설정값을 토대로 하여 시퀄라이즈 객체 생성
const sequelize = new Sequelize(config.database, config.username, config.password,
  config);

// db = sequelize; 하지 않는 이유는 db에 다른 여러가지 속성이 부여될 수 있기 때문
db.sequelize = sequelize;

module.exports = db;