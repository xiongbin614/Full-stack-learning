package com.demo.service;

import com.demo.dto.LoginDTO;
import com.demo.dto.RegisterDTO;
import com.demo.vo.LoginVO;
import com.demo.vo.UserVO;

public interface AuthService {

    LoginVO login(LoginDTO dto, String clientIp);

    void logout(String token);

    UserVO register(RegisterDTO dto);
}
