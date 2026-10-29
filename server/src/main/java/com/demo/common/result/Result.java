package com.demo.common.result;

import lombok.Data;

/**
 * 统一接口响应体（空架子预留，学到 Controller 时再用）。
 *
 * <pre>
 * { "code": 200, "msg": "success", "data": ... }
 * </pre>
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
    private String msg;
    private T data;

    private Result() {
    }

    private Result(int code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    public static <T> Result<T> ok() {
        return ok(null);
    }

    public static <T> Result<T> ok(T data) {
        return new Result<>(CODE_OK, "success", data);
    }

    public static <T> Result<T> ok(T data, String msg) {
        return new Result<>(CODE_OK, msg, data);
    }

    public static <T> Result<T> fail(String msg) {
        return fail(CODE_FAIL, msg);
    }

    public static <T> Result<T> fail(int code, String msg) {
        return new Result<>(code, msg, null);
    }
}
