import { deleteDoc, getDoc, arrayUnion, limit, doc, updateDoc, getDocs, addDoc, collection, serverTimestamp, where, query, orderBy, documentId } from "firebase/firestore";
import { dbAuth, dbStore } from '../dbConfig/firebaseConfig.mjs';
import { hashPassword, comparePasswo, createJWT } from "../utils/webtoken.mjs";
import { resetPasswordLink } from "../utils/emailVerification.mjs"


const verifyEmail = async (req, res) => {

    try {
        const { userId, token } = req.params;
        // const q = query(dbStore, "verification", userId);
        const q = query(collection(dbStore, "verification"), where("userID", "==", userId));
        const docSnap = await getDocs(q);
        let ok = 0;
        let expiresAt, hashedToken;
        docSnap.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            ok = 1;
            expiresAt = doc.data().expiresAt;
            hashedToken = doc.data().token;
            // console.log(expiresAt);
            // console.log(_id, email, name);
        });

        const q1 = query(collection(dbStore, "verification"), where("userID", "==", userId));
        const querySnapshot = await getDocs(q1);
        let veriID;
        querySnapshot.forEach((doc) => {
            veriID = doc.id;
        });
        const dele = doc(dbStore, "verification", veriID);

        if (ok) {
            // If Token expires
            if (expiresAt < Date.now()) {
                deleteDoc(dele)
                    .then(() => {
                        deleteDoc(doc(dbStore, "users", userId))
                            .then(() => {
                                const message = "Verification token has expired.";
                                res.redirect(`/users/verified?status=error&message=${message}`);
                            })
                            .catch((e) => {
                                res.redirect(`/users/verified?status=error&message=`);
                            });
                    })
                    .catch(e => {
                        // console.log("ekkada2");
                        console.log(e);
                        res.redirect(`/users/verified?message=`);
                    })
            }
            else {
                comparePasswo(token, hashedToken)
                    .then((isMatch) => {
                        if (isMatch) {
                            // console.log(typeof userId);
                            const docRef = doc(dbStore, "users", userId);
                            // Use .then() to wait for the document reference to resolve
                            getDoc(docRef).then((new_q) => {
                                // Once resolved, update the document
                                updateDoc(docRef, { "verified": true })
                                    .then(() => {
                                        deleteDoc(dele)
                                            .then(() => {
                                                const message = "Email verified Successfully";
                                                res.redirect(`/users/verified?status=success&message=${message}`);
                                            })
                                            .catch((e) => {
                                                // console.log("hi");
                                                console.log(e);
                                                // const message = "Verification failed or link is invalid";
                                                // res.redirect(`/users/verified?status=error&message=${message}`);
                                            });
                                    })
                                    .catch((e) => {
                                        console.log(e);
                                        const message = "Verification failed or link is invalid";
                                        res.redirect(`/users/verified?status=error&message=${message}`);
                                    });
                            })
                                .catch((error) => {
                                    console.error("Error getting document: ", error);
                                });

                        } else {
                            //invalid token
                            const message = "Verification failed or link is invalid";
                            res.redirect(`/users/verified?status=error&message=${message}`);
                        }
                    })
                    .catch((e) => {
                        console.log("ekkada");
                        console.log(e);
                        res.redirect(`/users/verified?message=`);
                    });
            }
        }
    }
    catch (e) {
        console.log(e);
        res.status(404).send({ message: e.message });
    }
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const new_q = query(collection(dbStore, "users"), where("email", "==", email));
        const docSnap = await getDocs(new_q);
        let data;
        let id1;
        let ok = 0;
        docSnap.forEach((doc) => {
            ok = 1;
            id1 = doc.id;
            data = doc.data();
        });

        if (!ok) {
            return res.status(404).json({
                status: "FAILED",
                message: "Email address not found.",
            });
        }
        ok = 0;

        const new_q1 = query(collection(dbStore, "passwordreset"), where("email", "==", email));
        const docSnap1 = await getDocs(new_q1);
        let expiresAt;
        let passID;
        docSnap1.forEach((doc) => {
            ok = 1;
            passID = doc.id;
            expiresAt = doc.data().expiresAt;
        });
        if (ok) {
            if (expiresAt > Date.now()) {
                return res.status(201).json({
                    status: "PENDING",
                    message: "Reset password link has already been sent to your email.",
                });
            }
            const dele = doc(dbStore, "passwordreset", passID);
            await deleteDoc(dele);
        }
        /// PW Link       
        await resetPasswordLink({
            _id: id1,
            email: data.email
        }, res);
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: e.message });
    }
};

