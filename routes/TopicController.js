var fs          = require('fs');
var Topic       = require('../models/TopicApp.js');
var ObjectId    = require('mongodb').ObjectID;


module.exports = function(app){
    app.get('/topicList', checkLogin);
    app.get('/topicList', function (req, res) {
        Topic.find({}, function (err, posts) {
            if (err) {
                posts = [];
            }
            res.render('topicList', {
                title: '专题列表',
                user: req.session.user,
                posts: posts,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    app.get('/topicRemove/:_id', checkLogin);
    app.get('/topicRemove/:_id', function (req, res) {
        var _id = req.params._id;

        Topic.remove({_id: ObjectId(_id)}, function(err){
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }

            req.flash('success', '删除成功!');
            res.redirect('/topicList');
        });
    });


    app.get('/topicAdd', checkLogin);
    app.get('/topicAdd', function (req, res) {
        res.render('topicAdd', {
            title: '专题',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.get('/topicEdit/:_id', checkLogin);
    app.get('/topicEdit/:_id', function (req, res) {
        var _id = req.params._id;

        Topic.findOne({_id : ObjectId(_id)}, function(err, post){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }

            res.render('topicEdit', {
                title: '专题-编辑',
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });

        });
    });

    app.post('/topicEdit/:_id', checkLogin);
    app.post('/topicEdit/:_id', function (req, res) {
        var key = {
            _id: req.params._id
        }, data = {
            names   : req.body.names,
            users   : req.session.user.name,
            pic     : req.body.pic,
            url     : req.body.url,
            types   : req.body.types
        };

        Topic.update(key, data, function(err){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }

            req.flash('success', '修改成功!');
            res.redirect('/topicList');
            //成功！返回文章页
        });
    });

    app.post('/topicAdd', checkLogin);
    app.post('/topicAdd', function(req, res){
        var target_path;

        for (var i in req.files) {
            if(req.files[i].type == 'application/zip'){
                if (req.files[i].size == 0){
                    // 使用同步方式删除一个文件
                    fs.unlinkSync(req.files[i].path);
                } else {
                    target_path = './upload/zt/' + req.files[i].name;
                    // 使用同步方式重命名一个文件
                    fs.renameSync(req.files[i].path, target_path);
                }
            }
        }

        var topicNew = new Topic({
            names    : req.body.names,
            users   : req.session.user.name,
            pic     : target_path,
            url     : target_path,
            types   : req.body.types
        });

        topicNew.insert(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }

            req.flash('success', '发布成功!');
            res.redirect('/topicList');//发表成功跳转到主页
        });
    });
};

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