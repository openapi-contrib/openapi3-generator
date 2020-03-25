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

    -V, --version                  		output the version number
    -o, --output <outputDir>       		directory where to put the generated files (defaults to current directory)
    -t, --templates <templateDir>  		directory where templates are located (defaults to internal templates directory)
    -b, --basedir <baseDir>        		directory to use as the base when resolving local file references (defaults to OpenAPI file directory)
    -c, --curl        		        	generate a curl scripts (defaults is false)
    -s, --skipExistingFiles        		skip existing files
    -d, --deleteFolders <folderName>    directory names to be deleted, e.g. "auto", "*"
    -h, --help                     		output usage information
```

#### Examples

The shortest possible syntax to create markdowns for the openapi.yaml file:
```bash
og openapi.yaml markdown
```

Specify where to put the generated code:
```bash
og -o ./my-docs openapi.yaml markdown
```

The syntax to create an express server with only the endpoints for the openapi.yaml file:
```bash
og -o ./express-server openapi.yaml express
```

The syntax to create an full functionaly CRUD-Server, which reads and writes from json-files for the openapi.yaml file:
```bash
og -o ./demo-crud-server openapi.yaml json_crud_server
```

The syntax to create an full functionaly CRUD-Server with own templates and deletion of the existing demo-server :
```bash
og -d * -o ./demo-server -t ./ openapi.yaml demo-server-templates
```

## Templates

### Creating your own templates
Templates are the sources where the result will be generated from. There are already some templates
you can use to generate code and documentation.

The files in your template can be of the following types:
1. Static: This kind of files will be simply copied to the output directory.
2. Templates: This kind of files will be compiled using [Handlebars](http://handlebarsjs.com/), and copied to the output directory.
3. Path templates: This kind of files will be compiled using [Handlebars](http://handlebarsjs.com/), but it will generate one file per OpenAPI path.

#### Example 1 - Express server
Assuming we have the following OpenAPI Spec:
```yaml
openapi: "3.0.0"
info:
  version: 1.0.0
  title: OpenAPI Petstore
  license:
    name: MIT
servers:
  - url: http://petstore.openapi.io/v1
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
 |- index.js.hbs       // This is a static template, it contains placeholders that will be filled in, e.g. includes for each file in routes
 |+ routes/
  |- $$path$$.route.js.hbs      // This file will be generated for each operation and contains skeleton code for each method for an operation.
  |+ $$path$$/                  // This folder will also be generated for each operation.
    |- route.js.hbs             // This is another example of an operation file.
```
The first important thing to notice here is the variable notation in `$$path$$.route.js.hbs`. It will be replaced by the name of the path.

This example also shows `$$path$$` used in a folder name - the generated folder names here will replace $$path$$ with
the name of the path (in kebab-case).

In this example the generated directory structure will be like this:
```
|- index.js            // This file still contains static code like before.
|+ api/
 |- index.js           // This file will now e.g. have included the two files in routes.
 |+ routes/
  |- pet.route.js      // This file contains the code for methods on pets.
  |                    // (e.g. getPet, postPet, getPetByPetId).
  |- user.route.js     // This file will contain the code for methods on users.
  |                    // (e.g. postUserLogin, getUserByUsername, putUserByUsername, deleteUserByUsername).
  |+ pet/
   | - route.js        // this file also contains the code for methods on pets.
  |+ user/
   | - route.js        // this file also contains the code for methods on users.
```
#### Example 2 - Json CRUD server
Assuming we have the following OpenAPI Spec:
```yaml
openapi: 3.0.0
info:
  title: CRUD Service
  version: 1.0.0
  description: CRUD Service Example.
servers:
  - url: http://localhost:8080/crud-service/rest/v1
...
paths:
 ...
  /variants:    
    get:...
    post:...
  /variants/{variantId}:  
    parameters:
      - name: variantId ...
    get:...
    delete:...
    put:...
  /variants/{variantId}/phases:
    parameters:
      - name: variantId ...
    get:...
    post:...
  ...
