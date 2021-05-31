var createError = require('http-errors');
const express = require('express');
const Post = require('../../models/post/posts');
const { postGet, postShow, postCreate, postDelete, postGetInfo, postUpdate } = require('./postMiddleware');
const router = express.Router();

router.get('/:post_type',postGet,async(req, res)=>{});

router.get('/show/:id',postShow, (req, res)=>{});

router.post('/create',postCreate,async (req,res)=>{});

router.delete('/delete/:id',postDelete,async (req,res)=>{});

router.get('/getInfo/:id',postGetInfo,async (req,res)=>{});

router.put('/update/:id',postUpdate,async (req,res)=>{});




module.exports = router;