package asembly.ember.time_session;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import asembly.ember.time_session.dto.TimeSessionResponseDto;

/**
 * TimeSessionController
 */

@RestController
@RequestMapping("session")
public class TimeSessionController {

    private final TimeSessionService sessionService;

    public TimeSessionController(TimeSessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping("/get")
    public ResponseEntity<List<TimeSessionResponseDto>> getAll() {
        return ResponseEntity.ok(sessionService.getAll());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<TimeSessionResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getById(id));
    }

}
