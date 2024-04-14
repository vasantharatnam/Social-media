import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
// import { dbConfig } from "./dbConfig/firebaseConfig.mjs";
import { userRouter } from "./routes/userRoute.mjs";
import helmet from "helmet";

// security packages
dotenv.config();
const app = express();
const PORT = process.env.REACT_APP_PORT;
const URL = process.env.REACT_APP_APP_URL;

// http://localhost:8800
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use('/', userRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

// routes
app.get('/', (req, res) => {
    res.status(200).send({ 'Hello World!': 'Hello World!' });
});
