package com.example.HomeBookingApp_back.listing.application;
import com.example.HomeBookingApp_back.listing.application.dto.DisplayCardListingDTO;
import com.example.HomeBookingApp_back.listing.application.dto.DisplayListingDTO;
import com.example.HomeBookingApp_back.listing.application.dto.sub.LandlordListingDTO;
import com.example.HomeBookingApp_back.listing.domain.BookingCategory;
import com.example.HomeBookingApp_back.listing.domain.Listing;
import com.example.HomeBookingApp_back.listing.mapper.ListingMapper;
import com.example.HomeBookingApp_back.listing.repository.ListingRepository;
import com.example.HomeBookingApp_back.sharedkernel.service.State;
import com.example.HomeBookingApp_back.user.application.UserService;

import com.example.HomeBookingApp_back.user.application.dto.ReadUserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

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

    @Transactional(readOnly = true)
    public State<DisplayListingDTO, String> getOne(UUID publicId) {
        Optional<Listing> listingByPublicIdOpt = listingRepository.findByPublicId(publicId);

        if (listingByPublicIdOpt.isEmpty()) {
            return State.<DisplayListingDTO, String>builder().forError(String.format("Listing not found for the specified public ID: %s", publicId));

        }
        DisplayListingDTO displayListingDTO = listingMapper.listingToDisplayListingDTO(listingByPublicIdOpt.get());
        ReadUserDTO readUserDTO = userService.getByPublicId(listingByPublicIdOpt.get().getLandlordPublicId()).orElseThrow();

        LandlordListingDTO landlordListingDTO = new LandlordListingDTO(readUserDTO.firstName(), readUserDTO.imageUrl());
        displayListingDTO.setLandlord(landlordListingDTO);

        return State.<DisplayListingDTO, String>builder().forSuccess(displayListingDTO);
    }


};
