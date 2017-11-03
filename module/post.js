let db = require('./db');

exports.insert = (data, cb) => {

    let query = 'insert into posts set ?';

    db.query(query, data, (err) => {
        if (err) {
            return cb(err);
        }
        cb(null);
    })
};

exports.findAll = (...args) => {
    //由于调用时参数个数不确定 所以 使用...语法来接收参数 ...语法可以将所有参数收到一个数组中
    let query, offset, pageSize, cb;

    //当只传一个参数 且为回调函数时
    if (args.length == 1 && typeof args[0] == 'function') {
        //不做分页处理
        query = 'SELECT * FROM posts left join users on posts.uid = users.id';
        //第一个参数就是回调函数
        cb = args[0];
    } else {
        //当传递三个参数时 根据参数位置获取相对应的参数每页条数
        pageSize = args[0];
        //当前为第几页
        page = args[1];
        //第三个参数为回调函数
        cb = args[2];
        //计算页码数据起始位置
        offset = (page - 1) * pageSize;

        query = 'SELECT * FROM posts left join users on posts.uid = users.id limit ?,?';
    }



    db.query(query, [offset, pageSize], (err, rows) => {
        if (err) {
            return cb(err);
        }
        cb(null, rows);
    });
};

exports.delete = (id, cb) => {
    let query = 'delete from posts where id = ?';

    db.query(query, id, (err) => {
        if (err) {
            return cb(err);
        }
        cb(null);
    })
};

module.exports.find = (id, cb) => {
    let query = 'select * from posts left join users on posts.uid = users.id where posts.id = ?';

    db.query(query, id, (err, rows) => {
        if (err) {
            return cb(err);
        }
        cb(null, rows);
    })
};

exports.modify = (id, data, cb) => {

    let query = 'update posts set ? where id = ?';

    // db.query(query, [data, id], (err) => {
    //     if (err) {
    //         return cb(err);
    //     }
    //     cb(null);
    // })
    db.query(query, [data, id], cb);
};

exports.count = function(cb) {

    let query = 'select count(*) as total from posts';

    db.query(query, (err, rows) => {
        if (err) {
            return cb(err);
        }
        cb(null, rows[0]);
    })

}