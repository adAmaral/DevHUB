package util;

import org.junit.Assert;
import org.junit.Test;

public class PasswordUtilTest {

    @Test
    public void testHashAndVerify() {
        String plain = "test-Password_123";
        String hash = PasswordUtil.hashPassword(plain);
        Assert.assertNotNull(hash);
        Assert.assertTrue("Hash deve verificar a mesma senha", PasswordUtil.verifyPassword(plain, hash));
        Assert.assertFalse("Hash não deve verificar senha errada", PasswordUtil.verifyPassword("wrong", hash));
    }
}


