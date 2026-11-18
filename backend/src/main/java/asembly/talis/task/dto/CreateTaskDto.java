package asembly.talis.task.dto;

import java.time.LocalDateTime;
import java.util.List;

import asembly.talis.common.enums.Difficulty;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * CreateTaskDto
 */
public record CreateTaskDto(

        @NotEmpty(message = "Название обязательно") @Size(max = 100, message = "Название слишком большое") String name,
        @Size(max = 500, message = "Описание слишком большое") String description,
        @Future(message = "Дедлайн должен быть в будущем") LocalDateTime deadline,
        @FutureOrPresent(message = "Запланированная дата не должна быть в прошлом") LocalDateTime scheduledAt,
        List<Long> tagsId,
        @NotNull(message = "Сложность обязательна") Difficulty difficulty,
        @NotNull(message = "Действие обязательно") @Positive Long actionId,
        @NotNull(message = "Профиль обязателен") @Positive Long profileId) {
}
