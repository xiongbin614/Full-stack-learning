package com.demo.common.config;

import com.github.xiaoymin.knife4j.spring.configuration.Knife4jProperties;
import com.github.xiaoymin.knife4j.spring.extension.Knife4jOpenApiCustomizer;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.properties.SpringDocConfigProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Knife4j / OpenAPI 基础信息。
 */
@Configuration
public class Knife4jConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("springboot-template API")
                        .description("学习用 Spring Boot 空架子接口文档")
                        .version("0.0.1")
                        .contact(new Contact().name("demo")));
    }

    /**
     * 覆盖 Knife4j 自带 Customizer，避免与 springdoc 2.8 的 getGroupConfigs 签名冲突。
     * Knife4j 自动配置带 @ConditionalOnMissingBean，本 Bean 优先生效。
     */
    @Bean
    public Knife4jOpenApiCustomizer knife4jOpenApiCustomizer(Knife4jProperties knife4jProperties,
                                                             SpringDocConfigProperties docProperties) {
        return new CompatibleKnife4jOpenApiCustomizer(knife4jProperties, docProperties);
    }
}
