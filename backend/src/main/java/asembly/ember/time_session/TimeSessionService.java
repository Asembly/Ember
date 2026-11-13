package asembly.ember.time_session;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import asembly.ember.common.exception.AlreadyExistsException;
import asembly.ember.common.exception.NotFoundException;
import asembly.ember.task.Task;
import asembly.ember.time_session.dto.TimeSessionResponseDto;
import lombok.RequiredArgsConstructor;

/**
 * TimeSessionService
 */
@Service
@RequiredArgsConstructor
public class TimeSessionService {

    private final TimeSessionRepository sessionRepository;
    private final TimeSessionMapper sessionMapper;

    @Transactional
    public TimeSessionResponseDto startTimer(Task task) {

        var optSession = getActiveSession(task.getId());

        if (optSession.isPresent())
            throw new AlreadyExistsException("session", "taskId", task.getId());

        var session = TimeSession.builder().task(task).build();

        sessionRepository.save(session);

        return sessionMapper.toTimeSessionResponse(session);
    }

    @Transactional
    public TimeSessionResponseDto stopTimer(TimeSession session) {

        if (session == null)
            throw new IllegalStateException("Session can't to be empty");

        var endTime = LocalDateTime.now();
        var startTime = session.getCreatedAt();
        session.setEndTime(endTime);

        long durationInMinutes = Duration.between(startTime, endTime).toMinutes();

        session.setDurationInMin(durationInMinutes);

        sessionRepository.save(session);
        return sessionMapper.toTimeSessionResponse(session);
    }

    @Transactional
    public TimeSessionResponseDto stopTimer(Task task) {

        var optSession = getActiveSession(task.getId());

        if (optSession.isEmpty())
            throw new NotFoundException("session", "taskId", task.getId());

        var session = optSession.get();
        var endTime = LocalDateTime.now();
        var startTime = session.getCreatedAt();
        session.setEndTime(endTime);

        long durationInMinutes = Duration.between(startTime, endTime).toMinutes();

        session.setDurationInMin(durationInMinutes);

        sessionRepository.save(session);
        return sessionMapper.toTimeSessionResponse(session);
    }

    public List<TimeSessionResponseDto> getAll() {
        var timeSessions = sessionRepository.findAll();
        List<TimeSessionResponseDto> response = new LinkedList<>();
        for (var session : timeSessions) {
            response.add(sessionMapper.toTimeSessionResponse(session));
        }

        return response;
    }

    public TimeSessionResponseDto getById(Long id) {

        var timeSession = sessionRepository.findById(id).orElseThrow(
                () -> new NotFoundException("session", "id", id));

        return sessionMapper.toTimeSessionResponse(timeSession);
    }

    public Optional<TimeSession> getActiveSession(Long taskId) {
        return sessionRepository.findActiveSession(taskId);
    }

}
