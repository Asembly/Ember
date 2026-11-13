package asembly.ember.common;

import java.math.BigDecimal;

import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@MappedSuperclass
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class LevelEntity extends BaseEntity {

    @Builder.Default
    private BigDecimal currentXp = BigDecimal.ZERO;

    @Builder.Default
    private Integer level = 1;

    @Builder.Default
    private BigDecimal nextLevelUp = new BigDecimal(100);

    public void addExperience(BigDecimal xp) {
        currentXp = currentXp.add(xp);

        while (currentXp.compareTo(nextLevelUp) >= 0) {
            currentXp = currentXp.subtract(nextLevelUp);
            level++;
            nextLevelUp = nextLevelUp.multiply(BigDecimal.valueOf(1.2));
        }
    }
}
