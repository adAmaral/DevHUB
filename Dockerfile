# Use a imagem oficial do OpenJDK 17
FROM eclipse-temurin:17-jdk-alpine

# Instalar Maven
RUN apk add --no-cache maven

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos do projeto
COPY pom.xml .
COPY src ./src
COPY webapp ./webapp

# Build do projeto
RUN mvn clean package -DskipTests

# Instalar Tomcat 9
RUN apk add --no-cache tomcat9

# Copiar WAR para Tomcat webapps
RUN cp target/devhub-1.0.0.war /usr/share/tomcat9/webapps/ROOT.war

# Expor porta (Railway define PORT automaticamente)
EXPOSE ${PORT:-8080}

# Configurar variáveis de ambiente do Tomcat
ENV CATALINA_HOME=/usr/share/tomcat9
ENV CATALINA_BASE=/usr/share/tomcat9
ENV CATALINA_OPTS="-Dserver.port=${PORT:-8080} -Djava.awt.headless=true"

# Iniciar Tomcat
CMD ["/usr/share/tomcat9/bin/catalina.sh", "run"]
