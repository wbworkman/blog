let express = require('express');

let bodyParser = require('body-parser');

//引入session模块
let session = require('express-session');

let app = express();

app.listen(3000);
//设置模板引擎
app.set('view engine', 'xtpl');
//设置模板目录
app.set('views', './views');

//使用中间件 处理静态资源
app.use(express.static('./public'));
//当访问/public时 去public中查找资源
app.use('/public', express.static('./public'));

//解析post数据
app.use(bodyParser.urlencoded({ extended: false }));

//use 方法调用session
app.use(session({
    secret: 'fad',
    resave: false,
    saveUninitialized: false,
}));

app.use('/ad/ad', (req, res, next) => {
    //检测登录
    //http要求在请求头设置前不允许有 响应主体
    if (!req.session.loginfo && req.url != '/login') {
        // return res.redirect('/login');
    }
    next();
});

//使用express.Router();来设置主路由
//然后主路由下在设置子路由
//后台主路由
let admin = require('./routes/admin');
//前台主路由
let home = require('./routes/home');

//中间件访问页面
//访问admin时  路由是 '/ad';
app.use('/ad', admin);
//访问home时 路由是 '/';
app.use('/', home);