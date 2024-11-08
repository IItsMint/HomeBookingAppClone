import {BathsVo, BedroomsVo, BedsVo, DescriptionVo, GuestsVo, PriceVo, TitleVo} from './listing-vo.model';
import {CategoryName} from '../../layout/navbar/category/category.model';
import {NewListingPicture} from './picture.model';
import {LandlordListingService} from '../landlord-listing.service';

export interface NewListingInfo{

  guests: GuestsVo,
  bedrooms: BedroomsVo,
  beds: BedsVo,
  baths: BathsVo
}

export interface  NewListing{

  category: CategoryName,
  location: string,
  infos: NewListingInfo,
  pictures: Array<NewListingPicture>,
  description: Description,
  price: PriceVo
}

export interface Description{
  title: TitleVo,
  description: DescriptionVo
}

export interface CreatedListing{

  publicId: string,
}

export interface DisplayPicture{
  file?:string,
  fileContentType:string,
  isCover?:boolean,
}

export interface CardListing{
  price: PriceVo,
  location:string,
  cover: DisplayPicture,
  bookingCategory: CategoryName,
  publicId: string,
  loading:boolean,
}

export interface Listing{
  description:Description,
  pictures: Array<DisplayPicture>,
  infos: NewListingInfo,
  price: PriceVo,
  category: CategoryName,
  location: string,
  landlord: LandlordListing,
}

export interface LandlordListing {
  firstName: string,
  imageUrl: string,
}
