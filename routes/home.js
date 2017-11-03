let home = require('express').Router();

let user = require('../module/user');

//处理播客首页文章数据
let post = require('../module/post');

//前台首页
home.get('/', (req, res) => {
    //每页数据条数
    let pageSize = 2;
    //当前页
    let page = req.query.page || 1;

    post.count((err, row) => {

        if (err) return;
        //总条数
        let total = row.total;
        //总页数
        let pages = Math.ceil(total / pageSize);

        post.findAll(pageSize, page, (err, rows) => {
            if (!err) {
                res.render('home/index', {
                    posts: rows,
                    pages: pages,
                    page: page
                })
            }
        })

    })
});
home.get('/article', (req, res) => {
    post.find(req.query.id, (err, rows) => {
        if (!err) {
            // console.log(rows[0]);
            res.render('home/article', { post: rows[0] });
        }
    })
});
home.get('/join', (req, res) => {
    res.render('home/join', {});
});
home.get('/about', (req, res) => {
    res.render('home/about', {});
});
home.get('/center', (req, res) => {
    res.render('home/center', {});
});
home.get('/login', (req, res) => {
    res.render('home/login', {});
});
home.get('/register', (req, res) => {
    res.render('home/register', {});
});

//post方式提交数据
//注册功能
home.post('/register', (req, res) => {
    //调用模型 插入数据
    user.insert(req.body, (err) => {
        if (!err) {
            res.json({
                code: 10000,
                msg: '添加成功'
            })
        }
    })
});
//登录检测
home.post('/login', (req, res) => {
    // console.log(req.body);
    user.auth(req.body.email, req.body.pass, (err, row) => {
        if (!err) {
            // console.log(row);
            //如果有一个req.session.loginfo不为false 则认为登录成功
            req.session.loginfo = row;
            //登录成功响应结果 json数据
            res.json({
                code: 10000,
                msg: '登录成功'
            })
        }
    })
});










module.exports = home;