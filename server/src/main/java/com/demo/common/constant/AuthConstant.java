package com.demo.common.constant;

/**
 * 认证相关常量。
 */
public final class AuthConstant {

    private AuthConstant() {
    }

    /** Redis 登录态 key 前缀：auth:token:{token} */
    public static final String TOKEN_KEY_PREFIX = "auth:token:";

    /** 令牌有效期：7 天（秒） */
    public static final long TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60L;

    public static final String HEADER_AUTHORIZATION = "Authorization";

    public static final String BEARER_PREFIX = "Bearer ";
}
