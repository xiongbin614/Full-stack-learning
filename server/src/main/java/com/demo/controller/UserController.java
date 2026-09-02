package com.demo.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.demo.common.result.Result;
import com.demo.dto.UserCreateDTO;
import com.demo.dto.UserQuery;
import com.demo.dto.UserUpdateDTO;
import com.demo.service.UserService;
import com.demo.vo.UserVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "用户管理", description = "系统用户相关接口")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "分页查询用户")
    public Result<IPage<UserVO>> page(UserQuery query) {
        return Result.ok(userService.page(query));
    }

    @GetMapping("/{id}")
    @Operation(summary = "按 ID 查询用户")
    public Result<UserVO> getById(
            @Parameter(description = "用户 ID") @PathVariable Long id) {
        return Result.ok(userService.getById(id));
    }

    @PostMapping
    @Operation(summary = "新增用户")
    public Result<Long> create(@Valid @RequestBody UserCreateDTO dto) {
        return Result.ok(userService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新用户")
    public Result<Void> update(
            @Parameter(description = "用户 ID") @PathVariable Long id,
            @Valid @RequestBody UserUpdateDTO dto) {
        userService.update(id, dto);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除用户")
    public Result<Void> delete(
            @Parameter(description = "用户 ID") @PathVariable Long id) {
        userService.delete(id);
        return Result.ok();
    }
}
