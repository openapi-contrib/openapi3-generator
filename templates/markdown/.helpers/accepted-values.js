const Handlebars = require('handlebars');

Handlebars.registerHelper('acceptedValues', items => {
  if (!items) return '<em>Any</em>';

  return items.map(i => `<code>${i}</code>`).join(', ');
});
