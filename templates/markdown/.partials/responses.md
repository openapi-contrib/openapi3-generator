{{#unless hideTitle}}
#### Responses
{{/unless}}

{{#each responses as |response responseCode|}}
{{#if responseCode}}
##### ▶ {{responseCode}} {{#if response.description}}- {{{response.description}}}{{/if}}
{{/if}}

{{~> response response=response responseName=responseCode hideTitle=true ~}}
{{/each}}
