package asembly.talis.profile.profile_achievements;

import org.springframework.stereotype.Service;

import asembly.talis.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileAchievementService {
    private final ProfileAchievementRepository paRepository;

    public ProfileAchievements getProgress(Long profileId, Long achievId) {
        return paRepository.findProgress(profileId, achievId).orElseThrow(
                () -> new NotFoundException("ProfileAchievements", "id",
                        "profileId: " + profileId +
                                "\nachievementId: " + achievId));

    }

}
