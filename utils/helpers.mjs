import bcrypt from "bcrypt";

const saltRound = 10;

export const hashPassword = (password) => {
    // console.log('password', password);
    const salt = bcrypt.genSaltSync(saltRound)
    // console.log('salt', salt);
    return bcrypt.hashSync(password, salt)
}

export const compareHashedPassword = (password, hashed) => bcrypt.compareSync(password, hashed)