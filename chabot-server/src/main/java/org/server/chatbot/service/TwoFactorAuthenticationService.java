package org.server.chatbot.service;

import com.bastiaanjansen.otp.SecretGenerator;
import com.bastiaanjansen.otp.TOTP;
import org.server.chatbot.models.User;
import org.server.chatbot.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Base64;


@Service
public class TwoFactorAuthenticationService {

	private static final Logger logger = LoggerFactory.getLogger(TwoFactorAuthenticationService.class);
	private static final Duration TIME_STEP = Duration.ofSeconds(30);
	private static final int TOTP_LENGTH = 6;

	@Autowired
	private UserRepository userRepository;

	public String generateSecretKey(String username) {
		logger.info("Generating secret key for user: {}" , username);
		User user = userRepository.findByUsername(username);
		if (user != null) {
			byte[] secretBytes = SecretGenerator.generate();
			String secretKey = Base64.getEncoder().encodeToString(secretBytes);
			logger.info("Generated secret key: {}" , secretKey);

			user.setTotpSecret(secretKey);
			userRepository.save(user);
			logger.info("Secret key saved for user: {}" , username);

			return secretKey;
		} else {
			logger.error("User not found with username: {}" , username);
			return null;
		}
	}

	public boolean verifyTOTPCode(String username , String totpCode) {
		logger.info("Verifying TOTP code for user: {}" , username);
		User user = userRepository.findByUsername(username);
		if (user != null && user.getTotpSecret() != null) {
			try {
				String secretKey = user.getTotpSecret();
				byte[] secretBytes = Base64.getDecoder().decode(secretKey);

				TOTP totp = new TOTP.Builder(secretBytes)
						.withPeriod(TIME_STEP)
						.withPasswordLength(TOTP_LENGTH)
						.build();

				boolean verificationResult = totp.verify(totpCode , 1);
				logger.info("TOTP code verification result for user {}: {}" , username , verificationResult);
				return verificationResult;
			} catch (Exception e) {
				logger.error("Error verifying TOTP code for user: {}" , username , e);
				return false;
			}
		} else {
			logger.error("User not found or secret key not set for user: {}" , username);
			return false;
		}
	}
}