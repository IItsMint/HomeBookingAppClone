package com.example.HomeBookingApp_back.sharedkernel.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.Instant;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AbstractAuditingEntity<T> implements Serializable {

    //Let's Define attributes here.
    //every single time an entity, created this value created automatically.
    public abstract T getId();
    @Column(updatable = false, name = "created_date")
    private Instant createdDate = Instant.now();

    //This is also crated automatically when entity updated.
    @LastModifiedDate
    @Column(name = "last_modified_date")
    public Instant lastModifiedDate = Instant.now();

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Instant getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Instant lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }
}
