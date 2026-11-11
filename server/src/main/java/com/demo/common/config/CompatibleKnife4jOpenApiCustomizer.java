package com.demo.common.config;

import com.github.xiaoymin.knife4j.core.conf.GlobalConstants;
import com.github.xiaoymin.knife4j.spring.configuration.Knife4jProperties;
import com.github.xiaoymin.knife4j.spring.configuration.Knife4jSetting;
import com.github.xiaoymin.knife4j.spring.extension.Knife4jOpenApiCustomizer;
import com.github.xiaoymin.knife4j.spring.extension.OpenApiExtensionResolver;
import io.swagger.v3.oas.models.OpenAPI;
import org.springdoc.core.properties.SpringDocConfigProperties;

import java.util.HashMap;
import java.util.Map;

/**
 * Knife4j 4.5.0 的 Knife4jOpenApiCustomizer 按 springdoc 2.3 编译，
 * 调用 {@code getGroupConfigs()} 期望返回 {@code List}；
 * springdoc 2.7+（适配 Boot 3.5）已改为返回 {@code Set}，会触发 NoSuchMethodError。
 * <p>
 * 用本类覆盖官方 Bean，保留 Knife4j 扩展注入，跳过有问题的 x-order 扫描逻辑。
 */
public class CompatibleKnife4jOpenApiCustomizer extends Knife4jOpenApiCustomizer {

    private final Knife4jProperties knife4jProperties;

    public CompatibleKnife4jOpenApiCustomizer(Knife4jProperties knife4jProperties,
                                             SpringDocConfigProperties properties) {
        super(knife4jProperties, properties);
        this.knife4jProperties = knife4jProperties;
    }

    @Override
    public void customise(OpenAPI openApi) {
        if (!knife4jProperties.isEnable()) {
            return;
        }
        Knife4jSetting setting = knife4jProperties.getSetting();
        OpenApiExtensionResolver resolver =
                new OpenApiExtensionResolver(setting, knife4jProperties.getDocuments());
        resolver.start();
        Map<String, Object> objectMap = new HashMap<>();
        objectMap.put(GlobalConstants.EXTENSION_OPEN_SETTING_NAME, setting);
        objectMap.put(GlobalConstants.EXTENSION_OPEN_MARKDOWN_NAME, resolver.getMarkdownFiles());
        openApi.addExtension(GlobalConstants.EXTENSION_OPEN_API_NAME, objectMap);
    }
}
