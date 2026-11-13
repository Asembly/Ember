package asembly.ember.time_session.dto;

import java.time.LocalDateTime;

/**
 * TimeSessionResponseDto
 */
public record TimeSessionResponseDto(Long id, LocalDateTime createdAt, LocalDateTime endTime, Long durationInMin) {
}
