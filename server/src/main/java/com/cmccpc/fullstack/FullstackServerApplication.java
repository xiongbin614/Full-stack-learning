package com.cmccpc.fullstack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * CMCCPC Web 启动类
 * <p>
 * Spring Boot 全家桶基础项目，集成：Web / Data JPA / Security / Redis /
 * Validation / Mail / AOP / Actuator / OpenAPI(Swagger) / MySQL / H2 / Lombok
 *
 * @author cmccpc
 */
@SpringBootApplication
public class FullstackServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(FullstackServerApplication.class, args);
    }

}
