package asembly.talis.common.exception;

import java.time.LocalDateTime;
import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * GlobalExceptionHanlder
 */
@RestControllerAdvice
public class GlobalExceptionHanlder {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<HashMap<String, Object>> handleValidationException(
            MethodArgumentNotValidException exception) {

        var errors = new HashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        var body = new HashMap<String, Object>();
        body.put("error", "Validation Failed");
        body.put("details", errors);
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());

        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<HashMap<String, Object>> handleNotFoundException(NotFoundException exception) {
        var body = new HashMap<String, Object>();
        body.put("error", "Not Found");
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("message", exception.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(TaskAlreadyFinishedException.class)
    public ResponseEntity<HashMap<String, Object>> handleTaskAlreadyFinishedException(
            TaskAlreadyFinishedException exception) {
        var body = new HashMap<String, Object>();
        body.put("error", "Task Already Finished");
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("message", exception.getMessage());
        body.put("timestamp", LocalDateTime.now());

        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(InvalidWeightSumException.class)
    public ResponseEntity<HashMap<String, Object>> handleAlreadyExistException(InvalidWeightSumException exception) {
        var body = new HashMap<String, Object>();
        body.put("error", "Invalid Weight Sum");
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("message", exception.getMessage());
        body.put("timestamp", LocalDateTime.now());

        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(AlreadyExistsException.class)
    public ResponseEntity<HashMap<String, Object>> handleAlreadyExistException(AlreadyExistsException exception) {
        var body = new HashMap<String, Object>();
        body.put("error", "Already Exist");
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("message", exception.getMessage());
        body.put("timestamp", LocalDateTime.now());

        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<HashMap<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        var response = new HashMap<String, Object>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Bad Request");
        response.put("message", ex.getMessage());

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<HashMap<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        var response = new HashMap<String, Object>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.UNAUTHORIZED.value());
        response.put("error", "Unauthorized");
        response.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<HashMap<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        var response = new HashMap<String, Object>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.FORBIDDEN.value());
        response.put("error", "Forbidden");
        response.put("message", "У вас нет прав для доступа к этому ресурсу");

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<HashMap<String, Object>> handleAllOtherExceptions(Exception ex) {
        var response = new HashMap<String, Object>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("error", "Internal Server Error");
        response.put("message", "Что-то пошло не так. Попробуйте позже.");

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
