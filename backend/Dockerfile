# Stage 1: Build Java application with Maven
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code and build package
COPY src src
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Run Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
