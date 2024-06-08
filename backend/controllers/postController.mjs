import { deleteDoc, arrayRemove, getDoc, arrayUnion, limit, doc, updateDoc, getDocs, addDoc, collection, serverTimestamp, where, query, orderBy, documentId } from "firebase/firestore";
import { dbAuth, dbStore } from '../dbConfig/firebaseConfig.mjs';

const createPost = async (req, res) => {
    try {
        const { userId } = req.body.user;
        const { description, image } = req.body;

        if (!description) {
            res.status(401).send({ message: "You must provide a description" });
            return;
        }
        // if (!image) {
        //     res.status(401).send({ message: "You must provide a image" });
        //     return;
        // }

        const postData = {
            "userId": userId,
            "description": description,
            "image": image || null,
            "likes": [],
            "comments": [],
            "createdAt": Date.now()
        };

        const new_id = await addDoc(collection(dbStore, "posts"), postData);

        res.status(200).send({
            success: true,
            message: "Post created successfully",
            data: { ...postData, pid: new_id.id },
        });
    }
    catch (e) {
        console.log(e);
        res.status(404).send({ message: e.message });
    }
};

const getPosts = async (req, res) => {
    try {
        const { userId } = req.body.user;
        const docref = query(collection(dbStore, "posts"), orderBy("createdAt", "desc"));
        const snapShot = await getDocs(docref);
        let temp_posts = []
        let data = []
        snapShot.forEach((doc) => {
            temp_posts.push({
                ...doc.data(),
                _id: doc.id
            });
        })
        for (let i = 0; i < temp_posts.length; i++) {
            let doci = temp_posts[i];
            let new_ref = doc(dbStore, "users", doci.userId);
            let newShot = await getDoc(new_ref);
            data.push({
                ...temp_posts[i],
                userId: {
                    _id: newShot.id,
                    name: newShot.data().name,
                    location: newShot.data().location,
                    profileUrl: newShot.data().profileUrl
                }
            });
        }

        res.status(200).json({
            sucess: true,
            message: "successfully",
            data: data,
        });
    }
    catch (e) {
        console.log(e);
        res.status(404).send({ message: e.message });
    }
};

const getPost = async (req, res) => {

    try {
        const { id } = req.params;
        const docref = doc(dbStore, "posts", id);
        const docShot = await getDoc(docref);
        let useid;
        useid = docShot.data().userId;
        const docref1 = doc(dbStore, "users", useid);
        const docShot1 = await getDoc(docref1);
        let data = {
            ...docShot.data(),
            _id: docShot.id,
            userId: {
                _id: docShot1.id,
                name: docShot1.data().name,
                location: docShot1.data().location,
                profileUrl: docShot1.data().profileUrl
            }
        };

        res.status(200).send({
            success: true,
            message: "successful",
            data: data,
        });
    }
    catch (e) {
        console.log(e);
        res.status(404).send({ message: e.message });
    }
};

const getUserPost = async (req, res) => {
    try {
        const { id } = req.params;
        const q = query(collection(dbStore, "posts"), where("userId", "==", id), orderBy("createdAt", "desc"));
        const docShot = await getDocs(q);
        // let data = [];
        // for (let i = 0; i < docShot.length; i++) {
        //     let docSnapShot = docShot[i];
        //     let useid = docSnapShot.data().userId;
        //     const docref1 = doc(dbStore, "users", useid);
        //     const docShot1 = await getDoc(docref1);

        //     let temp_data = {
        //         name: docShot1.data().name,
        //         location: docShot1.data().location,
        //         profileUrl: docShot1.data().profileUrl,
        //         ...docSnapShot.data()
        //     };
        //     data.push(temp_data);
        // }

        const fetchUserData = async (docSnapShot) => {
            let userId = docSnapShot.data().userId;
            const docref1 = doc(dbStore, "users", userId);
            const docShot1 = await getDoc(docref1);

            return {
                name: docShot1.data().name,
                location: docShot1.data().location,
                profileUrl: docShot1.data().profileUrl,
                ...docSnapShot.data()
            };
        };

        const promises = docShot.docs.map(docSnapShot => fetchUserData(docSnapShot));

        const data = await Promise.all(promises);

        res.status(200).send({
            success: true,
            message: "successfull",
            data: data
        });
    }
    catch (e) {
        console.log(e);
        res.status(404).send({ message: e.message });
    }
};

