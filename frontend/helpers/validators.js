export const nameValidator = (name) => {
    if (!name) return "Name cannot be empty.";
    if (name.length < 3) return "Name must be at least 3 characters.";
    return "";
  };
  
  export const phoneNumberValidator = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneNumber) return "Phone number cannot be empty.";
    if (!phoneRegex.test(phoneNumber)) return "Phone number is invalid.";
    return "";
  };
  
  export const passwordValidator = (password) => {
    if (!password) return "Password cannot be empty.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };
  
  export const repasswordValidator = (password, repassword) => {
    if (!repassword) return "Please re-enter the password.";
    if (password !== repassword) return "Passwords do not match.";
    return "";
  };
  
  export const genderValidator = (gender) => {
    if (!gender) return "Please select a gender.";
    return "";
  };
  
  export const birthDateValidator = (birthDate) => {
    const today = new Date();
    if (!birthDate) return "Please select your birth date.";
    if (birthDate > today) return "Birth date cannot be in the future.";
    return "";
  };