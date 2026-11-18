package asembly.talis.time_session;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * TimeSessionService
 */
@ExtendWith(MockitoExtension.class)
public class TimeSessionServiceTest {

    // @InjectMocks
    // private TimeSessionService sessionService;
    //
    // @Mock
    // private TimeSessionRepository sessionRepository;
    //
    // @Mock
    // private TimeSessionMapper sessionMapper;
    //
    // @Mock
    // private XpService xpService;
    //
    // @Test
    // public void startTimer_shouldReturnSession() {
    // var task = Task.builder()
    // .id(1L)
    // .name("Task")
    // .description("Description")
    // .build();
    //
    // var startTime = LocalDateTime.now();
    // var expectedSession = new TimeSessionResponseDto(
    // 1L,
    // startTime,
    // null,
    // null);
    //
    // Mockito.when(sessionRepository.findActiveSession(task.getId()))
    // .thenReturn(Optional.empty());
    //
    // Mockito.when(sessionRepository.save(Mockito.any(TimeSession.class)))
    // .thenAnswer(answer -> answer.getArgument(0));
    //
    // Mockito.when(sessionMapper.toTimeSessionResponse(Mockito.any(TimeSession.class)))
    // .thenReturn(expectedSession);
    //
    // var response = sessionService.startTimer(task);
    //
    // assertNotNull(response);
    // assertEquals(expectedSession.id(), response.id());
    // assertEquals(expectedSession.createdAt(), response.createdAt());
    // assertNull(response.endTime());
    // assertNull(response.durationInMin());
    //
    // Mockito.verify(sessionRepository,
    // Mockito.times(1)).save(Mockito.any(TimeSession.class));
    // }
    //
    // @Test
    // public void startTimer_shouldThrowAlreadyExistsException_whenSessionFound() {
    // var task = Task.builder()
    // .id(1L)
    // .name("Task")
    // .description("Description")
    // .build();
    //
    // var startTime = LocalDateTime.of(2026, 10, 26, 17, 20);
    // var session = TimeSession.builder()
    // .id(1L)
    // .createdAt(startTime)
    // .endTime(null)
    // .durationInMin(null)
    // .build();
    //
    // Mockito.when(sessionRepository.findActiveSession(task.getId()))
    // .thenReturn(Optional.of(session));
    //
    // assertThrows(AlreadyExistsException.class, () ->
    // sessionService.startTimer(task));
    // }
    //
    // @Test
    // public void stopTimer_shouldReturnSession() {
    // var task = Task.builder()
    // .id(1L)
    // .name("Task")
    // .description("Description")
    // .build();
    //
    // var startTime = LocalDateTime.of(2026, 10, 26, 17, 20);
    // var endTime = LocalDateTime.of(2026, 10, 26, 17, 00);
    // var expectedSession = new TimeSessionResponseDto(
    // 1L,
    // startTime,
    // endTime,
    // Duration.between(startTime, endTime).toMinutes());
    //
    // var session = TimeSession.builder()
    // .id(1L)
    // .createdAt(startTime)
    // .endTime(null)
    // .durationInMin(null)
    // .build();
    //
    // Mockito.when(sessionRepository.findActiveSession(task.getId()))
    // .thenReturn(Optional.of(session));
    //
    // Mockito.when(sessionRepository.save(Mockito.any(TimeSession.class)))
    // .thenAnswer(answer -> answer.getArgument(0));
    //
    // Mockito.when(sessionMapper.toTimeSessionResponse(Mockito.any(TimeSession.class)))
    // .thenReturn(expectedSession);
    //
    // var response = sessionService.stopTimer(task);
    //
    // assertNotNull(response);
    // assertEquals(expectedSession.durationInMin(), response.durationInMin());

    // }

}
