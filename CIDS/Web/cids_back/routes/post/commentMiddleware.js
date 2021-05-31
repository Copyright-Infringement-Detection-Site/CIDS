const express = require('express');
const Post = require('../../models/post/posts');
const Comment = require('../../models/post/comments');
const User = require('../../models/user');

//게시글별 댓글 리스트 가져오기
exports.commentGet = async (req, res, next) => {
  try{
    await Comment.find({post_id: req.params.id},null,{sort: {created_date: -1}})
        .then(async (comments)=>{
          datas = [];

          for(let i=0;i<comments.length;i++){
            let user = await User.findOne({login_id: comments[i].user_login_id});
            user = {
                last_name: user.last_name,
                first_name: user.first_name,
                email: user.email,
                telephone: user.telephone,
                img_path: user.img_path
            }//넘길 user 정보 정할 것
            datas.push({
              comment: comments[i],
              user: user
            })
          }
          res.json({commentAndUserInfos: datas});
        })
  }
  catch(err){
    console.log(err);
    res.json({message: false});
  }
     
};

//댓글 생성
exports.commentCreate = async (req, res, next)=>{
  try{

    if(req.session.passport === undefined){
      res.json({message:"로그인이 필요합니다."});
      return; 
    }

    else{
      await Post.findOne({_id:req.body.post_id})
      .then((post) =>{
        const comment = new Comment({
          content: req.body.content,
          user_login_id: req.session.passport.user.login_id,
          post_id: post._id
        });
        comment.save();
        res.json({ message: "댓글을 작성하셨습니다."});
      });
    }
  }
  catch (err){
    console.log(err);
    res.json({message: false});
  }
};

//댓글 수정
exports.commentUpdate = async (req,res,next)=>{

  let comment = await Comment.findById(req.params.id);

  //방어 코딩
  if(req.session.passport === undefined ||(req.session.passport.user.user_type !== 'admin' && comment.user_login_id !== req.session.passport.user.login_id))
  {
    res.json({message: '권한이 없습니다.'});
    return;
  }

  Comment.findByIdAndUpdate(req.params.id,
    {
      content: req.body.content,
      updated_date: Date.now()
    },
    (async (err)=>{
      try{
        comment = await Comment.findById(req.params.id);
        res.json({ comment: comment, message: true});
      }
      catch(err){
        console.log(err);
        res.json({ message: false });
      }
    })
  )
  .catch((err) => {
    console.log(err);
    res.json({ message: false });
  });
};

//댓글 삭제
exports.commentDelete = async (req, res, next) => {

  let comment = await Comment.findById(req.params.id);

  //방어 코딩
  if(req.session.passport === undefined ||(req.session.passport.user.user_type !== 'admin' && comment.user_login_id !== req.session.passport.user.login_id))
  {
    res.json({message: '권한이 없습니다.'});
    return;
  }
  else{
    Comment.findByIdAndRemove(req.params.id).then(()=>{
      res.json({ message: true});
    })
    .catch((err) =>{
      console.log(err);
      res.json({message: false});
    });
  }
};



