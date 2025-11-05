package com.devhub.config;

import java.io.IOException;
import java.net.ServerSocket;

import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ServerPortConfig implements WebServerFactoryCustomizer<ConfigurableWebServerFactory> {
    
    private static final int DEFAULT_PORT = 8080;
    private static final int MAX_PORT_ATTEMPTS = 100;
    
    /**
     * Verifica se uma porta está disponível
     * Tenta criar um ServerSocket na porta especificada
     */
    private boolean isPortAvailable(int port) {
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            serverSocket.setReuseAddress(false);
            return true;
        } catch (IOException e) {
            // Porta está em uso ou não disponível
            return false;
        }
    }
    
    /**
     * Encontra a próxima porta disponível a partir de uma porta base
     */
    private int findAvailablePort(int basePort) {
        for (int i = 1; i <= MAX_PORT_ATTEMPTS; i++) {
            int port = basePort + i;
            if (isPortAvailable(port)) {
                return port;
            }
        }
        // Se não encontrar nenhuma porta disponível, retorna a porta base
        // O Spring Boot vai lançar o erro normalmente
        return basePort;
    }
    
    @Override
    public void customize(ConfigurableWebServerFactory factory) {
        // Verifica se a porta 8080 está disponível
        if (!isPortAvailable(DEFAULT_PORT)) {
            // Tenta encontrar uma porta alternativa
            int alternativePort = findAvailablePort(DEFAULT_PORT);
            
            if (alternativePort != DEFAULT_PORT) {
                factory.setPort(alternativePort);
                System.out.println("⚠️  Porta 8080 está em uso. Usando porta alternativa: " + alternativePort);
                System.out.println("🌐 Acesse: http://localhost:" + alternativePort + "/pages/Login.html");
            } else {
                // Se não encontrar porta alternativa nas próximas 100 portas, tenta a porta 8080 mesmo
                // O Spring Boot vai lançar o erro se não conseguir
                factory.setPort(DEFAULT_PORT);
                System.out.println("⚠️  Não foi possível encontrar uma porta alternativa disponível.");
                System.out.println("⚠️  Tentando usar porta 8080. Se falhar, verifique processos em execução.");
            }
        } else {
            factory.setPort(DEFAULT_PORT);
            System.out.println("✓ Porta 8080 disponível. Iniciando na porta padrão.");
        }
    }
}

