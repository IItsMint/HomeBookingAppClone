package com.example.HomeBookingApp_back.listing.application;
import com.example.HomeBookingApp_back.listing.application.dto.DisplayCardListingDTO;
import com.example.HomeBookingApp_back.listing.domain.BookingCategory;
import com.example.HomeBookingApp_back.listing.domain.Listing;
import com.example.HomeBookingApp_back.listing.mapper.ListingMapper;
import com.example.HomeBookingApp_back.listing.repository.ListingRepository;
import com.example.HomeBookingApp_back.user.application.UserService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TenantService {

    private final UserService userService;
    private final ListingMapper listingMapper;
    private final ListingRepository listingRepository;

    public TenantService(UserService userService, ListingMapper listingMapper, ListingRepository listingRepository) {
        this.userService = userService;
        this.listingMapper = listingMapper;
        this.listingRepository = listingRepository;
    }

    public Page<DisplayCardListingDTO> getAllByCategory(Pageable pageable, BookingCategory category) {

        Page<Listing> allOrBookingCategory;

        if (category == BookingCategory.ALL) {
            allOrBookingCategory = listingRepository.findAllWithCoverOnly(pageable);
        }
        else {
            allOrBookingCategory = listingRepository.findAllByBookingCategoryWithCoverOnly(pageable, category);
        }

        return allOrBookingCategory.map(listingMapper :: listingToDisplayCardListingDTO);
    }



};