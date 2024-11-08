package com.example.HomeBookingApp_back.booking.application.dto;

import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.UUID;

public record BookedDateDTO(@NotNull OffsetDateTime startDate, @NotNull OffsetDateTime endDate) {
}
