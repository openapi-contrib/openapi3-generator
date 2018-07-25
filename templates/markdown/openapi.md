# {{swagger.info.title}}

{{{swagger.info.description}}}

## Table of Contents

{{#if openapi.info.termsOfService}}
* [Terms of Service](#termsOfService)
{{/if}}
{{#if openapi.servers}}
* [Connection Details](#servers)
{{/if}}
{{#if openapi.paths}}
* [Paths](#paths)
{{/if}}
{{#if openapi.components.schemas}}
* [Schemas](#schemas)
{{/if}}

{{> info}}

{{> security}}

{{> paths }}

{{> schemas }}
