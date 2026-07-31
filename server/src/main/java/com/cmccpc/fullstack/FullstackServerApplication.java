package com.cmccpc.fullstack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * CMCCPC Web 启动类
 * <p>
 * 集成：Web / Data JPA / Security / Redis / Validation / AOP /
 * Actuator / OpenAPI(Swagger) / MySQL / H2 / Lombok
 */
@SpringBootApplication
public class FullstackServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(FullstackServerApplication.class, args);
    }

}
