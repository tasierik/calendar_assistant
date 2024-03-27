FROM gradle:8.3-jdk17 as builder

WORKDIR /app

COPY build.gradle settings.gradle ./
COPY src src/

RUN gradle build --no-daemon --info

RUN ls /app/build/libs/

FROM openjdk:17

WORKDIR /app

COPY --from=builder /app/build/libs/ /app/

# Run the application
ENTRYPOINT ["java", "-jar", "backend-0.0.1-SNAPSHOT.jar"]