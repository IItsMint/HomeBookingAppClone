package com.example.HomeBookingApp_back.listing.mapper;


import com.example.HomeBookingApp_back.listing.application.dto.*;
import com.example.HomeBookingApp_back.listing.application.dto.vo.PriceVO;
import com.example.HomeBookingApp_back.listing.domain.Listing;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ListingPictureMapper.class})
public interface ListingMapper {

    //we are ignoring these part since it is job ob the database.
    @Mapping(target = "landlordPublicId", ignore = true)
    @Mapping(target = "publicId", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "pictures", ignore = true)
    @Mapping(target = "title", source = "description.title.value")
    @Mapping(target = "description", source = "description.description.value")
    @Mapping(target = "bedrooms", source = "infos.bedrooms.value")
    @Mapping(target = "guests", source = "infos.guests.value")
    @Mapping(target = "bookingCategory", source = "category")
    @Mapping(target = "beds", source = "infos.beds.value")
    @Mapping(target = "bathrooms", source = "infos.baths.value")
    @Mapping(target = "price", source = "price.value")

    Listing saveListingDTOToListing(SaveListingDTO saveListingDTO);
    CreatedListingDTO listingToCreatedListingDTO(Listing listing);

    @Mapping(target = "cover", source = "pictures")
    List<DisplayCardListingDTO> listingToDisplayCardListingDTOs(List<Listing> listings);

    @Mapping(target = "cover", source = "pictures", qualifiedByName = "extract-cover")
    DisplayCardListingDTO listingToDisplayCardListingDTO(Listing listing);

    default PriceVO mapPriceToPriceVO(int price) {
        return new PriceVO(price);
    }

    @Mapping(target = "landlord", ignore = true)
    @Mapping(target = "description.title.value", source = "title")
    @Mapping(target = "description.description.value", source ="description")
    @Mapping(target = "infos.bedrooms.value", source = "bedrooms")
    @Mapping(target = "infos.guests.value", source = "guests")
    @Mapping(target = "infos.beds.value", source = "beds")
    @Mapping(target = "infos.baths.value", source = "bathrooms")
    @Mapping(target = "price.value", source = "price")
    @Mapping(target = "category", source = "bookingCategory")
    DisplayListingDTO listingToDisplayListingDTO(Listing listing);

    @Mapping(target = "listingPublicId", source = "publicId")
    ListingCreateBookingDTO mapListingToListingCreateBookingDTO(Listing listing);
}
