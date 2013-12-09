var crypto = require('crypto'),
    User = require('../models/UserApp.js'),
    ObjectId    = require('mongodb').ObjectID;

module.exports = function(app) {
    app.get('/index', checkLogin);
    app.get('/index', function (req, res) {
        User.find(function (err, posts) {
            if (err) {
                posts = [];
            }
            res.render('index', {
                title: '用户',
                user: req.session.user,
                posts: posts,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    app.get('/useredit/:id', checkLogin);
    app.get('/useredit/:id', function (req, res) {
        User.findOne(ObjectId(req.params.id), function (err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('useredit', {
                title: "修改页面",
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
    app.post('/useredit/:id', checkLogin);
    app.post('/useredit/:id', function (req, res) {
        var key = {
            _id : ObjectId(req.params.id)
        };

        User.findOne(key, function(err, user){
            var md5 = crypto.createHash('md5'),
                password = user.password;
            if(req.body.password != ''){
                password = md5.update(req.body.password).digest('hex');
            }

            var data = {
                password : password,
                email    : req.body.email
            };

            User.update(key, data, function (err) {
                var url = '/useredit/' + req.params.name;
                if (err) {
                    req.flash('error', err);
                    return res.redirect(url);//出错！返回文章页
                }
                req.flash('success', '修改成功!');
                res.redirect('/index');
                //成功！返回文章页
            });
        });
    });

    app.get('/remove/:id', checkLogin);
    app.get('/remove/:id', function (req, res) {
        var key = {
            _id : ObjectId(req.params.id)
        };

        User.remove(key, function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success', '删除成功!');
            res.redirect('/index');
        });
    });

    app.get('/', checkNotLogin);
    app.get('/', function (req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/', checkNotLogin);
    app.post('/', function (req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex'),
            key = {
                name : req.body.name
            };
        User.findOne(key, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/');
            }
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/');
            }
            req.session.user = user;
            req.flash('success', '登陆成功!');
            res.redirect('/index');
        });
    });
    //退出
    app.get('/logout', checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '退出成功!');
        res.redirect('/');//登出成功后跳转到主页
    });


    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        if (name == "" || name.length < 3) {
            req.flash('error', '用户名不能为空或少于3个字！');
            return res.redirect('/reg');
        }

        if (password == "") {
            req.flash('error', '密码不能为空或少于6位！');
            return res.redirect('/reg');
        }

        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg');
        }
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: password,
            email: req.body.email
        });
        User.findOne({name: req.body.name}, function (err, user) {
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');
            }
            newUser.insert(function (err) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                //req.session.user = user;
                req.flash('success', '注册成功!');
                res.redirect('/index');
            });
        });
    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('success', '已登录!');
            res.redirect('/index');
        }
        next();
    }
};