/*
 * Part of NDLA api-documentation.
 * Copyright (C) 2016 NDLA
 *
 * See LICENSE
 */

 import httpStaus from 'http-status';

 export const htmlTemplate = (lang, body) =>
  `<!doctype html>\n<html lang=${lang} >
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

 export const apiList = (lang, json) => {
   let listItems = json.data.map(function(obj){
     return `<li><a href="/swagger?url=${obj.upstream_url}/api-docs${obj.request_path}">${obj.name}</a></li>`;
   });

   return htmlTemplate(lang, listItems.join(''));
 };

 export const htmlErrorTemplate = (lang, { status, message, description, stacktrace }) => {
   const statusMsg = httpStaus[status];
   return htmlTemplate(lang, `
    <h1>${status} ${statusMsg}</h1>
    <div><b>Message: </b>${message}</div>
    <div><b>Description: </b>${description}</div>
    <div>${stacktrace}</div>
  `);
 };
