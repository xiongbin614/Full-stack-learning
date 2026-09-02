package com.demo.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "登录出参")
public class LoginVO {

    @Schema(description = "访问令牌，后续请求放在 Header：Authorization: Bearer {token}")
    private String token;

    @Schema(description = "令牌有效期（秒）")
    private Long expiresIn;

    @Schema(description = "用户信息")
    private UserVO user;
}
