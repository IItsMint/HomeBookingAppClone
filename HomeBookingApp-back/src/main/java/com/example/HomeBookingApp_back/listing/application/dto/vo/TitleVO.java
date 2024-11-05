package com.example.HomeBookingApp_back.listing.application.dto.vo;

import jakarta.validation.constraints.NotNull;

public record TitleVO(@NotNull(message = "Title value is mandatory and must be specified.") int value) {
}
