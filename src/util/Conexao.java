package util;

import java.sql.Connection;
import java.sql.DriverManager;

public class Conexao {

    private static final String DEFAULT_URL = "jdbc:postgresql://localhost:5432/postgres";
    private static final String DEFAULT_USER = "devhub_app";
    private static final String DEFAULT_PASSWORD = "12345";

    private static final String URL = valueFromEnv("DEVHUB_DB_URL", DEFAULT_URL);
    private static final String USUARIO = valueFromEnv("DEVHUB_DB_USER", DEFAULT_USER);
    private static final String SENHA = valueFromEnv("DEVHUB_DB_PASS", DEFAULT_PASSWORD);

    public static Connection conectar() throws Exception {
        Class.forName("org.postgresql.Driver");
        return DriverManager.getConnection(URL, USUARIO, SENHA);
    }

    private static String valueFromEnv(String key, String fallback) {
       String value = System.getenv(key);
       return (value == null || value.isEmpty()) ? fallback : value;
    }
}