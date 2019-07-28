module.exports = (Handlebars, _) =>{

  Handlebars.registerHelper('tree', path => {
    if (!path) return '';
    const filteredPaths = path.split('.').filter(Boolean);
    if (!filteredPaths.length) return;
    const dottedPath = filteredPaths.join('.');

    return `${dottedPath}.`;
  });

}
