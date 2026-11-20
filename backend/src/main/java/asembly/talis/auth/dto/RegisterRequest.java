package asembly.talis.auth.dto;

import asembly.talis.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "{validation.nickname.notblank}") @Size(min = 4, max = 30, message = "{validation.nickname.size}") String nickname,

        @NotBlank(message = "{validation.email.notblank}") @Email(message = "{validation.email.invalid}") String email,

        @NotBlank(message = "{validation.password.notblank}") @Size(min = 8, max = 72, message = "{validation.password.size}") String password,

        @NotNull(message = "{validation.role.notnull}") Role role) {
}
