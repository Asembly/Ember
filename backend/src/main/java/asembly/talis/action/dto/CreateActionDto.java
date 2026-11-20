package asembly.talis.action.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Set;

public record CreateActionDto(
        @NotEmpty(message = "{validation.name.notempty}") @Size(max = 100, message = "{validation.name.size}") String name,

        @Size(max = 500, message = "{validation.description.size}") String description,

        @NotEmpty(message = "{validation.attributes.notempty}") @Valid Set<AttributeWeightDto> attributes) {
    public record AttributeWeightDto(
            @NotNull(message = "{validation.attributeId.notnull}") @Positive(message = "{validation.attributeId.positive}") Long attributeId,

            @NotNull(message = "{validation.weight.notnull}") @DecimalMin(value = "0.01", message = "{validation.weight.min}") @DecimalMax(value = "1.0", message = "{validation.weight.max}") BigDecimal weight) {
    }
}
