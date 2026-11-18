package asembly.talis.action.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Set;

public record CreateActionDto(
        @NotBlank(message = "Name cannot be empty") String name,

        @NotBlank(message = "Description cannot be empty") String description,

        @NotEmpty(message = "Action must affect at least one attribute") @Valid Set<AttributeWeightDto> attributes) {
    public record AttributeWeightDto(
            @NotNull(message = "Attribute ID is required") @Positive(message = "Attribute ID must be positive") Long attributeId,

            @NotNull(message = "Weight is required") @DecimalMin(value = "0.01", message = "Weight must be greater than 0") @DecimalMax(value = "1.0", message = "Weight cannot exceed 1.0") BigDecimal weight) {
    }
}
