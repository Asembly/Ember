package asembly.talis.attribute;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * AttributeRepository
 */
@Repository
public interface AttributeRepository extends JpaRepository<Attribute, Long> {

}
