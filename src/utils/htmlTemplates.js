 import httpStaus from 'http-status';

 export const htmlTemplate = body =>
  `<!doctype html>\n<html lang='nb' >
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <link href='/swagger/css/api-documentation.css' media='screen' rel='stylesheet' type='text/css'/>
    </head>
    <body>
      <div id='ndla_header'>
        <a href="/" class='home'>APIs from NDLA</a>
        <div id='slogan'>
          <a href="http://www.ndla.no">
            <img src="/swagger/pictures/ndla.png"/>
          </a>
          <p>Open Educational Resources For Secondary Schools</p>
        </div>
      </div>
      <div id='blue_bar'>
      </div>
      <div id='beta_block'>*** BETA ***</div>
      <div id='content'>
        <ul>${body}</ul>
      </div>
    </body>
  </html>`;

 export const apiListTemplate = (json) => {
   const listItems = json.data.map(obj =>
     `<li><a href="/swagger?url=${obj.request_path}/api-docs">${obj.name}</a></li>`
   );

   return htmlTemplate(listItems.join(''));
 };

 export const htmlErrorTemplate = ({ status, message, description, stacktrace }) => {
   const statusMsg = httpStaus[status];
   return htmlTemplate('nb', `
    <h1>${status} ${statusMsg}</h1>
    <div><b>Message: </b>${message}</div>
    <div><b>Description: </b>${description}</div>
    <div>${stacktrace}</div>
  `);
 };
