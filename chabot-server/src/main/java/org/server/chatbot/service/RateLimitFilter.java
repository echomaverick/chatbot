package org.server.chatbot.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

	private static final Logger logger = LoggerFactory.getLogger(RateLimitFilter.class);

	private final Cache<String, Bucket> cache = Caffeine.newBuilder()
			.expireAfterWrite(1 , TimeUnit.MINUTES)
			.build();

	@Override
	protected void doFilterInternal(HttpServletRequest request , HttpServletResponse response , FilterChain filterChain)
			throws ServletException, IOException {

		String clientIp = request.getRemoteAddr();
		logger.info("Incoming request from IP: {}" , clientIp);

		Bucket bucket = cache.get(clientIp , this::createNewBucket);

		if (bucket.tryConsume(1)) {
			logger.info("Request from IP {} within rate limit{}" , clientIp);
			filterChain.doFilter(request , response);
		} else {
			logger.warn("Request from IP {} exceeded rate limit{}" , clientIp);
			response.setStatus(429);
			response.getWriter().write("Too many requests");
		}
	}

	private Bucket createNewBucket(String key) {
		Refill refill = Refill.intervally(2 , Duration.ofMinutes(1));
		Bandwidth limit = Bandwidth.classic(2 , refill);
		return Bucket4j.builder()
				.addLimit(limit)
				.build();
	}
}

