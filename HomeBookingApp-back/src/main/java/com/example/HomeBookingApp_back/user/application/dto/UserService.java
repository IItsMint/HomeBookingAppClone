package com.example.HomeBookingApp_back.user.application.dto;

import com.example.HomeBookingApp_back.user.mapper.UserMapper;
import com.example.HomeBookingApp_back.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final String UPDATED_AT_KEY = "updated_at";
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

}
