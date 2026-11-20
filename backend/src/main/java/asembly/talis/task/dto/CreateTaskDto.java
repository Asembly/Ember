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

        @NotEmpty(message = "{validation.name.notempty}") @Size(max = 100, message = "{validation.name.size}") String name,
        @Size(max = 500, message = "{validation.description.size}") String description,
        @Future(message = "{validation.deadline.future}") LocalDateTime deadline,
        @FutureOrPresent(message = "{validation.scheduledAt.futureOrPresent}") LocalDateTime scheduledAt,
        List<Long> tagsId,
        @NotNull(message = "{validation.difficulty.notnull}") Difficulty difficulty,
        @NotNull(message = "{validation.actionId.notnull}") @Positive(message = "{validation.actionId.positive}") Long actionId,
        @NotNull(message = "{validation.profileId.notnull}") @Positive(message = "{validation.profileId.positive}") Long profileId) {
}
