package com.cmccpc.fullstack.repository;

import com.cmccpc.fullstack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 用户数据仓库
 * <p>
 * JpaRepository 提供基础 CRUD；JpaSpecificationExecutor 提供动态查询能力。
 * 复杂查询可在此添加 @Query 方法或使用 Specification。
 *
 * @author cmccpc
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    /**
     * 按用户名查询
     */
    Optional<User> findByUsername(String username);

    /**
     * 判断用户名是否存在
     */
    boolean existsByUsername(String username);

    /**
     * 按邮箱查询
     */
    Optional<User> findByEmail(String email);

}
