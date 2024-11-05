package com.example.HomeBookingApp_back.listing.application.dto.sub;

import com.example.HomeBookingApp_back.listing.application.dto.vo.BathsVO;
import com.example.HomeBookingApp_back.listing.application.dto.vo.BedRoomsVO;
import com.example.HomeBookingApp_back.listing.application.dto.vo.BedsVO;
import com.example.HomeBookingApp_back.listing.application.dto.vo.GuestsVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record ListingInfoDTO(
        @NotNull @Valid GuestsVO guests,
        @NotNull @Valid BedRoomsVO bedrooms,
        @NotNull @Valid BedsVO beds,
        @NotNull @Valid BathsVO baths
        ) {
}
