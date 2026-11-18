package asembly.talis.action.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Set;

public record CreateActionDto(
        @NotEmpty(message = "Название обязательно") @Size(max = 100, message = "Название слишком большое") String name,
        @Size(max = 500, message = "Описание слишком большое") String description,
        @NotEmpty(message = "Действие должна содержать хотя бы один атрибут") @Valid Set<AttributeWeightDto> attributes) {
    public record AttributeWeightDto(
            @NotNull(message = "Атрибут обязателен") @Positive Long attributeId,
            @NotNull(message = "Вес атрибута обязателен") @DecimalMin(value = "0.01", message = "Вес атрибута должен быть больше 0") @DecimalMax(value = "1.0", message = "Вес атрибута не должен быть больше 1") BigDecimal weight) {
    }
}
