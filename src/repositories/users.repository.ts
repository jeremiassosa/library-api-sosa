import { User as UserModel } from "../models/index.js";

export async function getUserByEmail(email: string) {
    const row = await UserModel.findOne({ where: { email } });
    return row ? row.toJSON() : null;
}

export async function insertUser(email: string, passwordHashed: string, role: string) {
    const row = await UserModel.create({ email, password: passwordHashed, role });
    return row.toJSON();
}