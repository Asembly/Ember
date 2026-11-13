
package asembly.ember.common.registry;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import asembly.ember.achievement.Achievement;
import asembly.ember.achievement.AchievementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * AchievementRegistry
 */

@Component
@RequiredArgsConstructor
@Slf4j
public class AchievementRegistry extends AbstractInMemoryRegistry<Achievement, Long> implements ApplicationRunner {

    private final AchievementRepository achievementRepository;

    @Override
    public void run(ApplicationArguments args) {
        registryAll(achievementRepository.findAll());
        log.info("AchievementRegistry: registered {} entities", getAll().size());
    }

    @Override
    protected Long extractId(Achievement entity) {
        return entity.getId();
    }

    @Override
    protected String getRegistryName() {
        return "AchievementRegistry";
    }

    public Achievement getByName(String name) {
        return getAll().stream()
                .filter(a -> a.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown achievement: " + name));
    }

    public boolean containsByName(String name) {
        if (name == null)
            return false;

        return getAll().stream()
                .anyMatch(a -> name.equalsIgnoreCase(a.getName()));
    }

}
