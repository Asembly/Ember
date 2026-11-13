package asembly.ember.profile;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import asembly.ember.profile.dto.ProfileResponseDto;

/**
 * ProfileMapper
 */
@Mapper(componentModel = "spring")
public interface ProfileMapper {
    @Mapping(source = "user.nickname", target = "nickname")
    ProfileResponseDto toProfileResponseDto(Profile profile);
}
