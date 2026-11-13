package asembly.ember.task;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import asembly.ember.action.Action;
import asembly.ember.common.NamedEntity;
import asembly.ember.common.enums.Difficulty;
import asembly.ember.common.enums.StatusTask;
import asembly.ember.profile.Profile;
import asembly.ember.tag.Tag;
import asembly.ember.time_session.TimeSession;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Task
 */
@Entity
@Table
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Task extends NamedEntity {

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private StatusTask status = StatusTask.OPEN;

    @Builder.Default
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty = Difficulty.EASY;

    private LocalDateTime deadline;

    private LocalDateTime finishedAt;

    private LocalDateTime scheduledAt;

    @ManyToOne(fetch = FetchType.LAZY)
    private Profile profile;

    @ManyToOne(fetch = FetchType.LAZY)
    private Action action;

    @Builder.Default
    @ManyToMany
    @JoinTable(name = "task_tags", joinColumns = @JoinColumn(name = "task_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tags = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<TimeSession> timeSessions = new ArrayList<>();

}
