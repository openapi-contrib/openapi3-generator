const Handlebars = require('handlebars');

/**
 * Uppercases a string.
 */
Handlebars.registerHelper('uppercase', (str) => {
  return str.toUpperCase();
});
