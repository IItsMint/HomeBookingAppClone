package com.example.HomeBookingApp_back.booking.application;

import com.example.HomeBookingApp_back.booking.application.dto.BookedDateDTO;
import com.example.HomeBookingApp_back.booking.application.dto.BookedListingDTO;
import com.example.HomeBookingApp_back.booking.application.dto.NewBookingDTO;
import com.example.HomeBookingApp_back.booking.domain.Booking;
import com.example.HomeBookingApp_back.booking.mapper.BookingMapper;
import com.example.HomeBookingApp_back.booking.repository.BookingRepository;
import com.example.HomeBookingApp_back.infrastructure.config.SecurityUtils;
import com.example.HomeBookingApp_back.listing.application.LandlordService;
import com.example.HomeBookingApp_back.listing.application.dto.DisplayCardListingDTO;
import com.example.HomeBookingApp_back.listing.application.dto.ListingCreateBookingDTO;
import com.example.HomeBookingApp_back.listing.application.dto.vo.PriceVO;
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

    //@Transactional
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

    @Transactional(readOnly = true)
    public List<BookedDateDTO> checkAvailability(UUID publicId) {
        return bookingRepository.findAllByFkListing(publicId).stream().map(bookingMapper::bookingToCheckAvailability).toList();
    }


    @Transactional(readOnly = true)
    public List<BookedListingDTO> getBookedListing() {
        ReadUserDTO connectedUser =userService.getAuthenticatedUserFromSecurityContext();
        List<Booking> allBookings =bookingRepository.findAllByFkTenant(connectedUser.publicId());
        List<UUID> allListingsPublicId =allBookings.stream().map(Booking::getFkListing).toList();
        List<DisplayCardListingDTO> allListings =landlordService.getCardDisplayByListingPublicId(allListingsPublicId);
        //we are trying to create a dto with these two lists
        return mapBookingToBookedListing(allBookings, allListings);
    }

    @Transactional(readOnly = true)
    public List<BookedListingDTO> mapBookingToBookedListing(List<Booking> allBookings, List<DisplayCardListingDTO> allListings) {
        return allBookings.stream().map(booking -> {
            DisplayCardListingDTO displayCardListingDTO = allListings.stream().filter(listing ->
                    listing.publicId().equals(booking.getFkListing())).findFirst().orElseThrow();

            BookedDateDTO dates = bookingMapper.bookingToCheckAvailability(booking);
            return new BookedListingDTO(displayCardListingDTO.cover(), displayCardListingDTO.location(), dates,
                    new PriceVO(booking.getTotalPrice()), booking.getPublicId(), displayCardListingDTO.publicId());
        }).toList();
    }

    //let's create cancel method for the user.
    //don't forget to transactional here , it ain't delete if you miss it.
    @Transactional
    public State<UUID, String> cancel(UUID bookingPublicId, UUID listingPublicId, boolean byLandlord) {
        ReadUserDTO connectedUser =userService.getAuthenticatedUserFromSecurityContext();
        int deleteSuccess = 0;

        if(SecurityUtils.hasCurrentUserAnyOfAuthorities(SecurityUtils.ROLE_LANDLORD) && byLandlord){
            deleteSuccess = handleDeletionForLandlord(bookingPublicId, listingPublicId, connectedUser, deleteSuccess);
        }
        else {
            deleteSuccess =bookingRepository.deleteBookingByFkTenantAndPublicId(connectedUser.publicId(), bookingPublicId);
        }
        bookingRepository.deleteBookingByFkTenantAndPublicId(connectedUser.publicId(), bookingPublicId);

        if(deleteSuccess >= 1){
            return State.<UUID, String>builder().forSuccess(bookingPublicId);
        }
        else{
            return State.<UUID, String>builder().forError("404 Booking Not Found");
        }

    }

    private int handleDeletionForLandlord(UUID bookingPublicId, UUID listingPublicId, ReadUserDTO connectedUser, int deleteSuccess) {
        Optional<DisplayCardListingDTO> listingVerificationOptional =landlordService.getByPublicIdAndLandlordPublicId(listingPublicId, connectedUser.publicId());

        if(listingVerificationOptional.isPresent()){
            deleteSuccess = bookingRepository.deleteBookingByPublicIdAndFkListing(bookingPublicId, listingVerificationOptional.get().publicId());
        }

        return deleteSuccess;
    }

    @Transactional(readOnly = true)
    public List<BookedListingDTO> getBookedListingForLandlord() {
        ReadUserDTO connectedUser = userService.getAuthenticatedUserFromSecurityContext();

        List<DisplayCardListingDTO> allProperties =landlordService.getAllProperties(connectedUser);
        List<UUID> allPropertyPublicIds =allProperties.stream().map(DisplayCardListingDTO::publicId).toList();
        List<Booking> allBookings =bookingRepository.findAllByFkListingIn(allPropertyPublicIds);

        return mapBookingToBookedListing(allBookings, allProperties);
    }

    public List<UUID> getBookingMatchByListingIdsAndBookedDate(List<UUID> listingsId, BookedDateDTO bookedDate) {

        return bookingRepository.findAllMatchWithDate(listingsId, bookedDate.startDate(), bookedDate.endDate())
                .stream().map(Booking::getFkListing).toList();
    }

}