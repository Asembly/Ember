package asembly.talis.task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import asembly.talis.common.enums.StatusTask;

/**
 * TaskRepository
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("select t from Task t where t.profile.id = :profileId and t.status = :status")
    public List<Task> findAllByProfileIdAndStatus(Long profileId, StatusTask status);

    @Query("select t from Task t where t.profile.id = :profileId")
    public List<Task> findAllByProfileId(Long profileId);

    long countByProfileIdAndStatus(Long profileId, StatusTask status);

}
