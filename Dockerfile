FROM nginx

# Delete examplefiles
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf
COPY src/main/www/ /data/www/
