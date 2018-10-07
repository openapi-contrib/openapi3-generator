module.exports = (_, Handlebars) =>{

  Handlebars.registerHelper('buildPath', (propName, path, key) => {
    if (!path) return propName;
    return `${path}.${propName}`;
  });

}
