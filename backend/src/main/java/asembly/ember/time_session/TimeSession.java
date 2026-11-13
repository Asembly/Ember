package asembly.ember.time_session;

import java.time.LocalDateTime;

import asembly.ember.common.BaseEntity;
import asembly.ember.task.Task;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * TimeSession
 */
@Entity
@Table
@Setter
@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSession extends BaseEntity {

    private LocalDateTime endTime;

    private Long durationInMin;

    @ManyToOne(fetch = FetchType.LAZY)
    private Task task;
}
