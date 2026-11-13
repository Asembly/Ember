package asembly.ember.time_session;

import org.mapstruct.Mapper;

import asembly.ember.time_session.dto.TimeSessionResponseDto;

/**
 * TimeSessionMapper
 */
@Mapper(componentModel = "spring")
public interface TimeSessionMapper {
    TimeSessionResponseDto toTimeSessionResponse(TimeSession timeSession);
}
