package asembly.talis.task.dto;

import asembly.talis.common.enums.Difficulty;

/**
 * ChangeDifficultyDto
 */
public record ChangeDifficultyDto(Difficulty difficulty, Long id) {
}
