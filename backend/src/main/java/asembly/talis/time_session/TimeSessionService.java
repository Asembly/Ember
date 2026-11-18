package asembly.talis.time_session;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import asembly.talis.common.exception.AlreadyExistsException;
import asembly.talis.common.exception.NotFoundException;
import asembly.talis.task.Task;
import asembly.talis.time_session.dto.ActiveSessionResponseDto;
import asembly.talis.time_session.dto.TimeSessionResponseDto;
import lombok.RequiredArgsConstructor;

/**
 * TimeSessionService
 */
@Service
@RequiredArgsConstructor
public class TimeSessionService {

    private final TimeSessionRepository sessionRepository;
    private final TimeSessionMapper sessionMapper;
    private final ActiveSessionRepository activeSessionRepository;

    @Transactional
    public TimeSessionResponseDto startTimer(Task task) {

        var profile = task.getProfile();

        var exist = activeSessionRepository.findByProfileId(profile.getId());
        if (exist.isPresent()) {
            var active = exist.get();

            if (active.getTimeSession().getEndTime() == null) {
                throw new AlreadyExistsException("session", "profileId", profile.getId());
            }

            activeSessionRepository.delete(active);
            activeSessionRepository.flush();
        }

        var session = TimeSession.builder().task(task).build();

        sessionRepository.save(session);
        var active = ActiveSession.builder()
                .profile(profile)
                .timeSession(session)
                .build();

        activeSessionRepository.save(active);

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
        activeSessionRepository.deleteByTimeSessionId(session.getId());
        return sessionMapper.toTimeSessionResponse(session);
    }

    @Transactional
    public TimeSessionResponseDto stopTimer(Task task) {

        var profile = task.getProfile();

        var activeSession = activeSessionRepository.findByProfileId(profile.getId()).orElseThrow(
                () -> new NotFoundException("session", "profileId", profile.getId()));

        return stopTimer(activeSession.getTimeSession());
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

    @Transactional(readOnly = true)
    public ActiveSessionResponseDto getActiveSessionByProfileId(Long profileId) {
        var session = activeSessionRepository.findByProfileId(profileId);
        if (session.isPresent())
            return sessionMapper.toActiveSessionResponseDto(session.get());

        return null;
    }

    public List<TimeSessionResponseDto> getTimeSessionHistory(Long profileId) {
        var sessions = sessionRepository.findAllByProfileId(profileId);

        var response = new ArrayList<TimeSessionResponseDto>();
        for (var s : sessions)
            response.add(sessionMapper.toTimeSessionResponse(s));

        return response;
    }

}
