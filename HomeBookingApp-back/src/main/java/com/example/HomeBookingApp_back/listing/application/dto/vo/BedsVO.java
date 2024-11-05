package com.example.HomeBookingApp_back.listing.application.dto.vo;

import jakarta.validation.constraints.NotNull;

public record BedsVO(@NotNull(message = "Beds value is mandatory and must be specified.") int value) {
}
