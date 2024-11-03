package com.example.HomeBookingApp_back.listing.repository;

import com.example.HomeBookingApp_back.listing.domain.ListingPicture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListingPictureRepository extends JpaRepository<ListingPicture, Long> {
}
