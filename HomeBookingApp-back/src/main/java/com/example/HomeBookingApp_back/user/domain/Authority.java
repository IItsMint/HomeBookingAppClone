package com.example.HomeBookingApp_back.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "authority")
public class Authority implements Serializable {

    @NotNull
    @Size(min = 1, max = 50)
    @Id
    @Column(length = 50)
    private String name;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Authority authority = (Authority) o;
        return Objects.equals(name, authority.name);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(name);
    }

    public @NotNull @Size(min = 1, max = 50) String getName() {
        return name;
    }

    public void setName(@NotNull @Size(min = 1, max = 50) String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Authority{" +
                "name='" + name + '\'' +
                '}';
    }
}