const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        // let data = [];
        const q = query(collection(dbStore, "comments"), where("postId", "==", postId), orderBy("createdAt", "desc"));
        const docShot = await getDocs(q);

        const allProcedure = async (docShot, dbStore) => {
            let temp_comments = [];

            // Step 1: Extract initial comment data
            docShot.forEach((doc) => {
                temp_comments.push({
                    ...doc.data(),
                    _id: doc.id
                });
            });

            // Step 2: Create a function to fetch user details
            const fetchUserDetails = async (userId) => {
                let docref = doc(dbStore, "users", userId);
                let docShot1 = await getDoc(docref);
                if (docShot1.exists()) {
                    return {
                        _id: docShot1.id,
                        name: docShot1.data().name,
                        location: docShot1.data().location,
                        profileUrl: docShot1.data().profileUrl
                    };
                }
                return null;
            };

            // Step 3: Create a function to fetch replies details
            const fetchRepliesDetails = async (replies) => {
                const replyPromises = replies.map(async (reply) => {
                    let docref2 = doc(dbStore, "users", reply.userId);
                    let docShot2 = await getDoc(docref2);
                    if (docShot2.exists()) {
                        return {
                            ...reply,
                            _id: docShot2.id,
                            name: docShot2.data().name,
                            location: docShot2.data().location,
                            profileUrl: docShot2.data().profileUrl
                        };
                    }
                    return null;
                });
                const replyResults = await Promise.all(replyPromises);
                return replyResults.filter(reply => reply !== null);
            };

            // Step 4: Create a function to fetch comment details including user and replies
            const fetchCommentDetails = async (comment) => {
                let userDetails = await fetchUserDetails(comment.userId);
                let repliesDetails = await fetchRepliesDetails(comment.replies);

                return {
                    ...comment,
                    userId: userDetails,
                    replies: repliesDetails
                };
            };

            // Step 5: Use Promise.all to fetch all comments' details in parallel
            const commentPromises = temp_comments.map(comment => fetchCommentDetails(comment));
            const detailedComments = await Promise.all(commentPromises);

            return detailedComments;
        };


        const data = await allProcedure(docShot, dbStore);

        // let temp_comments = [];
        // docShot.forEach((doc) => {
        //     temp_comments.push({
        //         ...doc.data(),
        //         _id: doc.id
        //     })
        // });

        // for (let i = 0; i < temp_comments.length; i++) {
        //     let docSnap1 = temp_comments[i];
        //     let docref = doc(dbStore, "users", docSnap1.userId);
        //     let docShot1 = await getDoc(docref);
        //     let temp1 = {
        //         _id: docShot1.id,
        //         name: docShot1.data().name,
        //         location: docShot1.data().location,
        //         profileUrl: docShot1.data().profileUrl
        //     };
        //     let reply_temp = []
        //     let replie_userid = docSnap1.replies;
        //     for (let j = 0; j < replie_userid.length; j++) {
        //         let docRep = replie_userid[i];
        //         let docref2 = doc(dbStore, "users", docRep.userId);
        //         let docShot2 = await getDoc(docref2);
        //         let inside_temp = {
        //             ...docRep,
        //             _id: docShot1.id,
        //             name: docShot1.data().name,
        //             location: docShot1.data().location,
        //             profileUrl: docShot1.data().profileUrl
        //         };
        //         reply_temp.push(inside_temp);
        //     }
        //     let outside_temp = {
        //         ...temp_comments[i],
        //         userId: { ...temp1 },
        //         replies: reply_temp
        //     }
        //     data.push(outside_temp);
        // }

        res.status(200).send({
            success: true,
            message: "successfull",
            data: data
        });

    }
    catch (e) {
        console.log(e);
        res.status(404).send({ message: e.message });
    }
};

const likePost = async (req, res) => {
    try {
        const { userId } = req.body.user;
        const { id } = req.params;
        const docref = doc(dbStore, "posts", id);
        const docShot = await getDoc(docref);
        console.log(docShot.data().likes);
        const index = docShot.data().likes.includes(userId);
        // console.log(index);
        if (!index) {
            // ok1 = [...docShot.data().likes];
            // ok1.push(userId);
            await updateDoc(docref, { likes: arrayUnion(userId) });
        }
        else {
            await updateDoc(docref, { likes: arrayRemove(userId) });
        }

        const doc1Shot = await getDoc(docref);
        res.status(200).send({
            success: true,
            message: "successfully",
            data: { ...doc1Shot.data(), _id: doc1Shot.id },
        });
    }
    catch (e) {
        console.log(e);
        res.status(404).send({ message: e.message });
    }
};

