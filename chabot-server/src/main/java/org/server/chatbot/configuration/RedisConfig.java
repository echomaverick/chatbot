//package org.server.chatbot.configuration;
//
//import org.springframework.cache.CacheManager;
//import org.springframework.cache.annotation.EnableCaching;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.redis.cache.RedisCacheConfiguration;
//import org.springframework.data.redis.cache.RedisCacheManager;
//import org.springframework.data.redis.connection.RedisConnectionFactory;
//import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
//import org.springframework.data.redis.serializer.StringRedisSerializer;
//
//import java.time.Duration;
//
//@Configuration
//@EnableCaching
//public class RedisConfig {
//
//	@Bean
//	public RedisConnectionFactory redisConnectionFactory() {
//		return new LettuceConnectionFactory();
//	}
//
//	@Bean
//	public RedisTemplate<String, Object> redisTemplate() {
//		RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
//		redisTemplate.setConnectionFactory(redisConnectionFactory());
//		redisTemplate.setKeySerializer(new StringRedisSerializer());
//		redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
//		return redisTemplate;
//	}
//
//	@Bean
//	public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
//		RedisCacheConfiguration redisCacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
//				.entryTtl(Duration.ofHours(1))
//				.disableCachingNullValues();
//
//		return RedisCacheManager.builder(redisConnectionFactory)
//				.cacheDefaults(redisCacheConfiguration)
//				.transactionAware()
//				.build();
//	}
//}
