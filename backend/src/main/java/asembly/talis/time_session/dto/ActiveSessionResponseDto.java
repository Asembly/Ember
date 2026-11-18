package asembly.talis.time_session.dto;

import java.time.Instant;

/**
 * ActiveSessionResponseDto
 */
public record ActiveSessionResponseDto(Long sessionId, Long taskId, Instant startedAt) {
}
