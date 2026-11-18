package asembly.talis.user.dto;

public record ChangePasswordRequest(
        String currentPassword,
        String newPassword,
        String confirmationPassword) {
}
