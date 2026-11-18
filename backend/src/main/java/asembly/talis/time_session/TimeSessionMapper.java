package asembly.talis.time_session;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import asembly.talis.time_session.dto.ActiveSessionResponseDto;
import asembly.talis.time_session.dto.TimeSessionResponseDto;

/**
 * TimeSessionMapper
 */
@Mapper(componentModel = "spring")
public interface TimeSessionMapper {
    TimeSessionResponseDto toTimeSessionResponse(TimeSession timeSession);

    @Mapping(target = "sessionId", source = "timeSession.id")
    @Mapping(target = "taskId", source = "timeSession.task.id")
    @Mapping(target = "startedAt", source = "timeSession.createdAt")
    ActiveSessionResponseDto toActiveSessionResponseDto(ActiveSession activeSession);

    default Instant toInstant(LocalDateTime value) {
        return value == null ? null : value.atZone(ZoneId.systemDefault()).toInstant();
    }
}
