<a id="{{operation.slug}}" />

{{#if operation.summary}}
> {{{operation.summary}}}

{{/if}}
{{#if operation.description}}
{{{operation.description}}}
{{/if}}

{{#if operation.curl}}
{{> curl curl=operation.curl}}
{{/if}}

{{#if operation.pathParams}}
{{> pathParams pathParams=operation.pathParams}}
{{/if}}

{{#if operation.headers}}
{{> headers headers=operation.headers}}
{{/if}}

{{#if operation.queryParams}}
{{> queryParams queryParams=operation.queryParams}}
{{/if}}

{{#if operation.cookieParams}}
{{> cookieParams cookieParams=operation.cookieParams}}
{{/if}}

{{#if operation.requestBody}}
#### Request body
{{#each operation.requestBody.content as |contentType contentTypeName| }}
###### {{contentTypeName}}
{{> schema schema=schema schemaName='body' hideTitle=true hideExamples=true}}

{{#if examples}}
{{#each examples as |example exampleName|}}
{{> example example=example.value description=example.description externalValue=example.externalValue}}
{{/each}}
{{else}}
{{#if example}}
{{> example example=example.value description=example.description externalValue=example.externalValue}}
{{else}}
{{> example example=schema.example generatedExample=schema.generatedExample }}
{{/if}}
{{/if}}

{{/each}}
{{/if}}

{{#each operation.parameters}}
{{#equal in 'body'}}
#### Request body
{{> schema schema=../schema schemaName='body' hideTitle=true hideExamples=true}}

{{#if ../examples}}
{{#each ../examples as |example exampleName|}}
{{> example example=example.value description=example.description}}
{{/each}}
{{else}}
{{#if example}}
{{> example example=example.value description=example.description }}
{{else}}
{{> example example=schema.example generatedExample=schema.generatedExample }}
{{/if}}
{{/if}}

{{/equal}}
{{/each}}

{{#if operation.responses}}
#### Responses

{{> responses responses=operation.responses hideTitle=true}}
{{/if}}

{{#if operation.tags}}
#### Tags

{{> tags tags=operation.tags}}
{{/if}}
</div>
