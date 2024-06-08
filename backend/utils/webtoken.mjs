import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const hashPassword = async (inpuPasswo) => {
    const salt = await bcrypt.genSalt(10);

    const hashPassworder = await bcrypt.hash(inpuPasswo, salt);
    return hashPassworder;
};

const comparePasswo = async (compaPasswo, actualPasswo) => {
    const matchIng = await bcrypt.compare(compaPasswo, actualPasswo);
    // const matchIng = await bcrypt.compare(actualPasswo, compaPasswo);
    return matchIng;
};

const createJWT = (id) => {
    return jwt.sign({ userId: id }, process.env.REACT_APP_JWT_SECRET_ID, { expiresIn: "1d" });
}

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        console.log("cook", token);
        if (!token) return res.status(401).send({ message: "You are not authenticated!" });
        jwt.verify(token, process.env.JWT, (err, user) => {
            if (err) return res.status(403).send({ message: "Token is not valid!" });
            req.user = user;
            next()
        });
    }
    catch (e) { console.log("ok", e.message); res.status(404).send({ message: e.message }); }
};

export { verifyToken, hashPassword, comparePasswo, createJWT };