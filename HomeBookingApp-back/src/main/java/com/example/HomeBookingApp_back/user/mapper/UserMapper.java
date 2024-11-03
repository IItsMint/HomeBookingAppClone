package com.example.HomeBookingApp_back.user.mapper;

import com.example.HomeBookingApp_back.user.application.dto.ReadUserDTO;
import com.example.HomeBookingApp_back.user.domain.Authority;
import com.example.HomeBookingApp_back.user.domain.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    ReadUserDTO toReadUserDTO(User user);

    default String mapAuthoritiesToString(Authority authority) {
        return authority.getName();
    }
}
