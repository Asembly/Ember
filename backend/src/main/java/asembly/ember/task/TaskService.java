package asembly.ember.task;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import asembly.ember.action.Action;
import asembly.ember.action.ActionService;
import asembly.ember.common.enums.StatusTask;
import asembly.ember.common.events.ProfileLevelUpEvent;
import asembly.ember.common.events.TaskCompletedEvent;
import asembly.ember.common.exception.NotFoundException;
import asembly.ember.common.exception.TaskAlreadyFinishedException;
import asembly.ember.gamification.XpService;
import asembly.ember.profile.Profile;
import asembly.ember.profile.ProfileService;
import asembly.ember.tag.Tag;
import asembly.ember.tag.TagService;
import asembly.ember.task.dto.ChangeDifficultyDto;
import asembly.ember.task.dto.CreateTaskDto;
import asembly.ember.task.dto.TaskResponseDto;
import asembly.ember.time_session.TimeSessionService;
import asembly.ember.time_session.dto.TimeSessionResponseDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * TaskService
 */
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    // Profile
    private final ProfileService profileService;

    // Tag
    private final TagService tagService;

    // Time Session
    private final TimeSessionService sessionService;

    // Action
    private final ActionService actionService;

    // Xp
    private final XpService xpService;

    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public TaskResponseDto create(CreateTaskDto dto) {

        var profile = profileService.getReferenceById(dto.profileId());

        validateTime(dto.deadline(), dto.scheduledAt());

        var tags = tagService.getAllByIdInProfileId(dto.tagsId(), dto.profileId());
        if (tags.size() != dto.tagsId().size())
            throw new NotFoundException("Tag by profileId", "id", dto.tagsId());

        var action = actionService.getReferenceEntityById(dto.actionId());
        var task = buildTask(dto, tags, action, profile);

        var response = taskMapper.toTaskResponse(taskRepository.save(task));

        return response;
    }

    @Transactional
    public TaskResponseDto cancel(Long id) {
        var task = getEntityById(id);

        var activeSession = sessionService.getActiveSession(id);
        if (activeSession.isPresent())
            sessionService.stopTimer(activeSession.get());

        task.setStatus(StatusTask.CANCELED);

        var response = taskMapper.toTaskResponse(taskRepository.save(task));

        return response;
    }

    @Transactional
    public TaskResponseDto done(Long id) {
        var task = getEntityById(id);

        var activeSession = sessionService.getActiveSession(id);
        if (activeSession.isPresent()) {
            sessionService.stopTimer(activeSession.get());

            xpService.reward(task, task.getDifficulty().getMultiplier(), activeSession.get().getDurationInMin());
        }

        task.setStatus(StatusTask.DONE);
        task.setFinishedAt(LocalDateTime.now());

        eventPublisher.publishEvent(new TaskCompletedEvent(
                task.getProfile().getId(),
                task));

        eventPublisher.publishEvent(new ProfileLevelUpEvent(task.getProfile()));

        var response = taskMapper.toTaskResponse(taskRepository.save(task));
        return response;
    }

    @Transactional
    public TaskResponseDto changeDifficulty(ChangeDifficultyDto dto) {
        var task = getEntityById(dto.id());

        task.setDifficulty(dto.difficulty());

        var response = taskMapper.toTaskResponse(taskRepository.save(task));
        return response;
    }

    @Transactional
    public TimeSessionResponseDto startSession(Long id) {

        var task = getEntityById(id);

        if (!task.getStatus().equals(StatusTask.OPEN) &&
                !task.getStatus().equals(StatusTask.IN_PROGRESS)) {
            throw new TaskAlreadyFinishedException(task.getName(), "id", id);
        }

        task.setStatus(StatusTask.IN_PROGRESS);
        var response = sessionService.startTimer(task);
        taskRepository.save(task);

        return response;
    }

    @Transactional
    public TimeSessionResponseDto stopSession(Long id) {

        var task = getEntityById(id);

        var response = sessionService.stopTimer(task);
        xpService.reward(task, task.getDifficulty().getMultiplier(), response.durationInMin());

        taskRepository.save(task);

        eventPublisher.publishEvent(new ProfileLevelUpEvent(task.getProfile()));

        return response;
    }

    public List<TaskResponseDto> getAllByProfileId(Long profileId) {
        var tasks = taskRepository.findAllByProfileId(profileId);
        var response = new ArrayList<TaskResponseDto>();
        for (var task : tasks) {
            response.add(taskMapper.toTaskResponse(task));
        }

        return response;
    }

    public TaskResponseDto getById(Long id) {
        var task = taskRepository.findById(id).orElseThrow(
                () -> new NotFoundException("task", "id", id));

        return taskMapper.toTaskResponse(task);
    }

    public List<TaskResponseDto> getAll() {
        var tasks = taskRepository.findAll();

        List<TaskResponseDto> response = new LinkedList<>();

        for (var task : tasks) {
            response.add(taskMapper.toTaskResponse(task));
        }

        return response;
    }

    public long getCountByStatus(Long profileId, StatusTask status) {
        return taskRepository.countByProfileIdAndStatus(profileId, status);
    }

    private Task buildTask(CreateTaskDto dto, Collection<Tag> tags, Action action, Profile profile) {

        return Task.builder()
                .name(dto.name())
                .createdAt(LocalDateTime.now())
                .description(dto.description())
                .tags(new HashSet<>(tags))
                .action(action)
                .difficulty(dto.difficulty())
                .profile(profile)
                .deadline(dto.deadline())
                .scheduledAt(dto.scheduledAt())
                .build();
    }

    private Task getEntityById(Long id) {
        return taskRepository.findById(id).orElseThrow(
                () -> new NotFoundException("task", "id", id));
    }

    private void validateTime(LocalDateTime deadline, LocalDateTime scheduledAt) {
        if (deadline != null && scheduledAt != null) {
            if (deadline.isBefore(scheduledAt)) {
                throw new IllegalStateException("Deadline cannot be before scheduled time");
            }
        }
    }
}
