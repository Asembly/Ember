package asembly.talis.common.events;

import asembly.talis.task.Task;

/**
 * OnTaskCompletedEvent
 */
public record TaskCompletedEvent(Long profileId, Task task) {
}
