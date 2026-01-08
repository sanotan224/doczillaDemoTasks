package exceptions;

public class WrongCapacityValueException extends RuntimeException {
    public WrongCapacityValueException(String message) {
        super(message);
    }
}
