FROM nginx

# Delete examplefiles
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf
COPY src/main/www/ /data/www/
COPY bower_components/swagger-ui/dist/ /data/www/swagger-ui
