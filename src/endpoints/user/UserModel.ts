import { HydratedDocument, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";


export interface IUser {
  userID: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isAdministrator: boolean;
}

export type UserDocument = HydratedDocument<IUser>;

// Mongoose-Schema
const userSchema = new Schema<IUser>({
  userID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  isAdministrator: { type: Boolean, default: false }
});


userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

export const User = model<IUser>("User", userSchema);


// userSchema.pre("save", function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   bcrypt.hash(this.password, 10, (err, hash) => {
//     if (err) {
//       return next(err);
//     }
//     this.password = hash;
//     next();
//   });
// });




// Є рядок Authorization: Bearer ...
// Content-Type не application/json
// 2 ЗМІШАНЕ:         хто я — із заголовка, що робити — з тіла | isAuthenticated → res.locals.user as TokenPayload 
// → typeof → findOne → bcrypt.compare → user.password=new + save() (хук хешує) → sendError

// import express, { Request, Response, Router } from "express";
// import bcrypt from "bcryptjs";
// import { isAuthenticated } from "../../utils/AuthenticationUtils";
// import { TokenPayload } from "../authentication/AuthenticationService";
// import { User, UserDocument } from "../user/UserModel";
// import { sendError, ValidationError, NotFoundError } from "../../utils/Errors";

// const router: Router = express.Router();

// // Form des erwarteten Bodys. "unknown", weil der Client alles schicken kann.
// interface ChangePasswordBody {
//     oldPassword?: unknown;
//     newPassword?: unknown;
// }

// // POST /api/abnahme/changePassword
// router.post("/changePassword", isAuthenticated, async (req: Request, res: Response): Promise<void> => {
//     // Wer bin ich? Kommt aus dem Token, NICHT aus dem Body.
//     const requester: TokenPayload = res.locals.user as TokenPayload;

//     const body: ChangePasswordBody = (req.body ?? {}) as ChangePasswordBody;
//     const oldPassword: unknown = body.oldPassword;
//     const newPassword: unknown = body.newPassword;

//     try {
//         if (typeof oldPassword !== "string" || typeof newPassword !== "string" || newPassword.trim() === "") {
//             throw new ValidationError("oldPassword and newPassword are required");
//         }

//         const user: UserDocument | null = await User.findOne({ userID: requester.userID });
//         if (!user) {
//             throw new NotFoundError(`Es konnte kein User mit der ID ${requester.userID} gefunden werden.`);
//         }

//         const passwordCorrect: boolean = await bcrypt.compare(oldPassword, user.password);
//         if (!passwordCorrect) {
//             res.status(401).json({ Error: "Authentication failed" });
//             return;
//         }

//         // Das Hashen macht der pre-save-Hook im UserModel automatisch.
//         user.password = newPassword;
//         await user.save();

//         res.status(200).json({ Success: "Password changed" });
//     } catch (err: unknown) {
//         sendError(res, err);
//     }
// });

// export default router;

// httpServer.ts
// import changePasswordRoute from "./endpoints/abnahme/ChangePasswordRoute";
// app.use("/api/abnahme", changePasswordRoute);        // ДО 404-handler