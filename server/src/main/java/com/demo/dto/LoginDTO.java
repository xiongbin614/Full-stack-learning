package com.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "登录入参")
public class LoginDTO {

    @NotBlank(message = "用户名不能为空")
    @Schema(description = "登录名", example = "admin")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Schema(description = "密码", example = "ChangeMe@123")
    private String password;
}
