import express, { Router } from "express";
import path from "path";
import {
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    changePassword,
    getUser,
    updateUser,
    friendRequest,
    getFriendRequest,
    acceptRequest,
    profileViews,
    suggestedFriends
} from "../controllers/userController.mjs";

import { userAuth } from "../middleware/authMiddleware.mjs";

const verifyRouter = express.Router();
const __dirname = path.resolve(path.dirname(""));

verifyRouter.get("/verify/:userId/:token", verifyEmail);
// PASSWORD RESET
verifyRouter.post("/request-passwordreset", requestPasswordReset);
verifyRouter.get("/reset-password/:userId/:token", resetPassword);
verifyRouter.post("/reset-password", changePassword);

// user routes
verifyRouter.post("/get-user/:id?", userAuth, getUser);
verifyRouter.put("/update-user", userAuth, updateUser);

// friend request
verifyRouter.post("/friend-request", userAuth, friendRequest);
verifyRouter.post("/get-friend-request", userAuth, getFriendRequest);

// accept / deny friend request
verifyRouter.post("/accept-request", userAuth, acceptRequest);

// view profile
verifyRouter.post("/profile-view", userAuth, profileViews);

//suggested friends
verifyRouter.post("/suggested-friends", userAuth, suggestedFriends);
verifyRouter.get("/verified", (req, res) => {
    res.sendFile(path.join(__dirname, "./views/build", "index.html")); //verifiedpage.html
});

verifyRouter.get("/resetpassword", (req, res) => {
    res.sendFile(path.join(__dirname, "./views/build", "index.html")); //verifiedpage.html
});

export { verifyRouter };