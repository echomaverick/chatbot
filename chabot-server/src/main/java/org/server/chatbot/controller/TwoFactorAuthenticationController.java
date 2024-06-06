package org.server.chatbot.controller;

import org.server.chatbot.service.TwoFactorAuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/two-factor-auth")
public class TwoFactorAuthenticationController {

	@Autowired
	private TwoFactorAuthenticationService twoFactorAuthenticationService;

	@PostMapping("/generate-secret/{username}")
	public ResponseEntity<String> generateSecretKey(@PathVariable String username) {
		String secretKey = twoFactorAuthenticationService.generateSecretKey(username);
		if (secretKey != null) {
			return ResponseEntity.ok(secretKey);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
		}
	}

	@PostMapping("/verify-code")
	public ResponseEntity<Boolean> verifyTOTPCode(@RequestParam String username , @RequestParam String totpCode) {
		boolean isValid = twoFactorAuthenticationService.verifyTOTPCode(username , totpCode);
		return ResponseEntity.ok(isValid);
	}
}
