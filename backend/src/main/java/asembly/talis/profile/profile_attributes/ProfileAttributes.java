package asembly.talis.profile.profile_attributes;

import asembly.talis.attribute.Attribute;
import asembly.talis.common.LevelEntity;
import asembly.talis.profile.Profile;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * ProfileAttributes
 */
@Entity
@Table
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class ProfileAttributes extends LevelEntity {

    @ManyToOne
    @JoinColumn(name = "profile_id")
    private Profile profile;

    @ManyToOne
    @JoinColumn(name = "attribute_id")
    private Attribute attribute;
}
