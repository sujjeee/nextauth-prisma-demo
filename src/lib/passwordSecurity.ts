import { hash, genSalt, compare } from "bcrypt"

export async function hashPassword(params: string) {
    const password = params
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword
}

export async function comparePassword({
    userPassword,
    dbPassword
}: {
    userPassword: string;
    dbPassword: string;
}) {
    const isValidPassword = await compare(userPassword, dbPassword);
    return isValidPassword
}

