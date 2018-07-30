{{#unless openapi.__noSchemas}}
## Schemas

{{#each openapi.components.schemas}}
  {{~>schema schema=. schemaName=@key renderSlug=true~}}
{{/each}}
{{/unless}}
