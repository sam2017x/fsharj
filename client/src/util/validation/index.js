const onChange = (e, rules) => {
  e.preventDefault();
};

const validationProps = {
  invalid: null,
  onChange,
};

const validationRules = {
  username: val =>
    (val.length < 3 || val.length > 8) &&
    'Username has to be between 3-8 chars.',
  password: val =>
    (val.length < 3 && 'Password must be longer than 3 characters.') ||
    (val.length > 8 && 'Password has to be shorter than 8 characters.'),
};

const setValidation = input => ({
  ...validationProps,
  rules: validationRules[input],
});
