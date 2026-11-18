package asembly.talis.profile.dto;

import jakarta.validation.constraints.NotNull;

/**
 * CreateProfileDto
 */
public record CreateProfileDto(
        @NotNull(message = "Пользователен обязателен") Long userId) {
}
