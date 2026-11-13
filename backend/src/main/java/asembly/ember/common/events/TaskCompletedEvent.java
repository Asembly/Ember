package asembly.ember.common.events;

import asembly.ember.task.Task;

/**
 * OnTaskCompletedEvent
 */
public record TaskCompletedEvent(Long profileId, Task task) {
}
