package com.example.HomeBookingApp_back.booking.presentation;

import com.example.HomeBookingApp_back.booking.application.BookingService;
import com.example.HomeBookingApp_back.booking.application.dto.BookedDateDTO;
import com.example.HomeBookingApp_back.booking.application.dto.BookedListingDTO;
import com.example.HomeBookingApp_back.booking.application.dto.NewBookingDTO;
import com.example.HomeBookingApp_back.sharedkernel.service.State;
import com.example.HomeBookingApp_back.sharedkernel.service.StatusNotification;
import jakarta.validation.Valid;
import org.springframework.beans.factory.parsing.Problem;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/booking")
public class BookingResource {
    private final BookingService bookingService;

    public BookingResource(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("create")
    public ResponseEntity<Boolean> create(@Valid @RequestBody NewBookingDTO newBookingDTO) {
        State<Void, String> createState =bookingService.create(newBookingDTO);

        if (createState.getStatus().equals(StatusNotification.ERROR)) {
           ProblemDetail problemDetail  =ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, createState.getError());
            return  ResponseEntity.of(problemDetail).build();
        }
        else{
            return ResponseEntity.ok(true);
        }
    }

    @GetMapping("check-availability")
    public ResponseEntity<List<BookedDateDTO>> checkAvailability(@RequestParam UUID listingPublicId){
        return ResponseEntity.ok(bookingService.checkAvailability(listingPublicId));
    }

    @GetMapping("get-booked-listing")
    public ResponseEntity<List<BookedListingDTO>> getBookedListings(){
        return ResponseEntity.ok(bookingService.getBookedListing());
    }

    //lets implement cancel method here.
    @DeleteMapping("cancel")
    public ResponseEntity<UUID> cancel(@RequestParam UUID bookingPublicId, @RequestParam UUID listingPublicId){
        State<UUID, String> cancelState =bookingService.cancel(bookingPublicId, listingPublicId);
        //lets implement error handling.
        if (cancelState.getStatus().equals(StatusNotification.ERROR)) {
          ProblemDetail problemDetail =ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, cancelState.getError());
            return ResponseEntity.of(problemDetail).build();
        }
        else{
            return ResponseEntity.ok(bookingPublicId);
        }
    }
}
