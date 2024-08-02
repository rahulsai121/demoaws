require('dotenv').config(); // Ensure this is at the top

const SibApiV3Sdk = require('sib-api-v3-sdk');
const User = require('../model/user'); // Import modules at the top

exports.forgotPassword = async (req, res) => {
    try {
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API; // Ensure the API key is correct


        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        const receiverEmail=req.body.email;

        const emailData = {
            to: [{
                email: receiverEmail,
                name: 'DemoRahul'
            }],
            sender: {
                email: 'pasam.rahul1234@gmail.com',
                name: 'Rahul'
            },
            subject: 'Forgot Password',
            htmlContent: '<html><body><h1>Hello, World!</h1></body></html>'
        };

        // Using await to handle asynchronous call
        try {
            const data = await apiInstance.sendTransacEmail(emailData);
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
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
