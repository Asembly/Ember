package asembly.talis.profile.profile_attributes;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import asembly.talis.profile.dto.StatResponseDto;

/**
 * ProfileMapper
 */
@Mapper(componentModel = "spring")
public interface ProfileAttributeMapper {
    @Mapping(source = "profile.id", target = "profileId")
    @Mapping(source = "attribute.id", target = "attributeId")
    @Mapping(source = "attribute.name", target = "name")
    StatResponseDto toStatsResponseDto(ProfileAttributes profileAttributes);
}
