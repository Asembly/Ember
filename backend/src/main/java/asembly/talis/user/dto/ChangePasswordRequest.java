package asembly.talis.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank(message = "{validation.currentPassword.notblank}") String currentPassword,
        @NotBlank(message = "{validation.newPassword.notblank}") @Size(min = 8, max = 72, message = "{validation.newPassword.size}") String newPassword,
        @NotBlank(message = "{validation.confirmationPassword.notblank}") String confirmationPassword) {
}
