import express from "express";
import { userAuth } from '../controllers/authController.mjs';

const userRouter = express.Router();
userRouter.post('/signup', userAuth);

export { userRouter };