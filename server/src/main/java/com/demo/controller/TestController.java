package com.demo.controller;

import com.demo.common.result.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "测试模块", description = "测试相关接口")

public class TestController {
    @GetMapping("/hello")
    @Operation(summary = "hello测试接口", description = "简单返回字符串")
    public Result<String> hello() {
        return Result.ok("hello world");
    }
}
