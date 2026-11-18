package asembly.talis.common.exception;

import org.springframework.http.HttpStatus;

/**
 * DomainException
 */
public class DomainException extends RuntimeException {
    private final HttpStatus status;
    private final String code;

    protected DomainException(String message, HttpStatus status, String code) {
        super(message);
        this.status = status;
        this.code = code;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }
}