components:
 ...
  schemas:
  ....
    Variant:
      description: The variant as it is used in the CRUD service.
      type: object
      properties:
        id:
          type: "integer"
          format: "int64"
          description: The variant's internal ID.
          example: 123456
        name:
          type: "string"
          description: The variant's name.
          example: "Variant"
        creationInfo:
          $ref: "#/components/schemas/CreationInfo"
        modificationInfo:
          $ref: "#/components/schemas/ModificationInfo"
        objectVersionInfo:
          $ref: "#/components/schemas/ObjectVersionInfo"
      required:
        - name 
    ....
```
And some template files like this:
```
|+ api/
 |- index.js.hbs       		    // This is a static template, it contains placeholders that will be filled in, e.g. includes for each file in routes.
 |+ constrains/
  |- $$schema$$.constrain.js.hbs    // This file will be generated for each schema and contains standard functions to check constrains, each could be change.
 |+ data/
  |- $$schema$$.data.json.hbs       // This json file will be generated for each schema and will be filled with the example values of the schemas.
 |+ helpers/
  |- errorResponse.js      	    // This file will be static and contains the errorModel.
  |- helper.js                      // This file will be static and contains the helper methods for the crud functionality to read, write and search in json files.
 |+ models/
  |- $$schema$$.model.js.hbs        // This file will be generated for each schema and includes the model for the schema and the mandatory field checks.
 |+ routes/
  |- $$path$$.route.js.hbs          // This file will be generated for each operation and contains skeleton code for each method for an operation.
 |+ services/
  |- $$path$$.service.js.hbs        // This file will be generated for each operation and contains the crud functionality code for each method for an operation.

```
The first important thing to notice here is the variable notation in `$$path$$.route.js.hbs`. It will be replaced by the name of the path.
The second important thing to notice here is the variable notation in `$$schema$$.model.js.hbs`. It will be replaced by the name of the schema.


In this example the generated directory structure will be like this:
```
|+ api/
 |- index.js     		    // This file will now e.g. have included the files in routes.
 |+ constrains/
  |- variants.constrain.js          // This file will be used to check additionaly constrains. It can be replaced by a static file with the same name.
	...
 |+ data/
  |- variants.data.json   	    // This json filecontains the example values for the Schama Variant and is used to store new variants and changes.
	...
|+ helpers/
  |- errorResponse.js      	    // This file contains the errorModel.
  |- helper.js      		    // This file contains the helper methods for the crud functionality to read, write and search in json files.
 |+ models/
  |- variants.model.js    	    // This file contains the model for the schema Variants and the mandatory field checks to create or update a variant.
	...
 |+ routes/
  |- variants.route.js              // This file contains the code for methods on variants.
	...
 |+ services/
  |- variants.service.js            // This file contains the code for methods on variants to read  write the data from variants.datajson.
	...
```

### Template file extensions
You can (optionally) name your template files with `.hbs` extensions, which will be removed when writing the generated
file. e.g. `index.js.hbs` writes `index.js`. `index.js` would also write to `index.js`, if you prefer to omit the hbs
extension.

The only case where the `.hbs` extension isn't optional would be if you are writing handlebars templates with the
templates. In that case the the template would need the extension `.hbs.hbs`. `usertpl.hbs.hbs` writes `usertpl.hbs`
(but `usertpl.hbs` as a source would write `usertpl` with no extension).

### Template file content
The generator passes the OpenAPI spec to template files, so all information should be available there.
In addition to that, the code generator adds a bit [more data](#data-passed-to-handlebars-templates) that can be helpful.

#### Examples:
##### Dynamically require files in JavaScript
```mustache
{{#each @root.openapi.endpoints}}
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
|openapi.endpoints| object | All first level endpoints (e.g  `pet` and `user`) |

### Custom handlebars helpers
If your template needs Handlebars helpers, you can define them in a directory called `.helpers` inside your template.

Check out some examples in the [markdown](./templates/markdown/.helpers) template.

### Using handlebars partials
If you want to use partials in your template, define them in a directory called `.partials` inside your template.

Check out some examples in the [markdown](./templates/markdown/.partials) template.

> The name of the partial will be obtained from the file name, converted to camel case. So, for instance, if the file name is `my-partial.js`, you can use the partial with `{{> myPartial}}`.

## Authors

* Fran Méndez ([@fmvilas](http://twitter.com/fmvilas))
* Richard Klose ([@richardklose](http://github.com/richardklose))
* Matthias Suessmeier ([@suessmma](https://github.com/suessmma))
