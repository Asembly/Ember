package asembly.talis.tag.dto;

import asembly.talis.common.enums.Color;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * CreateTagDto
 */
public record CreateTagDto(
        @NotNull(message = "Профиль обязателен") Long profileId,
        @NotEmpty(message = "Название обязательно") @Size(max = 50, message = "Название слишком большое") String name,
        @Size(max = 500, message = "Описание слишком большое") String description,
        Color color) {

}
