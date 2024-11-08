package com.example.HomeBookingApp_back.listing.presentation;

import com.example.HomeBookingApp_back.listing.application.TenantService;
import com.example.HomeBookingApp_back.listing.application.dto.DisplayCardListingDTO;
import com.example.HomeBookingApp_back.listing.application.dto.DisplayListingDTO;
import com.example.HomeBookingApp_back.listing.domain.BookingCategory;
import com.example.HomeBookingApp_back.sharedkernel.service.State;
import com.example.HomeBookingApp_back.sharedkernel.service.StatusNotification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/tenant-listing")
public class TenantResource {

    private final TenantService tenantService;

    public TenantResource(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping("/get-all-by-category")
    public ResponseEntity<Page<DisplayCardListingDTO>> findAllByBookingCategory(Pageable pageable, @RequestParam BookingCategory category) {

        return ResponseEntity.ok(tenantService.getAllByCategory(pageable, category));
    }


    @GetMapping("/get-one")
    public ResponseEntity<DisplayListingDTO> getOne(@RequestParam UUID publicId){
        State<DisplayListingDTO, String> dispListState =tenantService.getOne(publicId);

        if(dispListState.getStatus().equals(StatusNotification.OK)){
            return ResponseEntity.ok(dispListState.getValue());
        }
        else{
             ProblemDetail problemDetail =ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, dispListState.getError());
            return ResponseEntity.of(problemDetail).build();
        }
    }
}
