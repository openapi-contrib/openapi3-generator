// Module constructor provides dependency injection from the generator instead of relying on require's cache here to ensure
// the same instance of Handlebars gets the helpers installed and Lodash is definitiely available
// regardless of where remote templates reside: in another Node project or a plain directory, which may have different or no modules available.
module.exports = (Handlebars, _) => {

  /**
   * Compares two values.
   */
  Handlebars.registerHelper('equal', (lvalue, rvalue, options) => {
    if (arguments.length < 3)
      throw new Error('Handlebars Helper equal needs 2 parameters');
    if (lvalue != rvalue) {
      return options.inverse(this);
    }

    return options.fn(this);
  });

  /**
   * Checks if a string ends with a provided value.
   */
  Handlebars.registerHelper('endsWith', (lvalue, rvalue, options) => {
    if (arguments.length < 3)
      throw new Error('Handlebars Helper equal needs 2 parameters');
    if (lvalue.lastIndexOf(rvalue) !== lvalue.length - 1 || lvalue.length - 1 < 0) {
      return options.inverse(this);
    }
    return options.fn(this);
  });

  /**
   * Checks if Value end with another value not case sensitive.
   */
  Handlebars.registerHelper('endsWithLowerCase', (lvalue, rvalue, options) => {
    if (arguments.length < 3)
      throw new Error('Handlebars Helper match needs 2 parameters');
    if (lvalue != undefined && rvalue != undefined) {
      const lvalueLowerCase = lvalue.toLowerCase();
      const rvalueLowerCase = rvalue.toLowerCase();
      if (!lvalueLowerCase.endsWith(rvalueLowerCase)) {
        return options.inverse(this);
      }
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  /**
   * Checks if a method is a valid HTTP method.
   */
  Handlebars.registerHelper('validMethod', (method, options) => {
    const authorized_methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLIK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND'];

    if (arguments.length < 3)
      throw new Error('Handlebars Helper validMethod needs 1 parameter');
    if (authorized_methods.indexOf(method.toUpperCase()) === -1) {
      return options.inverse(this);
    }

    return options.fn(this);
  });

  /**
   * Checks if a collection of responses contains no error responses.
   */
  Handlebars.registerHelper('ifNoErrorResponses', (responses, options) => {
    const codes = responses ? Object.keys(responses) : [];
    if (codes.find(code => Number(code) >= 400)) return options.inverse(this);

    return options.fn(this);
  });

  /**
   * Checks if a collection of responses contains no success responses.
   */
  Handlebars.registerHelper('ifNoSuccessResponses', (responses, options) => {
    const codes = responses ? Object.keys(responses) : [];
    if (codes.find(code => Number(code) >= 200 && Number(code) < 300)) return options.inverse(this);

    return options.fn(this);
  });

  /**
   * Checks if a string matches a RegExp.
   */
  Handlebars.registerHelper('match', (lvalue, rvalue, options) => {
    if (arguments.length < 3)
      throw new Error('Handlebars Helper match needs 2 parameters');
    if (!lvalue.match(rvalue)) {
      return options.inverse(this);
    }

    return options.fn(this);
  });
  /**
   * Check if value exists
   */
  Handlebars.registerHelper('NotUndefined', (value, options) => {
    if (arguments.length < 2)
      throw new Error('Handlebars Helper match needs 2 parameters');
    if (value != undefined) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  /**
   * Provides different ways to compare two values (i.e. equal, greater than, different, etc.)
   */
  Handlebars.registerHelper('compare', (lvalue, rvalue, options) => {
    if (arguments.length < 3) throw new Error('Handlebars Helper "compare" needs 2 parameters');

    const operator = options.hash.operator || '==';
    const operators = {
      '==': (l, r) => {
        return l == r;
      },
      '===': (l, r) => {
        return l === r;
      },
      '!=': (l, r) => {
        return l != r;
      },
      '<': (l, r) => {
        return l < r;
      },
      '>': (l, r) => {
        return l > r;
      },
      '<=': (l, r) => {
        return l <= r;
      },
      '>=': (l, r) => {
        return l >= r;
      },
      typeof: (l, r) => {
        return typeof l == r;
      }
    };

    if (!operators[operator]) throw new Error(`Handlebars Helper 'compare' doesn't know the operator ${operator}`);

    const result = operators[operator](lvalue, rvalue);

    if (result) {
      return options.fn(this);
    }

    return options.inverse(this);
  });

  /**
   * Capitalizes a string.
   */
  Handlebars.registerHelper('capitalize', (str) => {
    return _.capitalize(str);
  });

  /**
   * Converts a string to its camel-cased version.
   */
  Handlebars.registerHelper('camelCase', (str) => {
    return _.camelCase(str);
  });

  /**
   * Converts a multi-line string to a single line.
   */
  Handlebars.registerHelper('inline', (str) => {
    return str ? str.replace(/\n/g, '') : '';
  });

  /**
   * Quotes a JS identifier, if necessary.
   */
  Handlebars.registerHelper('quote', (str) => {
    return /[$&@-]/.test(str) ? `'${str}'` : str
  });

  /**
   * Transform Proporty to valid json.
   */
  Handlebars.registerHelper('transformToJsonData', (property) => {
    return checkProperty(property);
  });

  /**
   * Helper function to transform proporty to valid json.
   */
  function checkProperty(property) {
    if (property.type == "integer" || property.type == "boolean" || property.type == "number") {
      return `"${property.name}": ${checkExampleValues(property.example, property.type)}`;
    } else if (property.type == "object") {
      let object = `"${property.name}": {`;
      let i;
      for (i = 0; i < _.values(property.properties).length; i++) {
        object += checkProperty(_.values(property.properties)[i]);
        if (i < _.values(property.properties).length - 1) {
          object += `,`;
        }
      }
      object += `}`;
      return object;
    } else if (property.type == "array") {
      let object = `"${property.name}": [`;
      let i;
      if (property.example != undefined) {
        for (i = 0; i < property.example.length; i++) {
          object += checkExampleValues(property.example[i], property.items.type);
          if (i < property.example.length - 1) {
            object += `,`;
          }
        }
      }
      object += `]`;
      return object;
    } else if (property.type == "string") {
      return `"${property.name}": ${checkExampleValues(property.example, property.type)}`;
    } else {
      return `"${property.name}": ${checkExampleValues(property.example, property.type)}`;
    }
  }

  /**
   * Helper function to transform example values to valid json.
   */
  function checkExampleValues(example, type) {
    if (type == "integer" || type == "boolean" || type == "number") {
      return example;
    } else if (type == "object") {
      let object = `"${example.name}": {`;
      let i;
      for (i = 0; i < _.values(example.properties).length; i++) {
        object += checkProperty(_.values(example.properties)[i]);
        if (i < _.values(property.properties).length - 1) {
          object += `,`;
        }
      }
      object += `}`;
      return object;
    } else if (type == "array") {
      let object = `"${example.name}": [`;
      let i;
      for (i = 0; i < example.length; i++) {
        object += checkProperty(_.values(example.properties)[i]);
        if (i < _.values(example.properties).length - 1) {
          object += `,`;
        }
      }
      object += `]`;
      return object;
    } else if (type == "string") {
      return `"${example}"`;
    } else {
      return `"${example}"`;
    }
  }
}
