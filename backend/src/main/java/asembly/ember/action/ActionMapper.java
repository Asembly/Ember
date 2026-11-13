package asembly.ember.action;

import org.mapstruct.Mapper;

import asembly.ember.action.dto.ActionResponseDto;

/**
 * ActionMapper
 */

@Mapper(componentModel = "spring")
public interface ActionMapper {

    ActionResponseDto toActionResponseDto(Action action);
}
