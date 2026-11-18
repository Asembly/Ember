package asembly.talis.action;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * ActionRepository
 */
@Repository
public interface ActionRepository extends JpaRepository<Action, Long> {

    @Query("SELECT a FROM Action a WHERE a.name = :name")
    Optional<Action> findByTitle(String name);
}
