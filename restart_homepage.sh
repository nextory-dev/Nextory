npm run build
docker stop homepage
docker rm homepage
docker rmi homepage
docker build --platform linux/arm64 -t homepage .
docker run -d -p 8000:80 --name homepage homepage