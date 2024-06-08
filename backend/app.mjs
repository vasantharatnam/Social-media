import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
// import { dbConfig } from "./dbConfig/firebaseConfig.mjs";
import { authRouter } from "./routes/authRoute.mjs";
import helmet from "helmet";
import cookieParser from "cookie-parser"
import { errorMiddleware } from "./middleware/errorMiddleware.mjs";

// security packages
dotenv.config();
const app = express();
const PORT = process.env.REACT_APP_PORT;
const URL = process.env.REACT_APP_APP_URL;

const __dirname = path.resolve(path.dirname(""));
app.use(express.static(path.join(__dirname, "views/build")));

// http://localhost:8800
// @desc  MiddleWares

app.use(bodyParser.json());
app.use(cors());
// app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(errorMiddleware);
app.use(authRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

// routes
app.get('/', (req, res) => {
    res.status(200).send({ 'Hello World!': 'Hello World!' });
});
