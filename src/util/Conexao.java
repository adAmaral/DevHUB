package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Conexao {
    
    private static final Logger logger = Logger.getLogger(Conexao.class.getName());
    private static final String DEFAULT_URL = "jdbc:postgresql://localhost:5432/postgres";
    private static final String DEFAULT_USER = "devhub_app";
    private static final String DEFAULT_PASSWORD = "123";

    private static final String URL = valueFromEnv("DEVHUB_DB_URL", DEFAULT_URL);
    private static final String USUARIO = valueFromEnv("DEVHUB_DB_USER", DEFAULT_USER);
    private static final String SENHA = valueFromEnv("DEVHUB_DB_PASS", DEFAULT_PASSWORD);

    public static Connection conectar() throws Exception {
        try {
            System.err.println("[CONEXAO DEBUG] Tentando conectar ao banco...");
            System.err.println("[CONEXAO DEBUG] URL: " + URL);
            System.err.println("[CONEXAO DEBUG] Usuario: " + USUARIO);
            
            Class.forName("org.postgresql.Driver");
            System.err.println("[CONEXAO DEBUG] Driver PostgreSQL carregado");
            
            Connection conn = DriverManager.getConnection(URL, USUARIO, SENHA);
            System.err.println("[CONEXAO DEBUG] Conexão estabelecida com sucesso!");
            logger.log(Level.INFO, "[CONEXAO] Conexão estabelecida com {0}", URL);
            return conn;
        } catch (Exception e) {
            System.err.println("[CONEXAO DEBUG] ERRO ao conectar: " + e.getMessage());
            System.err.println("[CONEXAO DEBUG] Tipo do erro: " + e.getClass().getName());
            e.printStackTrace(System.err);
            logger.log(Level.SEVERE, "[CONEXAO] Erro ao conectar ao banco: {0}", e.getMessage());
            throw e;
        }
    }

    private static String valueFromEnv(String key, String fallback) {
       String value = System.getenv(key);
       return (value == null || value.isEmpty()) ? fallback : value;
    }
}