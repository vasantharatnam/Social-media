// backend\controllers\authController.js
import { dbAuth, dbStore } from '../dbConfig/firebaseConfig.mjs';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Timestamp, addDoc, collection, serverTimestamp } from "firebase/firestore";

// register user (Signup)
const userAuth = async (req, res) => {

    try {
        const { firstName, lastName, email, password } = req.body;

        if (!(firstName || lastName || email || password)) {
            res.status(401).send({ message: "Please fill all the fields" });
        }
        const users = await createUserWithEmailAndPassword(dbAuth, email, password);
        const userData = {
            name: `${firstName} ${lastName}`,
            userID: users.user.uid,
            email: email,
            password: password,
            // location: "",
            // profileUrl: "",
            // profession: "",
            // friends: [],
            // views: [],
            // verified: false,
            createdAt: serverTimestamp()
        };

        await addDoc(collection(dbStore, "users"), userData);

        res.status(200).send({ message: "User created successfully" });
    }
    catch (e) { res.status(404).send({ message: e.message }); }
}

export { userAuth };