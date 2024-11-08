package com.example.HomeBookingApp_back.listing.application.dto;

import com.example.HomeBookingApp_back.listing.application.dto.vo.PriceVO;

import java.util.UUID;

public record ListingCreateBookingDTO(UUID listingPublicId, PriceVO price) {
}
