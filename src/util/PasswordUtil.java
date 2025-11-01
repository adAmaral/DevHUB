package util;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;

public class PasswordUtil {
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
        if (stored == null || stored.isEmpty()) return false;
        String[] parts = stored.split(":");
        if (parts.length != 4) return false;
        String algo = parts[0];
        int iterations;
        try {
            iterations = Integer.parseInt(parts[1]);
        } catch (NumberFormatException e) {
            return false;
        }
        if (!"pbkdf2_sha256".equals(algo)) return false;
        byte[] salt = Base64.getDecoder().decode(parts[2]);
        byte[] expected = Base64.getDecoder().decode(parts[3]);

        byte[] test = pbkdf2(plainPassword.toCharArray(), salt, iterations, KEY_LENGTH);
        return slowEquals(expected, test);
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


