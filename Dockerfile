# Base image: nginx
FROM nginx:alpine

RUN apk add --no-cache \
        wget \
        curl \
        tar \
        build-base \
        gcc \
        libc-dev \
        libgcc \
        openssl-dev \
        pcre-dev \
        zlib-dev \
        make

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html
COPY robots.txt /usr/share/nginx/html/robots.txt
COPY certs /etc/nginx/certs

EXPOSE 80

# Start OpenResty with the custom configuration
# CMD ["openresty", "-g", "daemon off;"]
#CMD ["openresty", "-p", "/usr/app/nextory/botfender-firewall", "-g", "daemon off;"]
