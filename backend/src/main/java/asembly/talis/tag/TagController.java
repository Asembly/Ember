package asembly.talis.tag;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import asembly.talis.tag.dto.CreateTagDto;
import asembly.talis.tag.dto.TagResponseDto;

/**
 * TagController
 */
@RestController
@RequestMapping("/tag")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping("/create")
    public ResponseEntity<TagResponseDto> create(@RequestBody CreateTagDto dto) {
        return ResponseEntity.ok(tagService.create(dto));
    }

    @GetMapping("/get")
    public ResponseEntity<List<TagResponseDto>> getAll() {
        return ResponseEntity.ok(tagService.getAll());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<TagResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tagService.getById(id));
    }
}
