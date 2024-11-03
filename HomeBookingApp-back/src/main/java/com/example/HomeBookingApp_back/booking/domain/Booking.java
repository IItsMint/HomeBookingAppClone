package com.example.HomeBookingApp_back.booking.domain;

import com.example.HomeBookingApp_back.sharedkernel.domain.AbstractAuditingEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "booking")
public class Booking extends AbstractAuditingEntity<Long> {

    @Id
    @GeneratedValue(strategy =  GenerationType.SEQUENCE, generator = "bookingSequenceGenerator")
    @SequenceGenerator(name =  "bookingSequenceGenerator", sequenceName = "booking_generator", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @UuidGenerator
    @Column(name = "public_id", nullable = false)
    private UUID publicId;

    @Column(name = "start_date", nullable = false)
    private OffsetDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private OffsetDateTime endDate;

    @Column(name = "total_price", nullable = false)
    private int totalPrice;

    @Column(name = "nb_of_travelers", nullable = false)
    private int numbersOfTravelers;

    @Column(name = "fk_tenant", nullable = false)
    private UUID fkTenant;

    @Column(name = "fk_listing", nullable = false)
    private UUID fkLandLord;

    //Let's create getters and setters for all.
    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getPublicId() {
        return publicId;
    }

    public void setPublicId(UUID publicId) {
        this.publicId = publicId;
    }

    public OffsetDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(OffsetDateTime startDate) {
        this.startDate = startDate;
    }

    public OffsetDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(OffsetDateTime endDate) {
        this.endDate = endDate;
    }

    public int getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(int totalPrice) {
        this.totalPrice = totalPrice;
    }

    public int getNumbersOfTravelers() {
        return numbersOfTravelers;
    }

    public void setNumbersOfTravelers(int numbersOfTravelers) {
        this.numbersOfTravelers = numbersOfTravelers;
    }

    public UUID getFkTenant() {
        return fkTenant;
    }

    public void setFkTenant(UUID fkTenant) {
        this.fkTenant = fkTenant;
    }

    public UUID getFkLandLord() {
        return fkLandLord;
    }

    public void setFkLandLord(UUID fkLandLord) {
        this.fkLandLord = fkLandLord;
    }

    //let's create equals and hash code without id,public id.
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Booking booking = (Booking) o;
        return totalPrice == booking.totalPrice && numbersOfTravelers == booking.numbersOfTravelers && Objects.equals(startDate, booking.startDate) && Objects.equals(endDate, booking.endDate) && Objects.equals(fkTenant, booking.fkTenant) && Objects.equals(fkLandLord, booking.fkLandLord);
    }

    @Override
    public int hashCode() {
        return Objects.hash(startDate, endDate, totalPrice, numbersOfTravelers, fkTenant, fkLandLord);
    }

    //let's create toString without id and public id.

    @Override
    public String toString() {
        return "Booking{" +
                "startDate=" + startDate +
                ", endDate=" + endDate +
                ", totalPrice=" + totalPrice +
                ", numbersOfTravelers=" + numbersOfTravelers +
                ", fkTenant=" + fkTenant +
                ", fkLandLord=" + fkLandLord +
                '}';
    }
}
