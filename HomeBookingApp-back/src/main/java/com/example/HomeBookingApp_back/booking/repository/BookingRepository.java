package com.example.HomeBookingApp_back.booking.repository;

import com.example.HomeBookingApp_back.booking.domain.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
