package asembly.ember.tag;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import asembly.ember.tag.dto.TagResponseDto;

/**
 * TaskMapper
 */
@Mapper(componentModel = "spring")
public interface TagMapper {
    @Mapping(source = "profile.id", target = "profileId")
    TagResponseDto toTagResponse(Tag tag);
}
