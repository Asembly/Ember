package asembly.talis.task.dto;

import java.time.LocalDateTime;
import java.util.List;

import asembly.talis.common.enums.Difficulty;

/**
 * CreateTaskDto
 */
public record CreateTaskDto(String name, String description, LocalDateTime deadline, LocalDateTime scheduledAt,
        List<Long> tagsId, Difficulty difficulty, Long actionId, Long profileId) {
}
