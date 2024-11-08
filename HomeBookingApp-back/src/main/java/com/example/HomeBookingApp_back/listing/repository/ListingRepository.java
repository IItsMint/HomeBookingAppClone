package com.example.HomeBookingApp_back.listing.repository;
import com.example.HomeBookingApp_back.listing.domain.BookingCategory;
import com.example.HomeBookingApp_back.listing.domain.Listing;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    //we don't want to fetch the five picture hence we are gonna display it as a card so, we only need cover primary.
    @Query("SELECT listing FROM Listing listing LEFT JOIN FETCH listing.pictures picture" +
            " WHERE listing.landlordPublicId = :landlordPublicId AND picture.isCover =true")
    List<Listing> findAllByLandlordPublicIdFetchCoverPicture(UUID landlordPublicId);

    long deleteByPublicIdAndLandlordPublicId(UUID publicId, UUID landlordPublicId);

    @Query("SELECT listing from Listing listing LEFT JOIN FETCH listing.pictures picture" +
            " WHERE picture.isCover = true AND listing.bookingCategory = :bookingCategory")
    Page<Listing> findAllByBookingCategoryWithCoverOnly(Pageable pageable, BookingCategory bookingCategory);

    //at the beginning no categories will be selected hence we have two different cases.
    @Query("SELECT listing from Listing listing LEFT JOIN FETCH listing.pictures picture" +
            " WHERE picture.isCover = true")
    Page<Listing> findAllWithCoverOnly(Pageable pageable);



}

