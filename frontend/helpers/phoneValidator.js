export function phoneValidator(phone) {
    if (!phone) {
      return "Phone number cannot be empty.";
    }
    if (!/^\d+$/.test(phone)) {
      return "Phone number must contain only digits.";
    }
    if (phone.length < 10 || phone.length > 15) {
      return "Phone number must be between 10 and 15 digits.";
    }
    if (!phone.startsWith("0")) {
      return "Phone number must start with 0.";
    }
    return ""; // No error
  }