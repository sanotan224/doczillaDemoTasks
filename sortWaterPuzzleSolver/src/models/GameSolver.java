package models;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class GameSolver {

    private final List<Flask> flasks;

    public GameSolver(Object[][] flasks, int capacity) {
        if (capacity <= 0) {
            throw new RuntimeException("Capacity should be greater than 0");
        }
        this.flasks = new ArrayList<>();

        for (Object[] flask : flasks) {
            Flask fillingFlask = new Flask(capacity);
            for (Object color : flask) {
                Drop drop;
                if (color instanceof Integer) {
                    drop = new Drop(new Color((Integer) color));
                }
                else if (color instanceof String || color instanceof Character) {
                    drop = new Drop(new Color(color.toString()));
                }
                else {
                    throw new RuntimeException("Wrong models.Color instance");
                }
                fillingFlask.fillDropForInitialGameState(drop);
            }
            this.flasks.add(fillingFlask);
        }
    }

    public void solvePuzzle() {
        System.out.println("Initial state:" + this);

        Set<String> visited = new LinkedHashSet<>();
        Move nextMove = canSolve(null, visited, 0);

        if (nextMove != null || isSolved()) {
            System.out.print("Found solution: ");
            List<Move> movesHistory = new ArrayList<>();

            while (nextMove != null) {
                movesHistory.add(nextMove);
                nextMove = nextMove.getParent();
            }

            System.out.println("Need " + movesHistory.size() + " moves");
            for (int i = movesHistory.size() - 1; i >= 0; --i) {
                System.out.println(movesHistory.get(i) + " ");
            }
            System.out.println("Final state:" + this);
        } else {
            System.out.println("No solution found!");
        }
    }

    private Move canSolve(Move root, Set<String> visitedStates, int depth) {
        int MAX_DEATH = 100;
        if (depth > MAX_DEATH) {
            return null;
        }

        String flasksState = flasks.stream().map(String::valueOf).collect(Collectors.joining(", "));

        if (isSolved()) {
            visitedStates.add(flasksState);
            return root;
        }

        if (visitedStates.contains(flasksState)) {
            return null;
        }

        visitedStates.add(flasksState);

        List<Move> availableMoves = this.getAvailableMoves(root);

        for (Move move : availableMoves) {
            this.commitMove(move);

            Move lastMove = canSolve(move, visitedStates, depth + 1);
            if (lastMove != null) {
                return lastMove;
            }
            else {
                this.rollbackMove(move);
            }
        }
        return null;
    }

    private boolean isSolved() {
        return this.flasks.stream().allMatch(Flask::isFilledCorrectly);
    }

    private List<Move> getAvailableMoves(Move parent) {
        List<Move> moves = new ArrayList<>();

        for (int i = 0; i < flasks.size(); i++) {
            Flask g = flasks.get(i);
            if (g.isEmpty()) {
                continue;
            }
            for (int j = 0; j < flasks.size(); j++) {
                if (i == j) {
                    continue;
                }
                Flask f = flasks.get(j);
                if (f.isFull()) {
                    continue;
                }
                if (f.isEmpty() || g.getLastDrop().equals(f.getLastDrop())) {
                    moves.add(new Move(i, j, g.getLastDrop(), parent));
                }
            }
        }
        return moves;
    }

    private void commitMove(Move m) {
        Flask from = flasks.get(m.getFromFlask());
        Flask to = flasks.get(m.getToFlask());
        int dropCount = 0;

        while (!from.isEmpty() && to.canFillDrop(from.getLastDrop())) {
            to.fill(from.pollLast());
            dropCount++;
        }

        m.setDropCount(dropCount);
    }

    private void rollbackMove(Move m) {
        Flask from = flasks.get(m.getFromFlask());
        Flask to = flasks.get(m.getToFlask());

        int dropCount = m.getDropCount();
        Drop color = m.getDrop();

        while (dropCount > 0 && !to.isEmpty() && to.getLastDrop().equals(color)) {
            from.fill(to.pollLast());
            dropCount--;
        }
    }

    @Override
    public String toString() {
        return "[\n\t" + flasks.stream().map(Flask::toString).collect(Collectors.joining("\n\t")) + "\n]";
    }
}
