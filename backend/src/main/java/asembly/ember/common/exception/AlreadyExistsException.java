package asembly.ember.common.exception;

import org.springframework.http.HttpStatus;

public class AlreadyExistsException extends DomainException {
    public AlreadyExistsException(String entity, String field, Object value) {
        super("%s with %s '%s' already exists".formatted(entity, field, value),
                HttpStatus.CONFLICT, "ALREADY_EXISTS");
    }
}
