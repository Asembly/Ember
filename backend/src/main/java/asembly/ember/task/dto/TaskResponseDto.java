package asembly.ember.task.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import asembly.ember.common.enums.Difficulty;
import asembly.ember.common.enums.StatusTask;

/**
 * TaskResponseDto
 */
public record TaskResponseDto(
        Long id,
        String name,
        String description,
        StatusTask status,
        Difficulty difficulty,
        LocalDateTime createdAt,
        LocalDateTime deadline,
        LocalDateTime finishedAt,
        LocalDateTime scheduledAt,
        BigDecimal potentialXp) {
}
