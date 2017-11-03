let admin = require('express').Router();

//调用post方法
let post = require('../module/post');

let user = require('../module/user');

//引入文件上传模块
let multer = require('multer');
// let upload = multer({ dest: 'public/admin/uploads/avatar' }); //默认 可以自定义存储路径

//通过diskStorage可以自定义路径
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/admin/uploads/avatar')
    },
    //自定义问件名称
    filename: function(req, file, cb) {
        let extname = file.originalname.slice(file.originalname.lastIndexOf('.'));
        cb(null, file.fieldname + '-' + Date.now() + extname);
    }
});
var upload = multer({ storage: storage });



//后台路由
admin.get('/ad', (req, res) => {
    res.render('admin/index', {});
});
//添加
admin.get('/add', (req, res) => {
    res.render('admin/manage', { action: '/ad/add' });
});
//编辑
admin.get('/edit', (req, res) => {
    // console.log(req.query);
    post.find(req.query.id, (err, rows) => {
        if (!err) {
            res.render('admin/manage', {
                post: rows[0],
                action: '/ad/modify'
            });
        }
    });
});

admin.get('/list', (req, res) => {

    post.findAll((err, rows) => {
        if (err) {
            return res.send('数据库错误');
        }
        res.render('admin/list', { posts: rows });
    });
});
admin.get('/logout', (req, res) => {
    //退出的时候 把存的session信息清空就可以了
    req.session.loginfo = 'null';
    res.redirect('/login');
});

//个人中心
admin.get('/settings', (req, res) => {
    let uid = req.session.loginfo.id;
    user.find(uid, (err, rows) => {
        // console.log(rows);
        if (!err) {
            res.render('admin/settings', { user: rows[0] });
        }
    });

});

//个人资料的更新
admin.post('/update', (req, res) => {

    // console.log(req.body);
    let uid = req.session.loginfo.id;
    user.update(uid, req.body, (err) => {
        if (!err) {
            res.json({
                code: 10000,
                msg: '更新成功'
            })
        }
    });
});

//添加播客
admin.post('/add', (req, res) => {
    //获取提交的数据
    // console.log(req.body);

    req.body.uid = req.session.loginfo.id;

    post.insert(req.body, (err) => {
        if (!err) {
            res.json({
                code: 10000,
                msg: '添加成功'
            })
        }
    });
});
//修改播客
admin.post('/modify', (req, res) => {
    // console.log(req.query);
    let id = req.body.id;
    delete req.body.id;
    post.modify(id, req.body, (err) => {
        if (!err) {
            res.json({
                code: 10000,
                msg: '修改成功'
            })
        }
    })
})
admin.get('/delete', (req, res) => {
    // console.log(req.query); //接收请求
    //调用删除方法
    post.delete(req.query.id, (err) => {

        if (!err) {
            res.json({
                code: 10000,
                msg: '删除成功!'
            })
        }

    })
});

//文件上传              中间件
admin.post('/upfile', upload.single('avatar'), (req, res) => {
    // console.log(req.file);
    res.json({
        code: 10000,
        msg: '上传成功',
        //图片上传后的路径
        path: req.file.path
    })
})

module.exports = admin;