var createError = require('http-errors');
const express = require('express');
const Post = require('../../models/post/posts');
const router = express.Router();
const {isLogged} = require('../auth/middleware')
const passport = require('passport')

const {commentCreate, commentGet, commentUpdate, commentDelete} = require('./commentMiddleware')


router.get('/show/:id', commentGet, (req, res, next)=>{})
router.post('/create', commentCreate, (req, res, next)=>{})
router.put('/update/:id', commentUpdate, (req, res, next)=>{})
router.delete('/delete/:id', commentDelete, (req, res, next)=>{})



module.exports = router;