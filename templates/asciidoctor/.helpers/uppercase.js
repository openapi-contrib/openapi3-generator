module.exports = (Handlebars, _) =>{

  /**
   * Uppercases a string.
   */
  Handlebars.registerHelper('uppercase', (str) => {
    return str.toUpperCase();
  });

}
