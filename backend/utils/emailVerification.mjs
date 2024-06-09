import nodemailer from "nodemailer";
import { dbStore } from '../dbConfig/firebaseConfig.mjs';
import { Timestamp, addDoc, collection, serverTimestamp, getDocs, query, orderBy, limit } from "firebase/firestore";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "./webtoken.mjs";

dotenv.config();

const { AUTH_EMAIL, AUTH_PW, APP_URL } = process.env;


// let transporter = nodemailer.createTransport({
//     host: "smtp.office365.com", // hostname
//     // host: "smtp-mail.outlook.com", // hostname
//     secureConnection: true, // TLS requires secureConnection to be false
//     port: 587,
//     auth: {
//         user: AUTH_EMAIL,
//         pass: AUTH_PW,
//     },
//     tls: {
//         ciphers: 'SSLv3'
//     }
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PW,
    },
});

const sendVerificationMail = async (user, res) => {
    // const { _id, email, name } = user;
    // console.log(user);
    let _id;
    let email;
    let name;
    const q = query(collection(dbStore, "users"), orderBy("createdAt", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        _id = doc.id;
        email = doc.data().email;
        name = doc.data().name;
        // console.log(_id, email, name);
    });

    const token = _id + uuidv4();
    const link = APP_URL + "/users/verify/" + _id + "/" + token;
    //  Mail Options
    const mailOptions = {
        from: AUTH_EMAIL,
        to: email,
        subject: "Email Verification",
        html: `
        <h1 style="color: #333333;">EMAIL VERIFICATION</h1>
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #333333;">Hello, ${name}!</h1>
                <p style="color: #666666; line-height: 1.6;">Thank you for signing up. Please click the button below to verify your email address.</p>
                <a href="${link}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px;">Verify Email</a>
                <p style="color: #666666; line-height: 1.6; margin-top: 20px;">Note: The verification link will expire in 1 hour.</p>
            </div>
        </div>`
    };

    try {
        const hasedToken = await hashPassword(token);
        const verificationData = {
            userID: _id,
            token: hasedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
        };
        const newVerifiedEmail = await addDoc(collection(dbStore, "verification"), verificationData);

        if (newVerifiedEmail) {
            transporter
                .sendMail(mailOptions)
                .then(() => {
                    res.status(201).send({
                        success: "PENDING",
                        message: "Verification email has been sent to your account. Check your email for further Instructions. "
                    });
                })
                .catch((e) => {
                    console.log(e);
                    res.status(404).send({ message: "Something went wrong " });
                });
        }
    }
    catch (e) {
        console.log(e);
        res.status(404).send({ message: "Something Went Wrong" });
    }
};

const resetPasswordLink = async (user, res) => {
    const { _id, email } = user;

    const token = _id + uuidv4();
    const link = APP_URL + "/users/reset-password/" + _id + "/" + token;

    const mailOptions = {
        from: AUTH_EMAIL,
        to: email,
        subject: "Password Reset Link",
        html: `<div style="text-align: center;">
        <h1 style="color: #333;">Password Reset</h1>
        <p style="color: #666; font-size: 16px;">Click the link below to reset your password:</p>
        <a href="${link}" style="background-color: #007bff; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; font-size: 18px; margin-top: 20px;">Reset Password</a>
    </div>`
    }

    try {
        const hashedToken = await hashPassword(token);
        const passRest = {
            userId: _id,
            email: email,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 600000
        };

        const resetEmail = await addDoc(collection(dbStore, "passwordreset"), passRest);
        if (resetEmail) {
            transporter
                .sendMail(mailOptions)
                .then(() => {
                    res.status(201).send({
                        success: "PENDING",
                        message: "Reset Password Link has been sent to your account.",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(404).json({ message: "Something went wrong" });
                });
        }

    }
    catch (e) {
        console.log(e);
        res.status(404).send({ message: "Something went wrong" });
    }

};

export { sendVerificationMail, resetPasswordLink };