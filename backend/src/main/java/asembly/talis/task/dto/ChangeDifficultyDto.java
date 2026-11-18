package asembly.talis.task.dto;

import asembly.talis.common.enums.Difficulty;
import jakarta.validation.constraints.NotNull;

/**
 * ChangeDifficultyDto
 */
public record ChangeDifficultyDto(
        @NotNull(message = "Сложность обязательна") Difficulty difficulty,
        @NotNull(message = "Задача обязательна") Long id) {
}
