package BillingSystem.Project.ExceptionHandler;

public class ErrorResponce {
    String message;
    String code;
    Long timestamp;

    public ErrorResponce() {
    }

    public ErrorResponce(String message, String productNotFound) {
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
