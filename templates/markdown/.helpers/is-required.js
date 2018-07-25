const Handlebars = require('handlebars');

Handlebars.registerHelper('isRequired', (obj, key) => {
  if (!obj || !obj.required) return false;
  return !!(obj.required.includes(key));
});
