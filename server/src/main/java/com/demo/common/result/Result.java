package com.demo.common.result;

import lombok.Data;

/**
 * 统一接口响应体，与前端 ApiResult 对齐：
 * { "code": 200, "message": "success", "data": ..., "timestamp": ... }
 */
@Data
public class Result<T> {

    public static final int CODE_OK = 200;
    public static final int CODE_FAIL = 500;
    public static final int CODE_BAD_REQUEST = 400;
    public static final int CODE_UNAUTHORIZED = 401;
    public static final int CODE_FORBIDDEN = 403;
    public static final int CODE_NOT_FOUND = 404;

    private int code;
    private String message;
    private T data;
    private long timestamp;

    private Result() {
    }

    private Result(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
    }

    public static <T> Result<T> ok() {
        return ok(null);
    }

    public static <T> Result<T> ok(T data) {
        return new Result<>(CODE_OK, "success", data);
    }

    public static <T> Result<T> ok(T data, String message) {
        return new Result<>(CODE_OK, message, data);
    }

    public static <T> Result<T> fail(String message) {
        return fail(CODE_FAIL, message);
    }

    public static <T> Result<T> fail(int code, String message) {
        return new Result<>(code, message, null);
    }
}
