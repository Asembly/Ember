package asembly.talis.profile.dto;

import jakarta.validation.constraints.NotNull;

/**
 * CreateProfileDto
 */
public record CreateProfileDto(
        @NotNull(message = "{validation.userId.notnull}") Long userId) {
}