const resetPassword = async (req, res) => {
    const { userId, token } = req.params;

    try {
        const new_doc = doc(dbStore, "users", userId);
        const docSnap = await getDoc(new_doc);

        if (!docSnap.exists()) {
            const message = "Invalid password reset link. Try again";
            res.redirect(`/users/resetpassword?status=error&message=${message}`);
        }

        const new_q = query(collection(dbStore, "passwordreset"), where("userId", "==", userId));
        const docSnap1 = await getDocs(new_q);

        let data;
        let snap;

        if (docSnap1.length == 0) {
            const message = "Invalid password reset link. Try again";
            return res.redirect(
                `/users/resetpassword?status=error&message=${message}`
            );
        }
        docSnap1.forEach((doc) => {
            snap = doc;
            data = doc.data();
        });

        const { expiresAt, token: resetToken } = data;
        if (expiresAt < Date.now()) {
            const message = "Reset Password link has expired. Please try again";
            await deleteDoc(snap);
            res.redirect(`/users/resetpassword?status=error&message=${message}`);
        }
        else {
            const isMatch = comparePasswo(token, resetToken);

            if (!isMatch) {
                const message = "Invalid reset password link. Please try again";
                res.redirect(`/users/resetpassword?status=error&message=${message}`);
            }
            else {
                res.redirect(`/users/resetpassword?type=reset&id=${userId}`);
            }
        }

    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: e.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { userId, password } = req.body;
        const hshPassword = await hashPassword(password);
        const docRef = doc(dbStore, "users", userId);
        const q1 = query(collection(dbStore, "passwordreset"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q1);
        let new_re;
        querySnapshot.forEach((doc) => { new_re = doc.id; });
        const newdocRef = doc(dbStore, "passwordreset", new_re);

        const ok1 = updateDoc(docRef, { "password": hshPassword })

        if (ok1) {
            await deleteDoc(newdocRef);

            res.status(200).json({
                ok: true,
            });
        }
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: e.message });
    }
};

