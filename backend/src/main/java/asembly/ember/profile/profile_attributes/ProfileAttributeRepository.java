package asembly.ember.profile.profile_attributes;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * ProfileAttributeRepository
 */
@Repository
public interface ProfileAttributeRepository extends JpaRepository<ProfileAttributes, Long> {

    @Query("SELECT pa FROM ProfileAttributes pa where pa.profile.id = :profileId")
    public List<ProfileAttributes> findAttributesByProfileId(Long profileId);

}
