import config from "../../config/config.json";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../user/UserModel";

export interface TokenPayload {
    userID: string;
    isAdministrator: boolean;
}

const tokenKey = config.session.tokenKey;
const timeout = config.session.timeout;

export async function createToken(userID: string, password: string): Promise<string | null> {
    const user = await User.findOne({userID});
    if (!user) {
        return null;
    }
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
        return null;
    }
    const payload: TokenPayload = {userID: user.userID, isAdministrator: user.isAdministrator};
    return jwt.sign(payload, tokenKey, { algorithm: "HS256", expiresIn: timeout });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, tokenKey, { algorithms: ["HS256"]}) as TokenPayload;
    } catch {
        return null;
    }
}
