package asembly.ember.gamification;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import asembly.ember.common.exception.NotFoundException;
import asembly.ember.task.Task;
import jakarta.transaction.Transactional;

/**
 * XpService
 */
@Service
public class XpService {

    @Transactional
    public void reward(Task task, double difficulty, long duration) {
        var action = task.getAction();
        var actionAttributes = action.getActionAttributes();

        var profile = task.getProfile();

        BigDecimal profileXp = BigDecimal.ZERO;
        for (var item : actionAttributes) {
            var attribute = item.getAttribute();
            var weight = item.getWeight();

            var baseXp = action.getBaseXp();

            var map = profile.getAttributesAsMap();
            if (!map.containsKey(attribute.getName()))
                throw new NotFoundException("Attribute", "name", attribute.getName());

            var pa = map.get(attribute.getName());
            var xp = baseXp
                    .multiply(attribute.getLevelCoefficient())
                    .multiply(BigDecimal.valueOf(difficulty))
                    .multiply(BigDecimal.valueOf(duration))
                    .multiply(weight);

            profileXp = profileXp.add(xp.divide(baseXp));

            pa.addExperience(xp);
        }

        profile.addExperience(profileXp);
    }
}
