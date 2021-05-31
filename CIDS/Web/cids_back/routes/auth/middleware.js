exports.isLogged = (req, res, next)=>{
    if (req.isAuthenticated()){
        next();
    } else {
        res.json({'message': "로그인이 필요합니다."});
    }
}
exports.checkPermission = (req, res, next)=>{
    const userType = req.body.user_type;
    if (userType != 'admin') return noPermission(req,res);
    next();
}
