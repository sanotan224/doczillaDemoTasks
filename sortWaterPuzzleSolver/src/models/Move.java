package models;

import java.util.Objects;

public class Move {
    private final int fromFlask;
    private final int toFlask;
    private final Drop drop;
    private final Move parentMove;
    private int dropCount;

    public Move(int fromFlask, int toFlask, Drop drop, Move parent) {
        this.fromFlask = fromFlask;
        this.toFlask = toFlask;
        this.drop = drop;
        this.dropCount = 0;
        this.parentMove = parent;
    }

    public int getDropCount() {
        return dropCount;
    }

    public void setDropCount(int dropCount) {
        this.dropCount = dropCount;
    }

    public int getFromFlask() {
        return fromFlask;
    }

    public int getToFlask() {
        return toFlask;
    }

    public Drop getDrop() {
        return drop;
    }

    public Move getParent() {
        return parentMove;
    }

    @Override
    public String toString() {
        return "(" + fromFlask + "->" + toFlask + ")";
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Move that)) return false;
        return this.fromFlask == that.fromFlask && this.toFlask == that.toFlask &&
                this.drop.equals(that.drop);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fromFlask, toFlask, drop, parentMove);
    }
}
