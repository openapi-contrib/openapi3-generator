<tr>
  <td>{{tree path}}{{propName}} {{#if prop.required}} <strong>(required)</strong>{{/if}}</td>
  <td>
    {{#if prop.schema}}
    {{prop.schema.type}}
    {{~#if prop.schema.anyOf}}anyOf{{~/if}}
    {{~#if prop.schema.oneOf}}oneOf{{~/if}}
    {{~#if prop.schema.items.type}}({{prop.schema.items.type}}){{~/if}}
    {{else}}
    unknown
    {{/if}}
  </td>
  <td>{{prop.in}}</td>
  <td>{{{prop.descriptionAsHTML}}}</td>
  <td>{{{acceptedValues prop.schema.enum}}}</td>
</tr>
{{#each prop.anyOf}}
{{> paramProp prop=. propName=@key path=(buildPath ../propName ../path @key)}}
{{/each}}
{{#each prop.oneOf}}
  {{> paramProp prop=. propName=@key path=(buildPath ../propName ../path @key)}}
{{/each}}
{{#each prop.properties}}
{{> paramProp prop=. propName=@key required=(isRequired ../prop @key) path=(buildPath ../propName ../path @key)}}
{{/each}}
{{#each prop.additionalProperties.properties}}
{{> paramProp prop=. propName=@key required=(isRequired ../prop.additionalProperties @key) path=(buildPath ../propName ../path @key)}}
{{/each}}
{{#each prop.items.properties}}
{{> paramProp prop=. propName=@key required=(isRequired ../prop.items @key) path=(buildPath ../propName ../path @key)}}
{{/each}}
