package asembly.talis.action;

import org.springframework.web.bind.annotation.*;

import asembly.talis.action.dto.ActionResponseDto;
import asembly.talis.action.dto.CreateActionDto;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("action")
@RequiredArgsConstructor
public class ActionController {

    private final ActionService actionService;

    @PostMapping("/create")
    public ResponseEntity<ActionResponseDto> create(@Valid @RequestBody CreateActionDto dto) {
        return ResponseEntity.ok(actionService.create(dto));
    }

    @GetMapping("/get")
    public ResponseEntity<List<ActionResponseDto>> getAll() {
        return ResponseEntity.ok(actionService.getAll());
    }
}
