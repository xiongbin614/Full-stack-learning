package com.cmccpc.fullstack;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * 应用上下文加载测试
 * <p>
 * 验证 Spring 容器能够正常装配所有 Bean（数据源、Redis、Security、JPA 等）。
 */
@SpringBootTest
class FullstackServerApplicationTests {

    @Test
    void contextLoads() {
    }

}
