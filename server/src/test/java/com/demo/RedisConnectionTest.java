package com.demo;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;

/**
 * 在测试环境验证 Redis 是否连通（会加载 application.yml + .env）。
 */
@SpringBootTest
class RedisConnectionTest {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Test
    void shouldConnectToRedis() {
        Assertions.assertNotNull(stringRedisTemplate, "StringRedisTemplate 未注入，请检查 Redis 依赖与配置");

        String key = "demo:ping";
        String value = "pong-" + System.currentTimeMillis();

        stringRedisTemplate.opsForValue().set(key, value);
        String actual = stringRedisTemplate.opsForValue().get(key);
        stringRedisTemplate.delete(key);

        Assertions.assertEquals(value, actual, "读写 Redis 失败");
        System.out.printf("Redis connected | key=%s | value=%s%n", key, actual);
    }
}
