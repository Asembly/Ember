package asembly.ember.profile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import asembly.ember.achievement.Achievement;
import asembly.ember.attribute.Attribute;
import asembly.ember.common.LevelEntity;
import asembly.ember.profile.profile_achievements.ProfileAchievements;
import asembly.ember.profile.profile_attributes.ProfileAttributes;
import asembly.ember.task.Task;
import asembly.ember.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Profile
 */
@Entity
@Table
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class Profile extends LevelEntity {

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Builder.Default
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    private List<Task> tasks = new ArrayList<Task>();

    @Builder.Default
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    private List<ProfileAttributes> profileAttributes = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    private List<ProfileAchievements> profileAchievements = new ArrayList<>();

    public void addAttribute(Attribute attribute) {
        this.profileAttributes.add(ProfileAttributes.builder()
                .attribute(attribute)
                .profile(this)
                .build());
    }

    public void addAchievement(Achievement achievement) {
        this.profileAchievements.add(ProfileAchievements.builder()
                .achievement(achievement)
                .profile(this)
                .build());
    }

    public Map<String, ProfileAttributes> getAttributesAsMap() {
        return profileAttributes.stream()
                .collect(Collectors.toMap(
                        pa -> pa.getAttribute().getName(),
                        pa -> pa,
                        (existing, replacement) -> existing));
    }

}
