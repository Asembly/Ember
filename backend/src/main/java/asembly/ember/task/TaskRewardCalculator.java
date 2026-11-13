package asembly.ember.task;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Component;

/**
 * TaskRewardCalculator
 */
@Component
public class TaskRewardCalculator {

    public BigDecimal calculatePotentialXp(Task task) {
        if (task.getAction() == null || task.getAction().getBaseXp() == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal baseXp = task.getAction().getBaseXp();
        BigDecimal multiplier = BigDecimal.valueOf(task.getDifficulty().getMultiplier());

        return baseXp.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
    }

}
