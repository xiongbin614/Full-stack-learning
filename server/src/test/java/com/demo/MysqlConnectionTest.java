package com.demo;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;

/**
 * 在测试环境验证 MySQL 是否连通（会加载 application.yml + .env）。
 */
@SpringBootTest
class MysqlConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Test
    void shouldConnectToMysql() throws Exception {
        Assertions.assertNotNull(dataSource, "DataSource 未注入，请检查 MySQL / MyBatis-Plus 依赖与配置");

        try (Connection connection = dataSource.getConnection()) {
            Assertions.assertFalse(connection.isClosed(), "连接已关闭");

            DatabaseMetaData meta = connection.getMetaData();
            System.out.printf(
                    "MySQL connected | product=%s | url=%s | user=%s%n",
                    meta.getDatabaseProductName(),
                    meta.getURL(),
                    meta.getUserName());
        }
    }
}
