package asembly.talis.action;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import asembly.talis.common.NamedEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Action
 */
@Entity
@Table
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Action extends NamedEntity {

    @Builder.Default
    @OneToMany(mappedBy = "action", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActionAttributes> actionAttributes = new ArrayList<>();

    @Builder.Default
    @Column(nullable = false)
    private BigDecimal baseXp = BigDecimal.TEN;
}
