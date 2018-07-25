{{#unless hideTitle}}
#### Parameters
{{/unless}}

{{#each params as |param|}}
{{#equal param.in 'body'}}
{{else}}
{{#if param.name}}
##### {{param.name}}
{{/if}}

{{#if param.description}}
{{{param.description}}}
{{/if}}

{{> parameter param=param paramName=param.name hideTitle=true}}

{{/equal}}
{{/each}}
