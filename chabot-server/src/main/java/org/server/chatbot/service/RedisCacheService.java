//package org.server.chatbot.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.stereotype.Service;
//
//import java.util.Set;
//
//@Service
//public class RedisCacheService {
//
//	@Autowired
//	private RedisTemplate<String, Object> redisTemplate;
//
//	 public RedisCacheService(RedisTemplate<String, Object> redisTemplate) {
//        this.redisTemplate = redisTemplate;
//    }
//
//    public Set<String> getAllKeys() {
//        return redisTemplate.keys("*");
//    }
//
//    public Object getValueByKey(String key) {
//        return redisTemplate.opsForValue().get(key);
//    }
//}
