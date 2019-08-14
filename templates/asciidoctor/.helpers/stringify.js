module.exports = (Handlebars, _) =>{

  Handlebars.registerHelper('stringify', json => {
    if (!(json instanceof String) && typeof json !== 'string' ) {
      try {
        return JSON.stringify(json || '', null, 2);
      } catch (e) {
        return '';
      }
    } else {
      return json;
    }	    
  });
}
