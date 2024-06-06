package org.server.chatbot.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenUtil {

	private static final Logger logger = LoggerFactory.getLogger(JwtTokenUtil.class);

	private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);

	@Value("${jwt.expiration}")
	private Long expiration;

	public String generateToken(String username) {
		logger.info("Generating token for username: {}" , username);
		Date now = new Date();
		Date expirationDate = new Date(now.getTime() + expiration);

		String token = Jwts.builder()
				.setSubject(username)
				.setIssuedAt(now)
				.setExpiration(expirationDate)
				.signWith(secretKey)
				.compact();
		logger.info("Token generated successfully.");
		return token;
	}

	public String getUsernameFromToken(String token) {
		logger.info("Extracting username from token: {}" , token);
		Claims claims = Jwts.parser()
				.setSigningKey(secretKey)
				.build()
				.parseClaimsJws(token)
				.getBody();
		String username = claims.getSubject();
		logger.info("Username extracted: {}" , username);
		return username;
	}
}
