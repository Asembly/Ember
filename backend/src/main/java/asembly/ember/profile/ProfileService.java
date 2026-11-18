package asembly.ember.profile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import asembly.ember.common.exception.NotFoundException;
import asembly.ember.common.registry.AchievementRegistry;
import asembly.ember.common.registry.AttributeRegistry;
import asembly.ember.profile.dto.ProfileResponseDto;
import asembly.ember.user.UserRepository;
import lombok.RequiredArgsConstructor;

/**
 * ProfileService
 */
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final ProfileMapper profileMapper;
    private final AttributeRegistry attributeRegistry;
    private final AchievementRegistry achievementRegistry;

    @Transactional
    public ProfileResponseDto create(Long userId) {

        var findUser = userRepository.findById(userId);

        if (!findUser.isPresent())
            throw new NotFoundException("user", "id", userId);

        var profile = Profile.builder()
                .createdAt(LocalDateTime.now())
                .user(findUser.get())
                .build();

        for (var attribute : attributeRegistry.getAll()) {
            profile.addAttribute(attribute);
        }

        for (var achievement : achievementRegistry.getAll()) {
            profile.addAchievement(achievement);
        }

        profileRepository.save(profile);

        return profileMapper.toProfileResponseDto(profile);
    }

    @Transactional(readOnly = true)
    public ProfileResponseDto getById(Long id) {
        var profile = profileRepository.findById(id).orElseThrow(
                () -> new NotFoundException("profile", "id", id));

        return profileMapper.toProfileResponseDto(profile);
    }

    public Profile getEntityById(Long id) {
        return profileRepository.findById(id).orElseThrow(
                () -> new NotFoundException("profile", "id", id));
    }

    @Transactional(readOnly = true)
    public List<ProfileResponseDto> getAll() {
        var profiles = profileRepository.findAll();

        List<ProfileResponseDto> responseProfiles = new ArrayList<>();
        for (var profile : profiles)
            responseProfiles.add(profileMapper.toProfileResponseDto(profile));

        return responseProfiles;
    }

    @Transactional(readOnly = true)
    public Profile getReferenceById(Long id) {
        return profileRepository.getReferenceById(id);
    }

    public List<ProfileResponseDto> getLeaderBoard(Integer page, Integer size) {
        Pageable top = PageRequest.of(page, size);
        var profiles = profileRepository.findAllByLevel(top);

        List<ProfileResponseDto> response = new ArrayList<>();
        for (var p : profiles) {
            response.add(profileMapper.toProfileResponseDto(p));
        }

        return response;
    }

    public ProfileResponseDto getByUserId(Long userId) {
        var profile = profileRepository.findByUserId(userId).orElseThrow(
                () -> new NotFoundException("profile", "userId", userId));

        return profileMapper.toProfileResponseDto(profile);
    }

    public boolean existsById(Long id) {
        return profileRepository.existsById(id);
    }
}
