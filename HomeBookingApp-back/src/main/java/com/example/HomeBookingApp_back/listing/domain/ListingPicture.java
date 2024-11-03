package com.example.HomeBookingApp_back.listing.domain;

import com.example.HomeBookingApp_back.sharedkernel.domain.AbstractAuditingEntity;
import jakarta.persistence.*;

import java.util.Arrays;
import java.util.Objects;

@Entity
@Table(name = "listing_picture")
public class ListingPicture extends AbstractAuditingEntity<Long> {

    @Id
    @GeneratedValue(strategy =  GenerationType.SEQUENCE, generator = "listingPicturesSequenceGenerator")
    @SequenceGenerator(name =  "listingPicturesSequenceGenerator", sequenceName = "listing_picture_generator", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "Listing_fk", referencedColumnName = "id")
    private Listing listing;

    //we need byte array to store the file binary.
    @Lob
    @Column(name = "file", nullable = false)
    private byte[] file;

    @Column(name = "file_content_type")
    protected String fileContentType;

    @Column(name = "is_cover" )
    private boolean isCover; //this is for is the picture is cover or not.

    //let's create getters and setters.

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Listing getListing() {
        return listing;
    }

    public void setListing(Listing listing) {
        this.listing = listing;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }

    public String getFileContentType() {
        return fileContentType;
    }

    public void setFileContentType(String fileContentType) {
        this.fileContentType = fileContentType;
    }

    public boolean isCover() {
        return isCover;
    }

    public void setCover(boolean cover) {
        isCover = cover;
    }

    //let's create hash code without listing and id in both steps.
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ListingPicture that = (ListingPicture) o;
        return isCover == that.isCover && Objects.deepEquals(file, that.file) && Objects.equals(fileContentType, that.fileContentType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(Arrays.hashCode(file), fileContentType, isCover);
    }
}
