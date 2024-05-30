package org.server.chatbot.configuration;

import org.server.chatbot.service.RateLimitFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
public class FilterConfig {

	private static final Logger logger = LoggerFactory.getLogger(FilterConfig.class);

	@Autowired
	private RateLimitFilter rateLimitFilter;

	@Bean
	public FilterRegistrationBean<OncePerRequestFilter> customRateLimitFilter() {
		FilterRegistrationBean<OncePerRequestFilter> filterRegistrationBean = new FilterRegistrationBean<>();
		filterRegistrationBean.setFilter(rateLimitFilter);
		filterRegistrationBean.addUrlPatterns("/api/**");
		logger.info("Rate limit filter registered for URLs matching /api/**");
		return filterRegistrationBean;
	}
}
