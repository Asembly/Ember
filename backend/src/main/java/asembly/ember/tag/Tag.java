package asembly.ember.tag;

import java.util.HashSet;
import java.util.Set;

import asembly.ember.common.NamedEntity;
import asembly.ember.common.enums.Color;
import asembly.ember.profile.Profile;
import asembly.ember.task.Task;
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
