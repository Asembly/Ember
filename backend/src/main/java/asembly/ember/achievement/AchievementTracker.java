package asembly.ember.achievement;

import java.math.BigDecimal;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import asembly.ember.common.enums.StatusTask;
import asembly.ember.common.events.ProfileLevelUpEvent;
import asembly.ember.common.events.TaskCompletedEvent;
import asembly.ember.common.exception.NotFoundException;
import asembly.ember.common.registry.AchievementRegistry;
import asembly.ember.profile.profile_achievements.ProfileAchievementService;
import asembly.ember.task.TaskService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * AchievementTracker
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AchievementTracker {

    private final AchievementRegistry achievRegistry;
    private final ProfileAchievementService paService;
    private final TaskService taskService;

    @EventListener
    public void onTaskCompleted(TaskCompletedEvent event) {

        checkAchievement(event.profileId(), "FIRST_BLOOD", BigDecimal.ONE);

        var totalCompleted = taskService.getCountByStatus(event.profileId(), StatusTask.DONE);

        checkAchievement(event.profileId(), "WORKAHOLIC", BigDecimal.valueOf(totalCompleted));
        checkAchievement(event.profileId(), "LEGEND", BigDecimal.valueOf(totalCompleted));
    }

    @EventListener
    public void onProfileLevelUp(ProfileLevelUpEvent event) {
        var profile = event.profile();
        checkAchievement(profile.getId(), "BEGINNER", profile.getCurrentXp());
        checkAchievement(profile.getId(), "VETERAN", profile.getCurrentXp());
        checkAchievement(profile.getId(), "MASTER", profile.getCurrentXp());
    }

    public void checkAchievement(Long profileId, String name, BigDecimal currentValue) {
        if (!achievRegistry.containsByName(name)) {
            throw new NotFoundException("Achievement", "name", name);
        }

        var achievement = achievRegistry.getByName(name);
        var pa = paService.getProgress(profileId, achievement.getId());
        if (pa.getProgress().compareTo(achievement.getNeedToAchieve()) >= 0)
            return;

        pa.setProgress(currentValue);

        if (pa.getProgress().compareTo(achievement.getNeedToAchieve()) >= 0) {
            log.info("Achievement {} unlocked for profile {}", name, profileId);
        }
    }

}
