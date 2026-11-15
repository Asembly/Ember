package asembly.ember.profile;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * ProfileRepository
 */
@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    @Query("select p from Profile p order by p.level desc, p.currentXp desc")
    public List<Profile> findAllByLevel(Pageable pageable);
}
