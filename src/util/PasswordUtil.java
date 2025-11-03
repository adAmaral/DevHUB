package util;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;
import java.util.logging.Logger;
import java.util.logging.Level;

public class PasswordUtil {
    private static final Logger logger = Logger.getLogger(PasswordUtil.class.getName());
    private static final String ALGORITHM = "PBKDF2WithHmacSHA256";
    private static final int ITERATIONS = 65536;
    private static final int KEY_LENGTH = 256;
    private static final int SALT_BYTES = 16;

    public static String hashPassword(String plainPassword) {
        byte[] salt = generateSalt();
        byte[] hash = pbkdf2(plainPassword.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
        return String.format("%s:%d:%s:%s",
                "pbkdf2_sha256",
                ITERATIONS,
                Base64.getEncoder().encodeToString(salt),
                Base64.getEncoder().encodeToString(hash)
        );
    }

    public static boolean verifyPassword(String plainPassword, String stored) {
        if (stored == null || stored.isEmpty()) {
            logger.log(Level.WARNING, "[PASSWORD] Hash armazenado é null ou vazio");
            return false;
        }
        String[] parts = stored.split(":");
        if (parts.length != 4) {
            logger.log(Level.WARNING, "[PASSWORD] Hash não tem 4 partes (tem {0}): {1}", new Object[]{parts.length, stored.substring(0, Math.min(50, stored.length()))});
            return false;
        }
        String algo = parts[0];
        int iterations;
        try {
            iterations = Integer.parseInt(parts[1]);
        } catch (NumberFormatException e) {
            logger.log(Level.WARNING, "[PASSWORD] Erro ao parsear iterations: {0}", parts[1]);
            return false;
        }
        if (!"pbkdf2_sha256".equals(algo)) {
            logger.log(Level.WARNING, "[PASSWORD] Algoritmo incorreto: {0} (esperado: pbkdf2_sha256)", algo);
            return false;
        }
        try {
            byte[] salt = Base64.getDecoder().decode(parts[2]);
            byte[] expected = Base64.getDecoder().decode(parts[3]);

            byte[] test = pbkdf2(plainPassword.toCharArray(), salt, iterations, KEY_LENGTH);
            boolean result = slowEquals(expected, test);
            System.err.println("[PASSWORD DEBUG] Verificação PBKDF2: " + result + " (senha: " + (plainPassword != null ? "***" : "null") + ")");
            System.err.println("[PASSWORD DEBUG] Expected length: " + expected.length + ", Test length: " + test.length);
            logger.log(Level.INFO, "[PASSWORD] Verificação realizada: {0} (senha: {1})", new Object[]{result, plainPassword != null ? "***" : "null"});
            return result;
        } catch (IllegalArgumentException e) {
            logger.log(Level.WARNING, "[PASSWORD] Erro ao decodificar Base64: {0}", e.getMessage());
            return false;
        }
    }

    private static byte[] generateSalt() {
        byte[] salt = new byte[SALT_BYTES];
        new SecureRandom().nextBytes(salt);
        return salt;
    }

    private static byte[] pbkdf2(char[] password, byte[] salt, int iterations, int keyLength) {
        try {
            PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, keyLength);
            SecretKeyFactory skf = SecretKeyFactory.getInstance(ALGORITHM);
            return skf.generateSecret(spec).getEncoded();
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new IllegalStateException("Erro ao gerar hash de senha", e);
        }
    }

    private static boolean slowEquals(byte[] a, byte[] b) {
        if (a == null || b == null) return false;
        int diff = a.length ^ b.length;
        for (int i = 0; i < Math.min(a.length, b.length); i++) {
            diff |= a[i] ^ b[i];
        }
        return diff == 0;
    }
}


