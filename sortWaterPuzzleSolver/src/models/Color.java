package models;

import java.util.Objects;

public record Color(Integer colorNum, String colorStr) {
    public Color(Integer color) {
        this(color, null);
    }

    public Color(String color) {
        this(null, color);
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Color that)) {
            return false;
        }
        return Objects.equals(this.colorNum, that.colorNum) && Objects.equals(this.colorStr, that.colorStr);
    }

    @Override
    public String toString() {
        return colorNum != null ? colorNum.toString() : colorStr;
    }
}
