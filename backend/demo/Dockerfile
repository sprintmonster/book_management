FROM eclipse-temurin:17-jre

WORKDIR /app

# Gradle: build/libs/*.jar
# Maven:  target/*.jar
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]

