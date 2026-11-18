package asembly.talis.attribute;

import java.math.BigDecimal;

import asembly.talis.common.NamedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Attribute
 */
@Entity
@Table
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Attribute extends NamedEntity {

    @Column(nullable = false)
    private BigDecimal levelCoefficient;
}
