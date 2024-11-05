package com.example.HomeBookingApp_back.listing.application.dto.vo;

import jakarta.validation.constraints.NotNull;

public record BedRoomsVO(@NotNull(message = "Bedrooms value is mandatory and must be specified.") int value) {
}
