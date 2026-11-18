package asembly.talis.profile;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import asembly.talis.profile.dto.ProfileResponseDto;

/**
 * ProfileMapper
 */
@Mapper(componentModel = "spring")
public interface ProfileMapper {
    @Mapping(source = "user.nickname", target = "nickname")
    ProfileResponseDto toProfileResponseDto(Profile profile);
}
