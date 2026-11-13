package asembly.ember.task.dto;

import java.time.LocalDateTime;
import java.util.List;

import asembly.ember.common.enums.Difficulty;

/**
 * CreateTaskDto
 */
public record CreateTaskDto(String name, String description, LocalDateTime deadline, LocalDateTime scheduledAt,
        List<Long> tagsId, Difficulty difficulty, Long actionId, Long profileId) {
}
