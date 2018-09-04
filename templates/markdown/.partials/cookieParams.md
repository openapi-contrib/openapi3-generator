#### Cookie parameters

{{#each cookieParams as |cookieParam|}}
{{#if cookieParam.name}}
##### &#9655; {{cookieParam.name}}
{{/if}}

{{#if cookieParam.description}}
{{{cookieParam.description}}}
{{/if}}

{{> parameter param=cookieParam paramName=cookieParam.name hideTitle=true}}

{{/each}}
