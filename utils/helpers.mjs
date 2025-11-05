import bcrypt from "bcrypt";

const saltRound = 10;

export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRound)
    bcrypt.hashSync(password, salt)
}