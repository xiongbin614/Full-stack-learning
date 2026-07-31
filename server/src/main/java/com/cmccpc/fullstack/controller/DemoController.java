package com.cmccpc.fullstack.controller;

import com.cmccpc.fullstack.common.api.Result;
import com.cmccpc.fullstack.common.api.ResultCode;
import com.cmccpc.fullstack.util.RedisUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * 能力演示接口
 */
@Tag(name = "能力演示", description = "组件演示接口")
@RestController
@RequestMapping("/demo")
@RequiredArgsConstructor
public class DemoController {

    private final ObjectProvider<RedisUtil> redisUtilProvider;

    @Operation(summary = "应用信息")
    @GetMapping("/info")
    public Result<Map<String, String>> info() {
        Map<String, String> info = new HashMap<>();
        info.put("app", "cmccpc-server");
        info.put("framework", "Spring Boot 3.5.16");
        info.put("message", "CMCCPC Server 运行正常");
        return Result.success(info);
    }

    @Operation(summary = "Redis 读写演示（需 Redis）")
    @GetMapping("/redis")
    public Result<Map<String, Object>> redis(
            @RequestParam(defaultValue = "hello") String key,
            @RequestParam(defaultValue = "world") String value) {
        RedisUtil redisUtil = redisUtilProvider.getIfAvailable();
        if (redisUtil == null) {
            return Result.failed(ResultCode.FAILED.getCode(), "Redis 未启用或不可用");
        }
        redisUtil.set("demo:" + key, value, Duration.ofMinutes(5));
        Map<String, Object> result = new HashMap<>();
        result.put("written", value);
        result.put("readBack", redisUtil.get("demo:" + key));
        return Result.success(result);
    }

}
