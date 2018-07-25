{{#if operation.summary}}
> {{{operation.summary}}}

{{/if}}
{{#if operation.description}}
{{{operation.description}}}
{{/if}}

{{#if operation.requestBody}}
#### Request body
{{#each operation.requestBody.content as |contentType contentTypeName| }}
###### {{contentTypeName}}
{{> schema schema=schema schemaName='body' hideTitle=true hideExamples=true}}

{{#if schema.example}}
##### Example

```json
{{{stringify schema.example}}}
```
{{else}}
{{#if schema.generatedExample}}
##### Example of payload _(generated)_
```json
{{{stringify schema.generatedExample}}}
```
{{/if}}
{{/if}}
{{/each}}
{{/if}}

{{#each operation.parameters}}
{{#equal in 'body'}}
#### Request body
{{> schema schema=../schema schemaName='body' hideTitle=true hideExamples=true}}

{{#if ../example}}
##### Example

```json
{{{stringify ../example}}}
```
{{else}}
{{#if ../generatedExample}}
##### Example of payload _(generated)_
```json
{{{stringify ../generatedExample}}}
```
{{/if}}
{{/if}}
{{/equal}}
{{/each}}

{{#if operation.parameters}}
#### Parameters

{{> parameters params=operation.parameters hideTitle=true}}
{{/if}}

{{#if operation.responses}}
#### Responses

{{> responses responses=operation.responses hideTitle=true}}
{{/if}}

{{#if operation.tags}}
#### Tags

{{> tags tags=operation.tags}}
{{/if}}
</div>
