{{#unless hideTitle}}
#### {{responseName}}
{{/unless}}

###### Headers
{{#each response.headers as |header headerName|}}
##### {{headerName}}
{{> schema schema=header.schema schemaName=headerName hideTitle=true hideExamples=true}}

{{#if header.schema.example}}
{{#equal contentType 'application/json'}}
```json
{{{stringify header.schema.example}}}
```
{{else}}
{{#equal contentType 'application/xml'}}
```xml
{{{header.schema.example}}}
```
{{else}}
```
{{{header.schema.example}}}
```
{{/equal}}
{{/equal}}
{{else}}
{{#if header.generatedExample}}
```json
{{{stringify header.generatedExample}}}
```
{{/if}}
{{/if}}

{{else}}
_No headers specified_
{{/each}}

{{#if response.content}}
{{#each response.content as |content contentType|}}
###### {{contentType}}
{{#if content.description}}
{{{content.description}}}
{{/if}}
{{> schema schema=content.schema schemaName='Response' hideTitle=true hideExamples=true}}

{{#if content.schema.example}}
##### Example
{{#equal contentType 'application/json'}}
```json
{{{stringify content.schema.example}}}
```
{{else}}
{{#equal contentType 'application/xml'}}
```xml
{{{content.schema.example}}}
```
{{else}}
```
{{{content.schema.example}}}
```
{{/equal}}
{{/equal}}
{{else}}
{{#if content.schema.generatedExample}}
##### Example _(generated)_

```json
{{{stringify content.schema.generatedExample}}}
```
{{/if}}
{{/if}}
{{/each}}
{{/if}}
