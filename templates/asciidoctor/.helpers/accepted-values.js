module.exports = (Handlebars, _) =>{

  Handlebars.registerHelper('acceptedValues', items =>{
    if(!items) return 'Any';

    return items.map(i => `<code>${i}</code>`).join(', ');
  });

}
