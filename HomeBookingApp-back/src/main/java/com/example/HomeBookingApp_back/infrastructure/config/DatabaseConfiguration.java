package com.example.HomeBookingApp_back.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories({
        "com.example.HomeBookingApp_back.user.repository",
        "com.example.HomeBookingApp_back.listing.repository",
        "com.example.HomeBookingApp_back.booking.repository"
})
@EnableTransactionManagement
@EnableJpaAuditing //this is for creation and modification dates.
public class DatabaseConfiguration {
}
