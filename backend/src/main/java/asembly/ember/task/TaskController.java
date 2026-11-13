package asembly.ember.task;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import asembly.ember.task.dto.ChangeDifficultyDto;
import asembly.ember.task.dto.CreateTaskDto;
import asembly.ember.task.dto.TaskResponseDto;
import asembly.ember.time_session.dto.TimeSessionResponseDto;

/**
 * TaskController
 */
@RestController
@RequestMapping("task")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/get")
    public ResponseEntity<List<TaskResponseDto>> getAll() {
        return ResponseEntity.ok(taskService.getAll());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<TaskResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<TaskResponseDto> create(@RequestBody CreateTaskDto dto) {
        return ResponseEntity.ok(taskService.create(dto));
    }

    @PatchMapping("/{id}/status/done")
    public ResponseEntity<TaskResponseDto> done(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.done(id));
    }

    @PatchMapping("/{id}/status/cancel")
    public ResponseEntity<TaskResponseDto> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.cancel(id));
    }

    @PostMapping("/{id}/timer/start")
    public ResponseEntity<TimeSessionResponseDto> startSession(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.startSession(id));
    }

    @PatchMapping("/{id}/timer/stop")
    public ResponseEntity<TimeSessionResponseDto> stopSession(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.stopSession(id));
    }

    @PatchMapping("/{id}/difficulty")
    public ResponseEntity<TaskResponseDto> changeDifficulty(@RequestBody ChangeDifficultyDto dto) {
        return ResponseEntity.ok(taskService.changeDifficulty(dto));
    }

    @GetMapping("/get/profile/{profileId}")
    public ResponseEntity<List<TaskResponseDto>> getByProfileId(@PathVariable Long profileId) {
        return ResponseEntity.ok(taskService.getAllByProfileId(profileId));
    }

}
