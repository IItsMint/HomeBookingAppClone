package com.example.HomeBookingApp_back.listing.application.dto.sub;

import jakarta.validation.constraints.NotNull;

public record LandlordListingDTO(@NotNull String firstname, @NotNull String imageUrl) {
}
