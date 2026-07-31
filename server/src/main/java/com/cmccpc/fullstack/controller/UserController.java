package com.cmccpc.fullstack.controller;

import com.cmccpc.fullstack.common.api.PageResult;
import com.cmccpc.fullstack.common.api.Result;
import com.cmccpc.fullstack.dto.ResetPasswordRequest;
import com.cmccpc.fullstack.dto.UpdateStatusRequest;
import com.cmccpc.fullstack.dto.UserCreateRequest;
import com.cmccpc.fullstack.dto.UserResponse;
import com.cmccpc.fullstack.dto.UserUpdateRequest;
import com.cmccpc.fullstack.entity.User;
import com.cmccpc.fullstack.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 用户管理接口
 */
@Tag(name = "用户管理", description = "用户 CRUD")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "创建用户")
    @PostMapping
    public Result<UserResponse> create(@Valid @RequestBody UserCreateRequest request) {
        return Result.success(UserResponse.from(userService.createUser(request)));
    }

    @Operation(summary = "分页查询用户")
    @GetMapping
    public Result<PageResult<UserResponse>> page(
            @Parameter(description = "页码，从 0 开始") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页条数") @RequestParam(defaultValue = "10") int size) {
        Page<User> result = userService.pageUsers(PageRequest.of(page, size));
        List<UserResponse> records = result.getContent().stream().map(UserResponse::from).toList();
        return Result.success(PageResult.of(result.getTotalElements(), page, size, records));
    }

    @Operation(summary = "按 ID 查询用户")
    @GetMapping("/{id}")
    public Result<UserResponse> getById(@PathVariable Long id) {
        return Result.success(UserResponse.from(userService.getUserById(id)));
    }

    @Operation(summary = "删除用户（需 ADMIN）")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success();
    }

    @Operation(summary = "编辑用户（昵称/邮箱/手机号）")
    @PutMapping("/{id}")
    public Result<UserResponse> update(@PathVariable Long id,
                                       @Valid @RequestBody UserUpdateRequest request) {
        return Result.success(UserResponse.from(userService.updateUser(id, request)));
    }

    @Operation(summary = "禁用 / 启用用户")
    @PutMapping("/{id}/status")
    public Result<UserResponse> updateStatus(@PathVariable Long id,
                                             @Valid @RequestBody UpdateStatusRequest request) {
        return Result.success(UserResponse.from(userService.updateUserStatus(id, request.getStatus())));
    }

    @Operation(summary = "重置密码")
    @PutMapping("/{id}/password")
    public Result<Void> resetPassword(@PathVariable Long id,
                                      @Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(id, request.getPassword());
        return Result.success();
    }

}
