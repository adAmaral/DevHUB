import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

public class GeneratePasswordHash {
    private static final String ALGORITHM = "PBKDF2WithHmacSHA256";
    private static final int ITERATIONS = 65536;
    private static final int KEY_LENGTH = 256;
    private static final int SALT_BYTES = 16;

    public static void main(String[] args) {
        if (args.length != 1) {
            System.out.println("Uso: java GeneratePasswordHash \"senha\"");
            System.out.println("\nExemplo:");
            System.out.println("  java GeneratePasswordHash \"123\"");
            System.out.println("  java GeneratePasswordHash \"admin123\"");
            System.exit(1);
        }

        String password = args[0];
        String hash = hashPassword(password);
        
        System.out.println("\n======================================");
        System.out.println("Senha original: " + password);
        System.out.println("Hash PBKDF2 gerado:");
        System.out.println(hash);
        System.out.println("======================================\n");
        
        System.out.println("Para atualizar no banco de dados, execute:");
        System.out.println("UPDATE usuarios SET senha = '" + hash + "' WHERE email = 'admin@summit.com';");
        System.out.println();
    }

    private static String hashPassword(String plainPassword) {
        byte[] salt = generateSalt();
        byte[] hash = pbkdf2(plainPassword.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
        return String.format("%s:%d:%s:%s",
                "pbkdf2_sha256",
                ITERATIONS,
                Base64.getEncoder().encodeToString(salt),
                Base64.getEncoder().encodeToString(hash)
        );
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
}

