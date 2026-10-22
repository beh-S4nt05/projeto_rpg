# This is a multi-stage Dockerfile for the entire project
# Use specific Dockerfiles for backend and frontend

# For backend only:
# docker build -f backend/Dockerfile -t rpg-backend .

# For frontend only:
# docker build -f frontend/Dockerfile -t rpg-frontend .

# For development, use docker-compose
FROM alpine:latest

# This is just a placeholder - use docker-compose for development
CMD ["echo", "Use docker-compose for development"]
