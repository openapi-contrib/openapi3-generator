<h1 align="center">OpenAPI 3 Generator</h1>
<p align="center">
  Use your API OpenAPI 3 definition to generate code, documentation, and literally anything you need.
</p>

## Install

To use it from the CLI:

```bash
npm install -g openapi3-generator
```

## Requirements

* Node.js v7.6+

## Usage

### From the command-line interface (CLI)

```bash
  Usage: og [options] <openapiFileOrURL> <template>


  Options:

    -V, --version                  output the version number
    -o, --output <outputDir>       directory where to put the generated files (defaults to current directory)
    -t, --templates <templateDir>  directory where templates are located (defaults to internal templates directory)
    -b, --basedir <baseDir>        directory to use as the base when resolving local file references (defaults to OpenAPI file directory)
    -h, --help                     output usage information
```

#### Examples

The shortest possible syntax:
```bash
og openapi.yaml markdown
```

Specify where to put the generated code:
```bash
og -o ./my-docs openapi.yaml markdown
```

## Templates

### Creating your own templates
Templates are the sources where the result will be generated from. There are already some templates
you can use to generate code and documentation.

The files in your template can be of the following types:
1. Static: This kind of files will be simply copied to the output directory.
2. Templates: This kind of files will be compiled using [Handlebars](http://handlebarsjs.com/), and copied to the output directory.
3. Path templates: This kind of files will be compiled using [Handlebars](http://handlebarsjs.com/), but it will generate one file per OpenAPI path.

Assuming we have the following OpenAPI Spec:
```yaml
openapi: "3.0.0"
info:
  version: 1.0.0
  title: Swagger Petstore
  license:
    name: MIT
servers:
  - url: http://petstore.swagger.io/v1
paths:
  /pet:
    get:...
    post:...
  /pet/{petId}:
    get:...
  /user/login:
    post:...
  /user/{username}:
    get:...
    put:...
    delete:...
...
```
And some template files like this:
```
|- index.js            // This file contains static code, e.g. starting a webserver and including ./api/index.js
|+ api/
 |- index.js           // This is a static template, it contains placeholders that will be filled in, e.g. includes for each file in routes
 |+ routes/
  |- $$path$$.route.js      // This file will be generated for each operation and contains skeleton code for each method for an operation.
```
The first important thing to notice here is the variable notation in `$$path$$.route.js`. It will be replaced by the name of the path.

In this example the generated directory structure will be like this:
```
|- index.js            // This file still contains static code like before.
|+ api/
 |- index.js           // This file will now e.g. have included the two files in routes.
 |+ routes/
  |- pet.route.js      // This file contains the code for methods on pets.
  |                    // (e.g. getPet, postPet, getPetByPetId).
  |- user.route.js     // This file will contain the code for methods on users.
                       // (e.g. postUserLogin, getUserByUsername, putUserByUsername, deleteUserByUsername).
```

### Template file content
The generator passes the OpenAPI spec to template files, so all information should be available there.
In addition to that, the code generator adds a bit [more data](#data-passed-to-handlebars-templates) that can be helpful.

#### Examples:
##### Dynamically require files in JavaScript
```mustache
{{#each @root.swagger.endpoints}}
const {{.}} = require('./routes/{{.}}.route.js')
{{/each}}
```
will produce (using the OAS Spec example from above):
```js
const pet = require('./routes/pet.route.js')
const user = require('./routes/user.route.js')
```

### Data passed to Handlebars templates
| Param | Type | Description |
| --- | --- | --- |
|openapi|object|The OpenAPI spec.|
|swagger|object|The OpenAPI spec (convenience alias).|
|swagger.endpoints| object | All first level endpoints (e.g  `pet` and `user`) |

### Custom handlebars helpers
If your template needs Handlebars helpers, you can define them in a directory called `.helpers` inside your template.

Check out some examples in the [markdown](./markdown/.helpers) template.

### Using handlebars partials
If you want to use partials in your template, define them in a directory called `.partials` inside your template.

Check out some examples in the [markdown](./markdown/.partials) template.

> The name of the partial will be obtained from the file name, converted to camel case. So, for instance, if the file name is `my-partial.js`, you can use the partial with `{{> myPartial}}`.

## Authors

* Fran Méndez ([@fmvilas](http://twitter.com/fmvilas))
* Richard Klose ([@richardklose](http://github.com/richardklose))
