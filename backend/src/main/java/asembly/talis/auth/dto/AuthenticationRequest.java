package asembly.talis.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthenticationRequest(
        @NotBlank(message = "{validation.email.notblank}") String email,

        @NotBlank(message = "{validation.password.notblank}") String password) {
}
