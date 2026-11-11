package com.demo.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "登录成功返回")
public class LoginVO {

    @Schema(description = "登录名")
    private String username;

    @Schema(description = "昵称")
    private String nickname;

    @Schema(description = "角色：ADMIN / USER")
    private String role;

    @Schema(description = "提示文案")
    private String message;
}
