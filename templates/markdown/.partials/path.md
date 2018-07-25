{{#each path}}
{{#validMethod @key}}

### `{{uppercase @key}}` {{../../pathName}}
{{> operation operation=.. operationName=(uppercase @key)}}
{{/validMethod}}
{{/each}}
