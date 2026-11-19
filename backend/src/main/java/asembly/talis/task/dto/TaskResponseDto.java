package asembly.talis.task.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import asembly.talis.common.enums.Difficulty;
import asembly.talis.common.enums.StatusTask;

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
        BigDecimal potentialXp,
        List<Long> tagsId) {
}
