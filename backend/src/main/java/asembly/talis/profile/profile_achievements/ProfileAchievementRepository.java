package asembly.talis.profile.profile_achievements;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * ProfileAchievementRepository
 */
@Repository
public interface ProfileAchievementRepository extends JpaRepository<ProfileAchievements, Long> {

    @Query("select pa from ProfileAchievements pa where pa.profile.id = :profileId and pa.achievement.id = :achievId")
    public Optional<ProfileAchievements> findProgress(Long profileId, Long achievId);

}
