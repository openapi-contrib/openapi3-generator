module.exports = (Handlebars, _) =>{

  Handlebars.registerHelper('equal', (lvalue, rvalue, options) => {
    if (arguments.length < 3)
      throw new Error('Handlebars Helper equal needs 2 parameters');
    if (lvalue!==rvalue) {
      return options.inverse(this);
    }

    return options.fn(this);
  });

}
