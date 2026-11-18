package asembly.talis.user;

import java.security.Principal;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import asembly.talis.common.exception.AlreadyExistsException;
import asembly.talis.common.exception.NotFoundException;
import asembly.talis.profile.ProfileService;
import asembly.talis.user.dto.ChangePasswordRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * UserService
 */
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final ProfileService profileService;

    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;

    public User create(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new AlreadyExistsException("User", "email", user.getEmail());
        }
        if (userRepository.findByNickname(user.getNickname()).isPresent()) {
            throw new AlreadyExistsException("User", "nickname", user.getNickname());
        }

        var savedUser = userRepository.save(user);

        profileService.create(savedUser.getId());

        return savedUser;
    }

    public User getEntityByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(
                () -> new NotFoundException("User", "email", email));
    }

    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        if (!request.newPassword().equals(request.currentPassword())) {
            throw new IllegalStateException("Password are not the same");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        repository.save(user);
    }

}
