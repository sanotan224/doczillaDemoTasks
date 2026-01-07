package models;

import java.util.Objects;

public record Drop(Color color) {

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Drop that)) {
            return false;
        }
        return this.color.equals(that.color);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(color);
    }

    @Override
    public String toString() {
        return color.toString();
    }

}