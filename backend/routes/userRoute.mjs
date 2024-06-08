import express from "express";
import { userRegisterAuth, loginAuth } from '../controllers/authController.mjs';
// import { verifyToken } from '../utils/webtoken.mjs';

// const router = express.Router();

// router.get('/protected-route', verifyToken, (req, res) => {
//     // If the token is valid, req.user will contain the decoded user information
//     res.send(`Welcome ${req.user.username}!`);
// });

const userRouter = express.Router();
userRouter.post('/signup', userRegisterAuth);
userRouter.post('/login', loginAuth);


export { userRouter };