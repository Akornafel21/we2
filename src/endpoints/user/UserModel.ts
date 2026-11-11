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