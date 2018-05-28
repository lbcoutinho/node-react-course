// Regex from emailregex.com
const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// Validate emails
export default emails => {
  // Filter invalid emails
  const invalidEmails = emails
    .split(',')
    .map(email => email.trim())
    .filter(email => email && emailRegex.test(email) === false);
  if (invalidEmails.length) {
    return `These emails are invalid: ${invalidEmails}`;
  }

  return;
};
