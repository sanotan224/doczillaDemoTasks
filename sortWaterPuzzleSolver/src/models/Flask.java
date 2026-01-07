package models;

import java.util.ArrayList;
import java.util.List;

public class Flask {
    private final int maxDropSize;
    private final List<Drop> drops;

    public Flask(Integer maxDropSize) {
        this.drops = new ArrayList<>();
        this.maxDropSize = maxDropSize;
    }

    public boolean isFull() {
        return this.drops.size() == maxDropSize;
    }

    public boolean isEmpty() {
        return this.drops.isEmpty();
    }

    public boolean isFilledCorrectly() {
        if (this.drops.isEmpty()) {
            return true;
        }
        Drop first = this.drops.get(0);
        for (int i = 1; i < this.drops.size(); i++) {
            if (!first.equals(this.drops.get(i))) {
                return false;
            }
        }
        return this.isFull();
    }

    public Drop getLastDrop() {
        return this.isEmpty() ? null : this.drops.get(this.drops.size() - 1);
    }

    public void fillDropForInitialGameState(Drop drop) {
        if (!this.isFull()) {
            this.drops.add(drop);
        }
    }

    public boolean canFillDrop(Drop drop) {
        if (this.isFull()) {
            return false;
        }
        if (isEmpty() && this.maxDropSize > 0) {
            return true;
        }
        return this.getLastDrop().equals(drop);
    }

    public void fill(Drop drop) {
        if (this.isFull()) {
            throw new RuntimeException("Flask is full");
        }
        drops.add(drop);
    }

    public Drop pollLast() {
        if (this.isEmpty()) {
            throw new RuntimeException("Flask is empty");
        }
        return this.drops.remove(this.drops.size() - 1);
    }

    @Override
    public String toString() {
        return "(" + String.join(";", drops.stream().map(Drop::toString).toArray(String[]::new)) + ")";
    }
}
