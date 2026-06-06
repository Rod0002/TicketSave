# Estágio 1: Build (Compilação do código Java)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
# Copia as dependências e o código fonte
COPY pom.xml .
COPY src ./src
# Compila o projeto ignorando os testes para ser mais rápido
RUN mvn clean package -DskipTests

# Estágio 2: Execução (Imagem leve apenas para rodar)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Pega o .jar gerado no passo anterior
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# Roda a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]