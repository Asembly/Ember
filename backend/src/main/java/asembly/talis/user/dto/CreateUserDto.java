package asembly.talis.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * CreateUserDto
 */
public record CreateUserDto(
        @NotBlank(message = "Никнейм обязателен") @Size(min = 4, max = 30, message = "Никнейм должен быть от 2 до 30 символов") String nickname,
        @NotBlank(message = "Email обязателен") @Email(message = "Некорректный формат email") String email,
        @NotBlank(message = "Пароль обязателен") @Size(min = 8, max = 72, message = "Пароль должен быть от 8 до 100 символов") String password) {
}
