package asembly.ember.profile.profile_achievements;

import java.math.BigDecimal;

import asembly.ember.achievement.Achievement;
import asembly.ember.common.BaseEntity;
import asembly.ember.profile.Profile;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * ProfileAchievements
 */
@Entity
@Table
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class ProfileAchievements extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "profile_id")
    private Profile profile;

    @ManyToOne
    @JoinColumn(name = "achievement_id")
    private Achievement achievement;

    @Builder.Default
    private BigDecimal progress = BigDecimal.ZERO;
}
