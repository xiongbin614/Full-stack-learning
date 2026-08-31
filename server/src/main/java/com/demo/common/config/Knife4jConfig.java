package com.demo.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Knife4j / OpenAPI 文档配置。
 * <p>
 * 启动后访问：http://localhost:8888/doc.html（账号密码见 application.yml knife4j.basic）
 */
@Configuration
public class Knife4jConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("后端 API 接口文档")
                        .version("1.0.0")
                        .description("项目接口在线文档")
                        .contact(new Contact().name("admin")));
    }
}
