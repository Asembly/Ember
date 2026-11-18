package asembly.talis.action;

import java.math.BigDecimal;

import asembly.talis.attribute.Attribute;
import asembly.talis.common.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * ActionAttributes
 */
@Entity
@Table
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ActionAttributes extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "attribute_id")
    private Attribute attribute;

    @ManyToOne
    @JoinColumn(name = "action_id")
    private Action action;

    @Builder.Default
    private BigDecimal weight = BigDecimal.ONE;

}
