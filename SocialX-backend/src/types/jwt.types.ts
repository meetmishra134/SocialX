import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export interface AccessTokenPayload extends JwtPayload {
  _id: mongoose.Types.ObjectId;
  email: string;
  userName: string;
}
export interface RefreshTokenPayload extends JwtPayload {
  _id: string;
}
