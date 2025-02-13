const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid.");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not Valid.");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password.")
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "skills",
        "about",
        "photoUrl"
    ]

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );

    return isEditAllowed;
}

const validateEditPasswordData = (req) => {
    if (!validator.isStrongPassword(req.body.password)) {
        throw new Error("Please enter a strong password.")
    }

    const allowedEditPassword = ["password"]

    const isEditPassword = Object.keys(req.body).every((field) =>
        allowedEditPassword.includes(field)
    );

    return isEditPassword;
}

module.exports = { validateSignUpData, validateEditProfileData, validateEditPasswordData };