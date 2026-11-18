package asembly.talis.action;

import org.mapstruct.Mapper;

import asembly.talis.action.dto.ActionResponseDto;

/**
 * ActionMapper
 */

@Mapper(componentModel = "spring")
public interface ActionMapper {

    ActionResponseDto toActionResponseDto(Action action);
}
