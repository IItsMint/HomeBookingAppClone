package com.example.HomeBookingApp_back.booking.application;

import com.example.HomeBookingApp_back.booking.application.dto.BookedDateDTO;
import com.example.HomeBookingApp_back.booking.application.dto.NewBookingDTO;
import com.example.HomeBookingApp_back.booking.domain.Booking;
import com.example.HomeBookingApp_back.booking.mapper.BookingMapper;
import com.example.HomeBookingApp_back.booking.repository.BookingRepository;
import com.example.HomeBookingApp_back.listing.application.LandlordService;
import com.example.HomeBookingApp_back.listing.application.dto.ListingCreateBookingDTO;
import com.example.HomeBookingApp_back.sharedkernel.service.State;
import com.example.HomeBookingApp_back.user.application.UserService;
import com.example.HomeBookingApp_back.user.application.dto.ReadUserDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.example.HomeBookingApp_back.sharedkernel.service.State.builder;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final BookingMapper bookingMapper;
    private final LandlordService landlordService;

    //we need constructor for these values.
    public BookingService(BookingRepository bookingRepository, UserService userService, BookingMapper bookingMapper, LandlordService landlordService) {
        this.bookingRepository = bookingRepository;
        this.userService = userService;
        this.bookingMapper = bookingMapper;
        this.landlordService = landlordService;
    }

    @Transactional
    public State<Void, String> create(NewBookingDTO newBookingDTO) {
        Booking booking =bookingMapper.newBookingToBooking(newBookingDTO);
        Optional<ListingCreateBookingDTO> listingOptional =landlordService.getByListingPublicIc(newBookingDTO.listingPublicId());

        if (listingOptional.isEmpty()) {
            return State.<Void, String>builder().forError("Landlord public ID is missing or not found");
        }

        //we need to check, if there is a booking already for that specific date,
       boolean occupied =bookingRepository.bookingExistsAtInterval(newBookingDTO.startDate(), newBookingDTO.endDate(), newBookingDTO.listingPublicId());

        if(occupied){
            return State.<Void, String>builder().forError("Selected date interval is already taken. Adjust your booking dates and try again.");
        }

        ListingCreateBookingDTO listingCreateBookingDTO =listingOptional.get();
        booking.setFkListing(listingCreateBookingDTO.listingPublicId());

        //since the user connected, we get his information.
        ReadUserDTO connectedUser =userService.getAuthenticatedUserFromSecurityContext();
        booking.setFkTenant(connectedUser.publicId());
        booking.setNumberOfTravelers(1);

        //let's calculate the accommodation length and total price then save.
        long numberOfNights = ChronoUnit.DAYS.between(newBookingDTO.startDate(), newBookingDTO.endDate());
        booking.setTotalPrice((int)(numberOfNights *listingCreateBookingDTO.price().value()));
        bookingRepository.save(booking);

        return State.<Void, String>builder().forSuccess();


    }

    //To check if the reservation made, let's define second service.
    //which is showing all the reservation for a specific home.
    @Transactional(readOnly = true)
    public List<BookedDateDTO> checkAvailability(UUID publicId) {
       return bookingRepository.findAllByFkListing(publicId).stream().map(bookingMapper::bookingToCheckAvailability).toList();
    }


}
