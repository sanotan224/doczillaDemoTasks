import models.GameSolver;

public class SortColorPuzzle {
    public static void main(String[] args) {
        run(new GameSolver(
                new Object[][]{
                        {4, 4, 10, "Two"},
                        {8, 12, 8, "One"},
                        {9, 5, 7, 10},
                        {5, "Two", 3, 5},
                        {7, 8, 11, 6},
                        {"Two", "One", 12, 12},
                        {11, 8, 7, 4},
                        {"One", 3, 11, 10},
                        {9, 9, 7, 10},
                        {11, 6, "Two", 6},
                        {3, 9, 6, 4},
                        {"One", 12, 3, 5},
                        {},
                        {}
                }, 4
        ));
    }

    private static void run(GameSolver gameSolver) {
        gameSolver.solvePuzzle();
    }
}