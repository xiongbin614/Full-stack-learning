package com.cmccpc.fullstack.aspect;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Controller 层请求日志切面（对 password / token 等字段脱敏）
 */
@Slf4j
@Aspect
@Component
public class LogAspect {

    private static final Set<String> SENSITIVE_KEYS = Set.of(
            "password", "pwd", "oldpassword", "newpassword",
            "token", "secret", "authorization", "accesstoken", "refreshtoken");

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Pointcut("execution(public * com.cmccpc.fullstack.controller..*(..))")
    public void controllerPointcut() {
    }

    @Around("controllerPointcut()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringTypeName();
        String methodName = signature.getName();

        String args = Arrays.stream(joinPoint.getArgs())
                .map(this::serializeArg)
                .collect(Collectors.joining(", "));

        HttpServletRequest request = currentRequest();
        String uri = request != null ? request.getRequestURI() : "-";
        String httpMethod = request != null ? request.getMethod() : "-";

        try {
            Object result = joinPoint.proceed();
            long cost = System.currentTimeMillis() - start;
            log.info("[AOP] {}({}) {} {} 参数=[{}] 返回=[{}] 耗时={}ms",
                    className, methodName, httpMethod, uri, args, serialize(result), cost);
            return result;
        } catch (Throwable e) {
            long cost = System.currentTimeMillis() - start;
            log.error("[AOP] {}({}) {} {} 参数=[{}] 异常={} 耗时={}ms",
                    className, methodName, httpMethod, uri, args, e.getMessage(), cost);
            throw e;
        }
    }

    private HttpServletRequest currentRequest() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attributes == null ? null : attributes.getRequest();
    }

    private String serializeArg(Object arg) {
        if (arg instanceof MultipartFile file) {
            return "MultipartFile[name=" + file.getOriginalFilename() + ", size=" + file.getSize() + "]";
        }
        if (arg instanceof HttpServletRequest || arg instanceof jakarta.servlet.http.HttpServletResponse) {
            return arg.getClass().getSimpleName();
        }
        return serialize(arg);
    }

    private String serialize(Object obj) {
        try {
            JsonNode node = objectMapper.valueToTree(obj);
            maskSensitive(node);
            return objectMapper.writeValueAsString(node);
        } catch (Exception e) {
            return String.valueOf(obj);
        }
    }

    private void maskSensitive(JsonNode node) {
        if (node == null) {
            return;
        }
        if (node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;
            Iterator<Map.Entry<String, JsonNode>> fields = objectNode.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> entry = fields.next();
                String key = entry.getKey().toLowerCase(Locale.ROOT).replace("_", "");
                if (SENSITIVE_KEYS.contains(key)) {
                    objectNode.put(entry.getKey(), "***");
                } else {
                    maskSensitive(entry.getValue());
                }
            }
        } else if (node.isArray()) {
            for (JsonNode child : node) {
                maskSensitive(child);
            }
        }
    }

}
