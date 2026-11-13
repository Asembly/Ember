package asembly.ember.task;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import asembly.ember.task.dto.TaskResponseDto;

/**
 * TaskMapper
 */
@Mapper(componentModel = "spring")
public abstract class TaskMapper {

    private TaskRewardCalculator rewardCalculator;

    @Autowired
    public void setRewardCalculator(TaskRewardCalculator rewardCalculator) {
        this.rewardCalculator = rewardCalculator;
    }

    public TaskRewardCalculator getRewardCalculator() {
        return rewardCalculator;
    }

    @Mapping(target = "potentialXp", expression = "java(getRewardCalculator().calculatePotentialXp(task))")
    public abstract TaskResponseDto toTaskResponse(Task task);
}
