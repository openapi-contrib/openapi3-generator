{{#if openapi.servers}}
<a id="servers" />
## Servers

<table>
  <thead>
    <tr>
      <th>URL</th>
      <th>Description</th>
    <tr>
  </thead>
  <tbody>
{{#each openapi.servers as |server|}}
    <tr>
      <td><a href="{{server.url}}" target="_blank">{{server.url}}</a></td>
      <td>{{{server.descriptionAsHTML}}}</td>
    </tr>
{{/each}}
  </tbody>
</table>
{{/if}}
