const { json } = require('body-parser');
const express = require('express');
const Post = require('../../models/post/posts');
const Comment = require('../../models/post/comments');
const User = require('../../models/user');

//게시글 타입별 리스트
exports.postGet = async (req, res, next) => {
  //내림차순
  await Post.find({post_type: req.params.post_type},{"hit":1,"created_date":1,"updated_date":1,"title":1,"post_type":1,"user_login_id":1},{sort: {created_date: -1}})
  .then((posts) => {
      res.json(posts);
  })
  .catch((err) =>{
    console.log(err);
    res.json({message: false});
  });
}


//게시글 생성
exports.postCreate = async (req, res, next)=>{
  try{
    if(req.session.passport===undefined){
      res.json({message:"로그인이 필요합니다."});
      return; 
    }

    else{
      const post = new Post({
        title: req.body.post.title,
        content: req.body.post.content,
        user_id: req.session.passport.user._id,
        user_login_id : req.session.passport.user.login_id,
        post_type: req.body.post.post_type,
      });
      post.save();
      res.json({ message: "게시글이 업로드 되었습니다."});
    }
  }
  catch (err){
    console.log(err);
    res.status(402).send();
  }
};

//게시글 보기
exports.postShow = async (req,res,next) =>{

  const post = await Post.findById(req.params.id)
  .then((post)=>{
    if(post.post_type === 'qna' && (  req.session.passport === undefined ||(req.session.passport.user.user_type !== 'admin' && post.user_id !== req.session.passport.user._id) )){
      //Q & A 인 경우 admin제외 post를 보지 못하도록 막아야함
      res.json({message:"권한이 없습니다."});
      return;
    }
    else {
      User.findById(post.user_id) //넘길 정보 정할 것 
      .then((user)=>{
        post.hit++;
        post.save();
        
        let name;
        if(user.last_name != undefined && user.last_name != null && user.last_name != ''){
          name = user.last_name + user.first_name;
        } else{
          name = user.login_id
        }
  
        const writer = {
          id : user._id,
          email : user.email,
          last_name : user.last_name,
          first_name : user.first_name,
          name : name,
          login_id : user.login_id,
          img_path : user.img_path,
          telephone : user.telephone
  
        }
  
  
        Comment.find({post_id: post._id},null,{sort: {created_date: -1}}).
        then((comments)=>{
          res.json({ post: post, writer: writer});
        })
  
      })
      .catch((err)=>{
        res.json({message: "게시글 조회에 실패했습니다."});
      });

    }
  })
  .catch((err)=>{
    console.log(err);
    res.json({message: "게시글 조회에 실패했습니다."});
  });
}

//게시글 수정
exports.postUpdate = async (req,res,next)=>{
  
  const post = await Post.findById(req.params.id);

  //방어 코딩
  if(req.session.passport === undefined ||(req.session.passport.user.user_type !== 'admin' && post.user_id !== req.session.passport.user._id))
  {
    res.json({message: '권한이 없습니다.'});
    return;
  }
  else{
    Post.findByIdAndUpdate(req.body.post.id,
      {
        title: req.body.post.title,
        content: req.body.post.content,
        updated_date: Date.now()
      },
      (err, post)=>{
        res.json({ message: "게시글이 수정되었습니다. "});
      }
    ).catch((err) => {
      console.log(err);
      res.json({ message: "게시글 수정 실패" });
    });

  }
};

//게시글 삭제
exports.postDelete = async (req, res, next) => {

  const post = await Post.findById(req.params.id);

  //방어 코딩
  if(req.session.passport === undefined ||(req.session.passport.user.user_type !== 'admin' && post.user_id !== req.session.passport.user._id))
  {
    res.json({message: '권한이 없습니다.'});
    return;
  }
  else{
    Post.findByIdAndRemove(req.params.id).then(()=>{
      res.json({ message: '게시글이 삭제되었습니다.'});
    })
    .catch((err) =>{
      console.log(err);
      res.json({message: '게시글삭제 실패'});
    });
  }
  
};

//게시글 삭제
exports.postGetInfo = (req, res, next) => {
  Post.findById(req.params.id)
  .then(post =>{
    return res.json({post:post});
  })
  .catch(err =>{
    return res.json({message:"게시글을 읽어오는 중, 문제가 발생했습니다."});
  })
  
};