package asembly.talis.profile;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * ProfileRepository
 */
@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    @Query("SELECT p FROM Profile p ORDER BY p.level DESC, p.currentXp DESC")
    public List<Profile> findAllByLevel(Pageable pageable);

    @Query("SELECT p from Profile p WHERE p.user.id = :userId")
    public Optional<Profile> findByUserId(Long userId);
}
