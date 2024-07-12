const user=require('../model/user')
exports.userpost= async (req, res) => {
    //console.log(req.body)
    const newuser= await user.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })

    //res.send(newpost.dataValues)
}