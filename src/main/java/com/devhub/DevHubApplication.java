package com.devhub;

import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class DevHubApplication {
    
    private static int actualPort = 8080;
    
    public static void main(String[] args) {
        SpringApplication.run(DevHubApplication.class, args);
    }
    
    @EventListener(WebServerInitializedEvent.class)
    public void onWebServerInitialized(WebServerInitializedEvent event) {
        actualPort = event.getWebServer().getPort();
        
        if (actualPort != 8080) {
            System.out.println("⚠️  Porta 8080 estava em uso. Aplicação iniciada na porta: " + actualPort);
        } else {
            System.out.println("✓ Aplicação iniciada na porta: " + actualPort);
        }
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void openBrowser() {
        String url = "http://localhost:" + actualPort + "/pages/Login.html";
        
        try {
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(url));
                System.out.println("✓ Navegador aberto automaticamente em: " + url);
                return;
            }
        } catch (IOException | URISyntaxException e) {
        }
        
        try {
            String os = System.getProperty("os.name").toLowerCase();
            
            if (os.contains("win")) {
                new ProcessBuilder("rundll32", "url.dll,FileProtocolHandler", url).start();
                System.out.println("✓ Navegador aberto automaticamente em: " + url);
            } else if (os.contains("mac")) {
                new ProcessBuilder("open", url).start();
            } else if (os.contains("nix") || os.contains("nux")) {
                new ProcessBuilder("xdg-open", url).start();
            }
        } catch (IOException e) {
            System.err.println("Não foi possível abrir o navegador automaticamente.");
            System.out.println("Por favor, acesse manualmente: " + url);
        }
    }
}

