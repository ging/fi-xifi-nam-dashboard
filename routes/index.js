/**
 * index.js
 * Author: Fernando Garcia
 * Date: 14/03/14
 */

/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index');
};

exports.bwctl = function(req, res){
    res.render('bwctl');
};
exports.owamp = function(req, res){
    res.render('owamp');
};
exports.newhost = function(req, res){
    res.render('new');
};
exports.edithost = function(req, res){
    res.render('edithost');
};
exports.delhost = function(req, res){
    res.render('delhost');
};
