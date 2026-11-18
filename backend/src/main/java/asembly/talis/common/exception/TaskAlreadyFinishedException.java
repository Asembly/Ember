package asembly.talis.common.exception;

import org.springframework.http.HttpStatus;

public class TaskAlreadyFinishedException extends DomainException {
    public TaskAlreadyFinishedException(String entity, String field, Object value) {
        super("%s with %s '%s' already exists".formatted(entity, field, value),
                HttpStatus.CONFLICT, "ALREADY_FINISHED");
    }
}
