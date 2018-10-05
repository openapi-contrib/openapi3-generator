module.exports = (_, Handlebars) =>{

  /**
   * Uppercases a string.
   */
  Handlebars.registerHelper('uppercase', (str) => {
    return str.toUpperCase();
  });
  
}
