package asembly.talis.task.dto;

import asembly.talis.common.enums.Difficulty;
import jakarta.validation.constraints.NotNull;

/**
 * ChangeDifficultyDto
 */
public record ChangeDifficultyDto(
        @NotNull(message = "{validation.difficulty.notnull}") Difficulty difficulty,
        @NotNull(message = "{validation.id.notnull}") Long id) {
}