const likePostComment = async (req, res) => {
    try {
        const { userId } = req.body.user;
        const { id, rid } = req.params;

        if (rid === undefined || rid === null || rid === `false`) {
            const docref = doc(dbStore, "comments", id);
            const docShot = await getDoc(docref);
            const index = await docShot.data().likes.includes(userId);;

            if (!index) {
                await updateDoc(docref, { likes: arrayUnion(userId) });
            }
            else {
                await updateDoc(docref, { likes: arrayRemove(userId) });
            }

            const doc1Shot = await getDoc(docref);
            res.status(200).send({
                success: true,
                message: "successfully",
                data: { ...doc1Shot.data(), _id: doc1Shot.id }
            });
        }
        else {
            const q = query(collection(dbStore, "comments"), where(documentId(), '==', id));
            const docShot = await getDocs(q);
            let results;
            let docirefi;
            for (let i = 0; i < docShot.length; i++) {
                const data = docShot[i].data();
                // Check if the replies array contains a reply with the specified rid
                const reply = data.replies ? data.replies.find(reply => reply.rid === rid) : null;
                if (reply) {
                    results = data;
                    docirefi = docShot[i];
                    break;
                }
            }

            const index = results?.replies[0]?.likes.includes(userId);

            let ok1 = [];
            if (index === -1) {
                ok1 = [...results?.replies[0].likes];
                ok1.push(userId);
            }
            else {
                ok1 = results?.replies[0].likes.filter((pid) => { pid !== String(userId) });
            }

            let repli0 = {
                ...results.replies[0],
                likes: ok1
            };

            let repi = []; repi.push(repli0); let ok2 = results?.replies.shift();
            repi.push(...ok2);

            await updateDoc(docirefi, { replies: repi });
            const lastShot = await getDoc(docirefi);

            res.status(201).send({ ...lastShot.data() });
        }
    }
    catch (e) {
        console.log(e);
        res.status(404).send({ message: e.message });
    }
};

const commentPost = async (req, res) => {
    try {
        const { comment, from } = req.body;
        const { userId } = req.body.user;
        const { id } = req.params;

        if (comment === null) {
            return res.status(404).json({ message: "Comment is required." });
        }

        const commentData = {
            comment: comment,
            from: from,
            userId: userId,
            postId: id,
            replies: [],
            likes: [],
            createdAt: Date.now()
        };

        const user = await addDoc(collection(dbStore, "comments"), commentData);
        const docref = doc(dbStore, "posts", id);
        await updateDoc(docref, { comments: arrayUnion(user.id) });

        res.status(201).send({ ...commentData, _id: user.id });
    }
    catch (e) {
        console.log(e);
        res.status(404).send({ message: e.message });
    }
};

const replyPostComment = async (req, res) => {
    try {
        const { userId } = req.body.user;
        const { comment, replyAt, from } = req.body;
        const { id } = req.params;

        if (comment === null) {
            return res.status(404).json({ message: "Comment is required." });
        }

        const docRef = doc(dbStore, "comments", id);
        const replies_data = {
            comment: comment,
            from: from,
            userId: userId,
            replyAt: replyAt,
            from: from,
            likes: [],
            createdAt: Date.now()
        };

        await updateDoc(docRef, { replies: arrayUnion(replies_data) });
        const docSnap = await getDoc(docRef);
        res.status(200).send({ ...docSnap.data(), _id: docSnap.id });
    }
    catch (e) {
        console.log(e);
        res.status(404).send({ message: e.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = doc(dbStore, "posts", id);
        await deleteDoc(docRef);

        res.status(200).send({
            success: true,
            message: "Deleted successfully",
        });
    }
    catch (e) {
        console.log(e);
        res.status(404).send({ message: e.message });
    }
};


export { createPost, getPosts, getPost, getUserPost, getComments, likePost, likePostComment, commentPost, replyPostComment, deletePost };