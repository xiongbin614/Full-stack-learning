package com.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "用户分页查询条件")
public class UserQuery {

    @Schema(description = "登录名（模糊）")
    private String username;

    @Schema(description = "昵称（模糊）")
    private String nickname;

    @Schema(description = "手机号（模糊）")
    private String phone;

    @Schema(description = "状态：0禁用 1启用")
    private Integer status;

    @Schema(description = "页码，从 1 开始", example = "1")
    private Long page = 1L;

    @Schema(description = "每页条数", example = "10")
    private Long size = 10L;
}
