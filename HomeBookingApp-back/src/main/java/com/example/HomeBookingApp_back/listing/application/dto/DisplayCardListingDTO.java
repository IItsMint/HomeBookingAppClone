package com.example.HomeBookingApp_back.listing.application.dto;

import com.example.HomeBookingApp_back.listing.application.dto.sub.PictureDTO;
import com.example.HomeBookingApp_back.listing.application.dto.vo.PriceVO;
import com.example.HomeBookingApp_back.listing.domain.BookingCategory;

import java.util.UUID;

public record DisplayCardListingDTO(
        PriceVO price, String location, PictureDTO cover, BookingCategory bookingCategory, UUID publicId) {

}
