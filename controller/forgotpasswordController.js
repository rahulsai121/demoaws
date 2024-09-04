
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const SibApiV3Sdk = require('sib-api-v3-sdk');

const User = require('../model/user'); 
const ForgotPassword=require('../model/ForgotPasswordRequests');
const { where } = require('sequelize');

require('dotenv').config();

exports.forgotPassword = async (req, res) => {
    try {
        const email=req.body.email;
        const user = await User.findOne({where : { email }});
        const id = uuid.v4();

        if(user){

            const forgotpassword=await ForgotPassword.create({ id:id , isActive: true,userId: user.id })
                .catch(err => {
                    throw new Error(err)
                })
        }


        ///////sending mail
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API; 

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        const emailData = {
            to: [{
                email: email,
                name: 'DemoRahul'
            }],
            sender: {
                email: 'pasam.rahul1234@gmail.com',
                name: 'Rahul'
            },
            subject: 'Forgot Password',
            htmlContent: `<a href="http://13.201.4.25:3000/password/resetpassword/${id}">Reset password</a>`,
        };
        //console.log(emailData.htmlContent)

        try {
            const data = await apiInstance.sendTransacEmail(emailData);
            res.status(200).send('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        }
    } catch (err) {
        console.log(`Error in forgotPassword: ${err}`);
        res.status(500).send('Internal Server Error');
    }
};


exports.resetPassword= async(req,res)=>{
    const id =  req.params.id;
    console.log(id)
    ForgotPassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button type="submit">reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

exports.updatePassword=async(req,res)=>{
    try{
        const newpassword=req.query.newpassword;
        const resetpasswordid=req.params.id


        const forgotpasswordrequest=await ForgotPassword.findOne({where : { id: resetpasswordid }})

        const user=await User.findOne({where:{id:forgotpasswordrequest.userId}})

        if(user){
            const hash = await bcrypt.hash(newpassword, 10);
            user.update({ password: hash }).then(() => {
                res.status(201).json({message: 'Successfuly update the new password'})
            })
        }
    }
    catch(error){
        console.log(`error in updatePassword${error}`)
    }
}