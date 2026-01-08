package exceptions;

public class TakeFromEmptyFlaskException extends RuntimeException {
    public TakeFromEmptyFlaskException(String message) {
        super(message);
    }
}
