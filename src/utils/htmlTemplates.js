import httpStaus from 'http-status';
import config from '../config';

/* eslint arrow-body-style: 0 */
/* eslint arrow-parens: 0 */

const bodyInfo = (isAdvanced) => `
   <div id='ndla_header'>
     <a href="${isAdvanced ? '/advanced' : '/'}" class='home'>APIs from NDLA</a>
     <div id='slogan'>
       <a href="https://ndla.no">
         <img src="/static/pictures/ndla-logo.svg"/>
       </a>
       <p>Open Educational Resources For Secondary Schools</p>
     </div>
   </div>
   <div id='beta_bar'>
     <div id='beta'>*** BETA ***</div>
   </div>
   <div id='ingress_block'>
     <p>
       NDLA provides a rich set of endpoints to extract articles and specific components of our content. \\
       All content is made available based on content licenses and the specific licence is included in metadata and can be used to filter the result.
     </p>
     <p>
       In addition, we provide a search-api for all our content based on Elasticsearch simple search language.
     </p>
     <p>
       This is a beta level service, with no liability for the quality of the content and what the content is used for.
     </p>
   </div>
 `;

export const htmlTemplate = (isAdvanced, body) =>
  `<!doctype html>\n<html lang='nb' >
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <link href='/static/css/api-documentation.css' media='screen' rel='stylesheet' type='text/css'/>
    </head>
    <body>
      ${bodyInfo(isAdvanced)}
      <div id='content'>
        <ul>${body}</ul>
      </div>
    </body>
  </html>`;

export const apiDocsUri = (apiObj) => {
  for (const uri of apiObj.paths) {
    if (config.apiDocPath.test(uri)) {
      return uri;
    }
  }
  return undefined;
};

export const apiListTemplate = (path, routes) => {
  let filtered = routes.sort((a, b) => a.name.localeCompare(b.name));
  if (path === '/') {
    filtered = routes.filter((route) => config.whitelist.includes(route.name));
  }

  const listItems = filtered.map(
    (route) =>
      `<li><a href="${path}swagger?url=${apiDocsUri(route)}">${route.name}</a></li>`,
  );
  const isAdvanced = path !== '/';
  return htmlTemplate(isAdvanced, listItems.join(''));
};

export const htmlErrorTemplate = ({
  status,
  message,
  description,
  stacktrace,
}) => {
  const statusMsg = httpStaus[status];
  return htmlTemplate(
    '/',
    `
    <h1>${status} ${statusMsg}</h1>
    <div><b>Message: </b>${message}</div>
    <div><b>Description: </b>${description}</div>
    <div>${stacktrace}</div>
  `,
  );
};

const documentHead = (isAdvanced) => `
   <head>
     <title>Swagger UI</title>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Source+Code+Pro:300,600|Titillium+Web:400,600,700"
           rel="stylesheet">
     <link rel="stylesheet" type="text/css" href="/swagger-ui-dist/swagger-ui.css">
     <link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32"/>
     <link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16"/>
     <link href='/static/css/api-documentation.css' media='screen' rel='stylesheet' type='text/css'/>

     ${
       !isAdvanced
         ? `
       <style>
         /* Hide all non-get operations in public layout */
         .opblock-post {display: none;}
         .opblock-put {display: none;}
         .opblock-patch {display: none;}
         .opblock-delete {display: none;}
       </style>`
         : ''
     }
   </head>
 `;

const bodyLogic = (personalClientId) => `
   <script src="/swagger-ui-dist/swagger-ui-bundle.js"></script>
   <script>
     window.onload = function () {
       const url = window.location.search.match(/url=([^&]+)/);
       const auth0NdlaPersonalClient = '${personalClientId}';
       const locationOrigin = [
         window.location.protocol,
         '//',
         window.location.host,
       ].join('');

       if (url && url.length > 1) {
         const ui = SwaggerUIBundle({
           url: decodeURIComponent(url[1]),
           dom_id: "#swagger-ui-container",
           supportedSubmitMethods: ['get', 'post', 'put', 'patch', 'delete'],
           defaultModelsExpandDepth: 0,
           oauth2RedirectUrl: locationOrigin.concat("/static/oauth2-redirect.html"),
         });

         window.swaggerUi = ui;
         ui.initOAuth({
           clientId: auth0NdlaPersonalClient,
           realm: "ndla-realm",
           appName: "ndla-swagger",
           scopeSeparator: " ",
           additionalQueryStringParams: {
             audience: "ndla_system"
           }
         })
       }
     }
   </script>
`;

const documentBody = (personalClientId, isAdvanced) => `
 <body>
   ${bodyInfo(isAdvanced)}
   <div id="swagger-ui-container"></div>
   ${bodyLogic(personalClientId)}
 </body>
 `;

export const index = (personalClientId, isAdvanced) => `
   <!DOCTYPE html>
   <html>
     ${documentHead(isAdvanced)}
     ${documentBody(personalClientId, isAdvanced)}
   </html>
 `;
