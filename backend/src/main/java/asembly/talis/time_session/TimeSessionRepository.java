package asembly.talis.time_session;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * TimeSessionRepository
 */
@Repository
public interface TimeSessionRepository extends JpaRepository<TimeSession, Long> {

    @Query("SELECT s FROM TimeSession s WHERE s.task.id = :taskId AND s.endTime IS NULL")
    Optional<TimeSession> findActiveSession(Long taskId);

    @Query("SELECT s FROM TimeSession s JOIN s.task t where t.profile.id = :profileId ORDER BY s.endTime DESC")
    List<TimeSession> findAllByProfileId(Long profileId);

}
