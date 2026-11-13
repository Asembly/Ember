package asembly.ember.user;

import org.mapstruct.Mapper;

import asembly.ember.user.dto.UserResponse;

/**
 * UserMapper
 */
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toUserResponse(User user);
}
