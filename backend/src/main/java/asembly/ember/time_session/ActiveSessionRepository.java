package asembly.ember.time_session;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * ActiveSessionRepository
 */
@Repository
public interface ActiveSessionRepository extends JpaRepository<ActiveSession, Long> {

    Optional<ActiveSession> findByProfileId(Long profileId);

    void deleteByTimeSessionId(Long timeSessionId);

}
