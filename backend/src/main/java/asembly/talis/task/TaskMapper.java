package asembly.talis.task;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import asembly.talis.tag.Tag;
import asembly.talis.task.dto.TaskResponseDto;

/**
 * TaskMapper
 */
@Mapper(componentModel = "spring")
public abstract class TaskMapper {

    @Autowired
    protected TaskRewardCalculator rewardCalculator;

    @Mapping(target = "potentialXp", expression = "java(rewardCalculator.calculatePotentialXp(task))")
    @Mapping(target = "tagsId", source = "tags")
    public abstract TaskResponseDto toTaskResponse(Task task);

    protected Long map(Tag tag) {
        if (tag == null) {
            return null;
        }
        return tag.getId();
    }
}
