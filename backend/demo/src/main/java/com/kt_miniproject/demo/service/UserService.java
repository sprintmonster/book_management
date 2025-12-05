package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.dto.user.UserCreateRequest;
import com.kt_miniproject.demo.dto.user.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserCreateRequest request);

    UserResponse getUserInfo(Long id);
}