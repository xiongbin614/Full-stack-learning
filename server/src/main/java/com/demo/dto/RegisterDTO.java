package com.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "注册入参")
public class RegisterDTO {

    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 64, message = "用户名长度 2-64")
    @Schema(description = "登录名", example = "zhangsan")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 64, message = "密码长度 6-64")
    @Schema(description = "密码", example = "ChangeMe@123")
    private String password;

    @Size(max = 64, message = "昵称最长 64")
    @Schema(description = "昵称")
    private String nickname;
}