const getUser = async (req, res) => {
    try {
        const { userId } = req.body.user;
        const { id } = req.params;

        const findId = (id ?? userId);
        // Populating friends data
        const docRef = doc(dbStore, "users", findId);
        const snapShot = await getDoc(docRef);
        // console.log("ok1");
        let friends = []
        // console.log("ok2");
        let frei = snapShot.data().friends;
        // console.log("ok3");
        for (let i = 0; i < frei.length; i++) {
            let dociRef = doc(dbStore, "users", frei[i]);
            let docsnapShot = await getDoc(dociRef);
            let addUser = {
                ...docsnapShot.data(),
                userId: docsnapShot.id,
                password: ""
            };
            friends.push(addUser);
        }
        //
        if (!snapShot) {
            return res.status(200).send({
                message: "User Not Found",
                success: false,
            });
        }


        res.status(200).json({
            success: true,
            user: { ...snapShot.data(), userId: snapShot.id, password: "", friends: friends }
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({
            message: "auth error",
            success: false,
            error: e.message,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { Name, location, profileUrl, profession } = req.body;

        if (!(Name || profession || location)) {
            res.status(401).send({ message: "Please fill all the fields" });
            return;
        }

        const { userId } = req.body.user;

        const updateUser = {
            name: Name,
            location: location,
            profileUrl: profileUrl || "",
            profession: profession
        };
        const docRef = doc(dbStore, "users", userId);
        await updateDoc(docRef, updateUser);
        const new_user = await getDoc(docRef);
        const token = createJWT(new_user.id);

        const snapShot = await getDoc(docRef);
        let friends = []
        const frei = snapShot.data().friends;
        for (let i = 0; i < frei.length; i++) {
            let dociRef = doc(dbStore, "users", frei[i]);
            let docsnapShot = await getDoc(dociRef);
            let addUser = {
                ...docsnapShot.data(),
                userId: docsnapShot.id,
                password: ""
            };
            friends.push(addUser);
        }

        const user = {
            ...new_user.data(),
            userId: snapShot.id,
            password: "",
            friends: friends
        };

        res.status(200).send({
            success: true,
            message: "User updated successfully",
            user,
            token
        });
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: e.message });
    }
};

const friendRequest = async (req, res) => {
    try {
        const { userId } = req.body.user;
        const { requestTo } = req.body;

        const q1 = query(collection(dbStore, "friendrequest"), where("requestFrom", "==", userId), where("requestTo", "==", requestTo));
        const q2 = query(collection(dbStore, "friendrequest"), where("requestFrom", "==", requestTo), where("requestTo", "==", userId));
        const querySnapshot1 = await getDocs(q1);
        const querySnapshot2 = await getDocs(q2);
        let ok1 = 0; let ok2 = 0;
        querySnapshot1.forEach((doc) => { ok1 = 1; });
        querySnapshot2.forEach((doc) => { ok2 = 1; });

        if (ok1 || ok2) {
            res.status(401).send({ success: "failed", message: "Friend Request already sent." });
            return;
        }

        const data = {
            requestTo: requestTo,
            requestFrom: userId,
            requestStatus: "Pending",
            createdAt: serverTimestamp()
        };
        const user = await addDoc(collection(dbStore, "friendrequest"), data);
        res.status(201).send({
            success: true,
            message: "Friend Request sent successfully"
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({
            message: "auth error",
            success: false,
            error: e.message,
        });
    }
};

const getFriendRequest = async (req, res) => {
    try {
        const { userId } = req.body.user;
        const q = query(collection(dbStore, "friendrequest"), where("requestStatus", "==", "Pending"), where("requestTo", "==", userId), orderBy("createdAt", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        let data = [];
        let temp_data = [];
        querySnapshot.forEach((doc) => {
            temp_data.push({
                ...doc.data(),
                id: doc.id
            });
        })

        for (let i = 0; i < temp_data.length; i++) {
            let finalId = temp_data[i];
            let docRef = doc(dbStore, "users", finalId.requestFrom);
            let snapShot = await getDoc(docRef);
            let friends = []
            let frei = snapShot.data().friends;
            for (let j = 0; j < frei.length; j++) {
                let dociRef = doc(dbStore, "users", frei[j]);
                let docsnapShot = await getDoc(dociRef);
                // console.log("ok3");
                let addUser = {
                    ...docsnapShot.data(),
                    userId: docsnapShot.id,
                    password: ""
                };
                friends.push(addUser);
            }
            let deti = {
                ...snapShot.data(),
                password: "",
                userId: finalId.requestFrom,
                friends: friends
            }
            data.push({ ...deti, rid: temp_data[i].id });
        }

        res.status(200).send({
            success: true,
            data: data,
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: e.message,
        });
    }
};

const acceptRequest = async (req, res, next) => {
    try {
        const id = req.body.user.userId;
        const { rid, status } = req.body;

        const docRef = doc(dbStore, "friendrequest", rid);
        const docShot = await getDoc(docRef);

        if (!docShot.exists()) {
            res.status(401).send({ message: "No Friend Request Found" });
            return;
        }

        if (status === "Denied") {
            res.send({ status: "Denied", message: "Friend Request Not Accepted" });
            return;
        }

        await updateDoc(docRef, { requestStatus: status });

        let requestFrom, requestTo;
        // const docRef = doc(dbStore, "friendrequest", rid);
        const newdoc_Shot = await getDoc(docRef);
        requestFrom = newdoc_Shot.data().requestFrom;
        requestTo = newdoc_Shot.data().requestTo;

        if (status === "Accepted") {
            const dociRef1 = doc(dbStore, "users", requestFrom);
            const dociRef2 = doc(dbStore, "users", requestTo);
            await updateDoc(dociRef1, { friends: arrayUnion(requestTo) });
            await updateDoc(dociRef2, { friends: arrayUnion(requestFrom) });
        }

        res.status(201).send({
            success: true,
            message: "Friend Request " + status,
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: e.message,
        });
    }
};

const profileViews = async (req, res, next) => {
    try {
        const { userId } = req.body.user;
        const { id } = req.body;

        const docRef = doc(dbStore, "users", id);
        const docShot = await getDoc(docRef);
        // console.log(docShot.data().likes);
        const index = await docShot.data().views.includes(userId);

        if (index) {
            res.status(401).send({ message: "Already Viewed Profile" });
            return;
        }

        await updateDoc(docRef, { views: arrayUnion(userId) });
        // const docShot1 = await getDoc(docRef);
        // const data = { userId: id, }
        res.status(201).send({
            success: true,
            message: "Successfully",
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({
            message: "auth error",
            success: false,
            error: e.message,
        });
    }
};

const suggestedFriends = async (req, res, next) => {
    try {
        const { userId } = req.body.user;
        console.log(userId, "suggested Friends")
        const q = query(collection(dbStore, "users"));
        // const q = query(collection(dbStore, "users"), where(documentId(), '!=', userId), where('friends', 'array-not-contains', userId), limit(15));
        const DocShot = await getDocs(q);
        const users = DocShot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(user => user.id !== userId && !user.friends.includes(userId))
            .slice(0, 15);

        const data = users.map(user => ({
            id: user.id,
            name: user.name,
            profileUrl: user.profileUrl,
            profession: user.profession,
            // Exclude password explicitly, since we are mapping only the required fields
        }));
        res.status(200).json({
            success: true,
            data: data,
        });
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: e.message });
    }
};


export { verifyEmail, requestPasswordReset, resetPassword, changePassword, getUser, updateUser, friendRequest, getFriendRequest, acceptRequest, profileViews, suggestedFriends };