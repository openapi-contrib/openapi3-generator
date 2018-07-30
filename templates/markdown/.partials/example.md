{{#if example}}
##### Example

{{#if summary}}> {{{summary}}}{{/if}}

{{#if description}}{{{description}}}{{/if}}

```json
{{{stringify example}}}
```
{{else}}
{{#if generatedExample}}
##### Example _(generated)_

```json
{{{stringify generatedExample}}}
```
{{/if}}
{{/if}}

{{#if externalValue}}
{{#unless example}}
##### Example
{{/unless}}
[Download example]({{externalValue}})
{{/if}}
