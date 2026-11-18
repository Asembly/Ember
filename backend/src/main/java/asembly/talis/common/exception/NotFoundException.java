package asembly.talis.common.exception;

import org.springframework.http.HttpStatus;

public class NotFoundException extends DomainException {
    public NotFoundException(String entity, String field, Object value) {
        super("%s with %s '%s' not found".formatted(entity, field, value),
                HttpStatus.CONFLICT, "NOT FOUND");
    }
}
