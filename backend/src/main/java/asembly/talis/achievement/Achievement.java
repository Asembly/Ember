package asembly.talis.achievement;

import java.math.BigDecimal;

import asembly.talis.common.NamedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Achievement
 */
@Entity
@Table
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Achievement extends NamedEntity {

    @Column(nullable = false)
    private BigDecimal needToAchieve;
}
