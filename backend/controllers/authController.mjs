// backend\controllers\authController.js
import { dbAuth, dbStore } from '../dbConfig/firebaseConfig.mjs';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { Timestamp, getDoc, doc, getDocs, addDoc, collection, serverTimestamp, where, query } from "firebase/firestore";
import { hashPassword } from "../utils/webtoken.mjs";
import { sendVerificationMail } from "../utils/emailVerification.mjs";
import { comparePasswo, createJWT } from "../utils/webtoken.mjs";

// @desc    Auth user
// @route   POST /login
// @access  Public

// register user (Signup)
const userRegisterAuth = async (req, res) => {

    try {
        const { firstName, lastName, email, password } = req.body;

        if (!(firstName || lastName || email || password)) {
            res.status(401).send({ message: "Please fill all the fields" });
            return;
        }

        const q = query(collection(dbStore, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        let ok = 0;
        querySnapshot.forEach((doc) => {
            ok = 1;
        });
        if (ok) {
            res.status(401).send({
                success: "FAILED",
                message: "Email Already in Use"
            });
            return;
        }
        const hashPassworder = await hashPassword(password);
        ///////////////////
        // const refi = doc(dbStore, "users", "3QmPHlbHOmGvldcyAtHs");
        // const docSnap = await getDoc(refi);

        // if (docSnap.exists()) {
        //     console.log("Document data:", docSnap.data());
        // } else {
        //     // docSnap.data() will be undefined in this case
        //     console.log("No such document!");
        // }
        //////////////////
        // const users = await createUserWithEmailAndPassword(dbAuth, email, hashPassworder);
        const userData = {
            name: `${firstName} ${lastName}`,
            // userID: users.user.uid,
            email: email,
            password: hashPassworder,
            location: "",
            profileUrl: "",
            profession: "",
            friends: [],
            views: [],
            verified: false,
            createdAt: serverTimestamp()
        };
        const user = await addDoc(collection(dbStore, "users"), userData);
        // Email Verification to user
        sendVerificationMail(user, res);

        // res.status(200).send({ message: "User created successfully" });
    }
    catch (e) { res.status(404).send({ message: e.message }); }
}

const loginAuth = async (req, res) => {
    const { email, password } = req.body;


    try {
        if (!email || !password) {
            res.status(401).send({ message: "Please Provide User Credentials" });
            return;
        }

        const q = query(collection(dbStore, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        let ok = 0;
        let actual_password;// = querySnapshot[0].data()?.password;
        let next_friend;// = querySnapshot[0].data()?.friends;
        let cor_id;// = querySnapshot[0]?.id;
        let verified;
        let ori_user;
        querySnapshot.forEach((doc) => {
            // console.log(doc.data(), "okokook");
            ok = 1;
            ori_user = doc.data();
            cor_id = doc.id;
            actual_password = doc.data().password;
            next_friend = doc.data().friends;
            verified = doc.data().verified;
        });
        // console.log(next_friend);
        if (!ok) {
            res.status(402).send({ message: "Invalid User Credentials" });
        }
        // console.log(cor_id);
        // name location profile_url email password
        const isMatch = await comparePasswo(password, actual_password);
        if (!isMatch) {
            res.status(406).send({ message: "Wrong Password" });
            return;
        }
        if (!verified) {
            res.status(405).send({ message: "Mail ID not Verified, check email and verify" });
            return;
        }
        const token = createJWT(cor_id);

        const friendPromises = next_friend.map(async (id) => {
            try {
                const new_q = doc(dbStore, "users", id);
                const docSnap = await getDoc(new_q);

                if (docSnap.exists()) {
                    return {
                        userId: docSnap.id,
                        name: docSnap.data().name,
                        email: docSnap.data().email,
                        views: docSnap.data().views,
                        verified: docSnap.data().verified,
                        createdAt: docSnap.data().createdAt,
                        profession: docSnap.data().profession,
                        location: docSnap.data().location,
                        profileUrl: docSnap.data().profileUrl
                    };
                }
                return null;
            } catch (erri) {
                console.log(erri);
                return null;
            }
        });

        const friendi = await Promise.all(friendPromises);

        console.log(friendi, "ok1");
        console.log("ok0");
        const user = {
            ...ori_user,
            userId: cor_id,
            friends: friendi,
            password: "",
        };
        console.log("ok2");
        console.log(user, "okfoasdfasdf");
        res.status(201).send({
            success: true,
            message: "Login Successful",
            user,
            token
        });
    }
    catch (e) { console.log(e); res.status(404).send({ message: e.message }); }


};

export { userRegisterAuth, loginAuth };