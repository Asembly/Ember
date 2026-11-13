package asembly.ember.user.dto;

public record ChangePasswordRequest(
        String currentPassword,
        String newPassword,
        String confirmationPassword) {
}
