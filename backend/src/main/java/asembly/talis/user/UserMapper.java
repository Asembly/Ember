package asembly.talis.user;

import org.mapstruct.Mapper;

import asembly.talis.user.dto.UserResponse;

/**
 * UserMapper
 */
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toUserResponse(User user);
}
