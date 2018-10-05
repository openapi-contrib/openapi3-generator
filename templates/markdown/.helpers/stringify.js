module.exports = (_, Handlebars) =>{

  Handlebars.registerHelper('stringify', json => {
    try {
      return JSON.stringify(json || '', null, 2);
    } catch (e) {
      return '';
    }
  });

}