package asembly.talis.tag.dto;

import asembly.talis.common.enums.Color;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * CreateTagDto
 */
public record CreateTagDto(
        @NotNull(message = "{validation.profileId.notnull}") Long profileId,
        @NotEmpty(message = "{validation.name.notempty}") @Size(max = 50, message = "{validation.tag.name.size}") String name,
        @Size(max = 250, message = "{validation.description.size}") String description,
        @NotNull(message = "{validation.color.notnull}") Color color) {
}
