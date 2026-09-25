# ==============================================================================
# Multi-stage Dockerfile for JobFins Spring Boot Backend
# Optimized for Render Cloud Platform (Free Tier 512MB RAM & Standard Instances)
# ==============================================================================

# Stage 1: Build Application with Maven
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copy pom.xml and resolve dependencies first (layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package executable fat JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal Production Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root system user for security
RUN addgroup -S jobfins && adduser -S jobfins -G jobfins
USER jobfins:jobfins

# Copy compiled JAR from builder stage
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Render dynamic port environment variable
ENV PORT=8080
ENV JAVA_OPTS="-Xmx400m -Xms180m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError"

EXPOSE 8080

# Execute Spring Boot application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --server.port=${PORT}"]
