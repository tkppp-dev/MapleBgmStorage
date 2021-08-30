module.exports = function(req, res){
    req.logout()
    req.session.destroy()
    res.send({
        logout : true
    })
}