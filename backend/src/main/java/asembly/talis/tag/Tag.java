package asembly.talis.tag;

import java.util.HashSet;
import java.util.Set;

import asembly.talis.common.NamedEntity;
import asembly.talis.common.enums.Color;
import asembly.talis.profile.Profile;
import asembly.talis.task.Task;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Tag
 */
@Entity
@Table
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Tag extends NamedEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Color color;

    @Builder.Default
    @ManyToMany(mappedBy = "tags")
    private Set<Task> tasks = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    private Profile profile;
}
