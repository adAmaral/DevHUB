package com.devhub;

import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class DevHubApplication {
    public static void main(String[] args) {
        SpringApplication.run(DevHubApplication.class, args);
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void openBrowser() {
        String url = "http://localhost:8080/pages/Login.html";
        
        // Tentar abrir com Desktop primeiro
        try {
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(url));
                System.out.println("✓ Navegador aberto automaticamente!");
                return;
            }
        } catch (IOException | URISyntaxException e) {
            // Se falhar, tentar método alternativo
        }
        
        // Método alternativo para Windows
        try {
            String os = System.getProperty("os.name").toLowerCase();
            
            if (os.contains("win")) {
                // Windows
                new ProcessBuilder("rundll32", "url.dll,FileProtocolHandler", url).start();
                System.out.println("✓ Navegador aberto automaticamente!");
            } else if (os.contains("mac")) {
                // macOS
                new ProcessBuilder("open", url).start();
            } else if (os.contains("nix") || os.contains("nux")) {
                // Linux
                new ProcessBuilder("xdg-open", url).start();
            }
        } catch (IOException e) {
            System.err.println("Não foi possível abrir o navegador automaticamente.");
            System.out.println("Por favor, acesse manualmente: " + url);
        }
    }
}

