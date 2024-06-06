//package org.server.chatbot.controller;
//
//import org.server.chatbot.service.RedisCacheService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Set;
//
//@RestController
//@RequestMapping("/api")
//public class RedisCacheController {
//
//	@Autowired
//	private RedisCacheService redisCacheService;
//
//	public RedisCacheController(RedisCacheService redisService) {
//		this.redisCacheService = redisService;
//	}
//
//	@GetMapping("/redis-cache/keys")
//	public Set<String> getAllKeys() {
//		return redisCacheService.getAllKeys();
//	}
//
//	@GetMapping("/redis-cache/value/{key}")
//	public Object getValueByKey(@PathVariable String key) {
//		return redisCacheService.getValueByKey(key);
//	}
//}
