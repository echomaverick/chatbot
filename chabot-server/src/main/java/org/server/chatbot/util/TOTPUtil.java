package org.server.chatbot.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class TOTPUtil {

	private static final String ALGORITHM = "HmacSHA1";
	private static final int TIME_STEP_SECONDS = 30;
	private static final int TOTP_LENGTH = 6;

	public static String generateSecretKey() {
		byte[] buffer = new byte[10];
		new java.security.SecureRandom().nextBytes(buffer);
		return Base64.getEncoder().encodeToString(buffer);
	}

	public static String getTOTPCode(String secretKey) {
		long counter = System.currentTimeMillis() / 1000 / TIME_STEP_SECONDS;
		return getHOTPCode(secretKey , counter);
	}

	private static String getHOTPCode(String secretKey , long counter) {
		byte[] keyBytes = Base64.getDecoder().decode(secretKey);
		byte[] data = new byte[8];
		for (int i = 7; i >= 0; i--) {
			data[i] = (byte) (counter & 0xff);
			counter >>= 8;
		}

		try {
			Mac mac = Mac.getInstance(ALGORITHM);
			mac.init(new SecretKeySpec(keyBytes , ALGORITHM));
			byte[] hash = mac.doFinal(data);

			int offset = hash[hash.length - 1] & 0xf;
			int binary = ((hash[offset] & 0x7f) << 24)
					| ((hash[offset + 1] & 0xff) << 16)
					| ((hash[offset + 2] & 0xff) << 8)
					| (hash[offset + 3] & 0xff);

			int otp = binary % (int) Math.pow(10 , TOTP_LENGTH);
			return String.format("%0" + TOTP_LENGTH + "d" , otp);
		} catch (NoSuchAlgorithmException | InvalidKeyException e) {
			throw new RuntimeException(e);
		}
	}

	public static boolean verifyTOTPCode(String secretKey , String code) {
		long currentCounter = System.currentTimeMillis() / 1000 / TIME_STEP_SECONDS;
		// Check the current, previous, and next time steps
		for (int i = -1; i <= 1; i++) {
			String generatedCode = getHOTPCode(secretKey , currentCounter + i);
			if (generatedCode.equals(code)) {
				return true;
			}
		}
		return false;
	}
}
