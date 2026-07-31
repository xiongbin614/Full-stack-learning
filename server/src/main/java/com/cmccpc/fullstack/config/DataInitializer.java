package com.cmccpc.fullstack.config;

import com.cmccpc.fullstack.entity.User;
import com.cmccpc.fullstack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 开发环境数据初始化
 * <p>
 * 首次启动自动创建默认管理员账号（dev / mysql profile）：
 * 用户名 admin / 密码 admin123（启动后请立即修改）
 *
 * @author cmccpc
 */
@Slf4j
@Configuration
@Profile({"dev", "mysql"})
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initAdminUser() {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .nickname("系统管理员")
                        .email("admin@cmccpc.com")
                        .role("ADMIN")
                        .status(1)
                        .build();
                userRepository.save(admin);
                log.info("已创建默认管理员: admin / admin123（请尽快修改密码）");
            }
        };
    }

}
