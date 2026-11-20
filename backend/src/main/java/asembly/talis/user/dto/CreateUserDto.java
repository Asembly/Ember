package asembly.talis.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * CreateUserDto
 */
public record CreateUserDto(
        @NotBlank(message = "{validation.nickname.notblank}") @Size(min = 4, max = 30, message = "{validation.nickname.size}") String nickname,
        @NotBlank(message = "{validation.email.notblank}") @Email(message = "{validation.email.invalid}") String email,
        @NotBlank(message = "{validation.password.notblank}") @Size(min = 8, max = 72, message = "{validation.password.size}") String password) {
}
