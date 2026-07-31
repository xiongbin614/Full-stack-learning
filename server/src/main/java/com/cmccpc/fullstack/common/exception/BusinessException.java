package com.cmccpc.fullstack.common.exception;

import com.cmccpc.fullstack.common.api.ResultCode;
import lombok.Getter;

/**
 * 业务异常
 * <p>
 * 在 Service 层通过 {@code throw new BusinessException(ResultCode.XXX)} 抛出，
 * 由 {@link GlobalExceptionHandler} 统一转换为前端可读的响应。
 *
 * @author cmccpc
 */
@Getter
public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final long code;

    public BusinessException(String message) {
        super(message);
        this.code = ResultCode.FAILED.getCode();
    }

    public BusinessException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.code = resultCode.getCode();
    }

    public BusinessException(long code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(ResultCode resultCode, String message) {
        super(message);
        this.code = resultCode.getCode();
    }

}
