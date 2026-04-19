package BillingSystem.Project.ExceptionHandler;

public class MethodInputNotValid extends RuntimeException {
    public MethodInputNotValid(String message) {
        super(message);
    }
}
