package com.example.HomeBookingApp_back.listing.repository;

import com.example.HomeBookingApp_back.listing.domain.Listing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListingRepository extends JpaRepository<Listing, Long> {
}
