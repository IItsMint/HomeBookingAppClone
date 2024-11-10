package com.example.HomeBookingApp_back.listing.application;

import com.example.HomeBookingApp_back.listing.application.dto.CreatedListingDTO;
import com.example.HomeBookingApp_back.listing.application.dto.DisplayCardListingDTO;
import com.example.HomeBookingApp_back.listing.application.dto.ListingCreateBookingDTO;
import com.example.HomeBookingApp_back.listing.application.dto.SaveListingDTO;
import com.example.HomeBookingApp_back.listing.domain.Listing;
import com.example.HomeBookingApp_back.listing.mapper.ListingMapper;
import com.example.HomeBookingApp_back.listing.repository.ListingRepository;
import com.example.HomeBookingApp_back.sharedkernel.service.State;
import com.example.HomeBookingApp_back.user.application.Auth0Service;
import com.example.HomeBookingApp_back.user.application.UserService;
import com.example.HomeBookingApp_back.user.application.dto.ReadUserDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LandlordService {

    private final ListingRepository listingRepository;
    private final ListingMapper listingMapper;
    private final UserService userService;
    private final  Auth0Service auth0Service;
    private final PictureService pictureService;

    public LandlordService(ListingRepository listingRepository, ListingMapper listingMapper, UserService userService, Auth0Service auth0Service, PictureService pictureService) {
        this.listingRepository = listingRepository;
        this.listingMapper = listingMapper;
        this.userService = userService;
        this.auth0Service = auth0Service;
        this.pictureService = pictureService;
    }

    public CreatedListingDTO create(SaveListingDTO saveListingDTO) {
        Listing newListing = listingMapper.saveListingDTOToListing(saveListingDTO);

        ReadUserDTO userConnected = userService.getAuthenticatedUserFromSecurityContext();
        newListing.setLandlordPublicId(userConnected.publicId());
        Listing savedListing = listingRepository.saveAndFlush(newListing);

        pictureService.saveAll(saveListingDTO.getPictures(), savedListing);
        auth0Service.addLandlordRoleToUser(userConnected);

        return listingMapper.listingToCreatedListingDTO(savedListing);
    }

    public Optional<ListingCreateBookingDTO> getByListingPublicIc(UUID publicId){
        return listingRepository.findByPublicId(publicId).map(listingMapper::mapListingToListingCreateBookingDTO);
    }

    @Transactional(readOnly = true)
    public List<DisplayCardListingDTO> getAllProperties(ReadUserDTO landlord) {
        List<Listing> properties = listingRepository.findAllByLandlordPublicIdFetchCoverPicture(landlord.publicId());
        return listingMapper.listingToDisplayCardListingDTOs(properties);
    }

    @Transactional
    //we are doing it with two parameters hence only the landlord who owned the listing can delete it.
    public State<UUID, String> delete(UUID publicId, ReadUserDTO landlord) {

        long deletedSuccessfully = listingRepository.deleteByPublicIdAndLandlordPublicId(publicId, landlord.publicId());

        if(deletedSuccessfully > 0){
            return State.<UUID, String>builder().forSuccess(publicId);
        }
        else {
            return State.<UUID, String>builder().forUnauthorized("You don't have permission to delete this listing...");
        }
    }

    public List<DisplayCardListingDTO> getCardDisplayByListingPublicId(List<UUID> allListingsPublicId) {
        return listingRepository.findAllByPublicIdIn(allListingsPublicId)
                .stream().map(listingMapper::listingToDisplayCardListingDTO).toList();
    }

    @Transactional
    public Optional<DisplayCardListingDTO> getByPublicIdAndLandlordPublicId(UUID listingPublicId, UUID landlordPublicId) {
        return listingRepository.findOneByPublicIdAndLandlordPublicId(listingPublicId, landlordPublicId)
                .map(listingMapper::listingToDisplayCardListingDTO);
    }
}
