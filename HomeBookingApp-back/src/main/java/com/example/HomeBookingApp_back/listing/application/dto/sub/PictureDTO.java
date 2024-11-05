package com.example.HomeBookingApp_back.listing.application.dto.sub;

import jakarta.validation.constraints.NotNull;

import java.util.Objects;

public record PictureDTO(
        @NotNull byte[] file,
        @NotNull String fileContentType,
        @NotNull boolean isCover
        ) {

    //we need to implement equals without file byte
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PictureDTO that = (PictureDTO) o;
        return isCover == that.isCover && Objects.equals(fileContentType, that.fileContentType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fileContentType, isCover);
    }

    //as well as toString without file byte
    @Override
    public String toString() {
        return "PictureDTO{" +
                "fileContentType='" + fileContentType + '\'' +
                ", isCover=" + isCover +
                '}';
    }
}
