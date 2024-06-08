import express from "express";
import { userRouter } from "./userRoute.mjs";
import { verifyRouter } from "./verifyRoute.mjs";
import { Postrouter } from "./postRoute.mjs";

const authRouter = express.Router();
authRouter.use('/auth', userRouter);
authRouter.use('/users', verifyRouter);
authRouter.use(`/posts`, Postrouter);

export { authRouter };