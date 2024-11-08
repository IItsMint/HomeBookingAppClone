package com.example.HomeBookingApp_back.booking.mapper;
import com.example.HomeBookingApp_back.booking.application.dto.BookedDateDTO;
import com.example.HomeBookingApp_back.booking.application.dto.NewBookingDTO;
import com.example.HomeBookingApp_back.booking.domain.Booking;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    Booking newBookingToBooking(NewBookingDTO newBookingDTO);
    BookedDateDTO bookingToCheckAvailability(Booking booking);
}
