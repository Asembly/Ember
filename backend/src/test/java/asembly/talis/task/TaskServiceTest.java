package asembly.talis.task;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * TaskServiceTest
 */
@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    // @InjectMocks
    // private TaskService taskService;
    //
    // @Mock
    // private TaskRepository taskRepository;
    //
    // @Mock
    // private TaskMapper taskMapper;
    //
    // @Mock
    // private ProfileService profileService;
    //
    // @Mock
    // private TagService tagService;
    //
    // @Mock
    // private ActionService actionService;
    //
    // private Profile profile;
    //
    // private List<Tag> tags;
    //
    // private Action action;
    //
    // @BeforeEach
    // public void setup() {
    // this.profile = Profile.builder()
    // .id(1L)
    // .build();
    //
    // this.tags = new ArrayList<>();
    //
    // var tag1 = Tag.builder()
    // .id(1L)
    // .name("Reading")
    // .color(Color.WHITE)
    // .description("Description about reading")
    // .build();
    // var tag2 = Tag.builder()
    // .id(2L)
    // .name("Running")
    // .color(Color.BLACK)
    // .description("Description about running")
    // .build();
    //
    // this.tags.addAll(List.of(tag1, tag2));
    //
    // this.action = Action.builder()
    // .id(1L)
    // .name("Fishing")
    // .build();
    // }
    //
    // @Test
    // public void create_shouldReturnTaskResponseDto() {
    //
    // var createdAt = LocalDateTime.of(2026, 10, 26, 17, 20);
    // var dto = new CreateTaskDto("Task1",
    // "Description",
    // null,
    // null,
    // List.of(1L, 2L),
    // 1L,
    // profile.getId());
    //
    // var expected = new TaskResponseDto(1L, "Task1", "Description",
    // StatusTask.OPEN, createdAt, null,
    // null, null);
    //
    // Mockito.when(profileService.getReferenceById(profile.getId()))
    // .thenReturn(profile);
    //
    // Mockito.when(tagService.getAllByIdInProfileId(dto.tagsId(), profile.getId()))
    // .thenReturn(tags);
    //
    // Mockito.when(actionService.getReferenceEntityById(dto.actionId()))
    // .thenReturn(action);
    //
    // Mockito.when(taskRepository.save(Mockito.any(Task.class)))
    // .thenAnswer(answer -> answer.getArgument(0));
    //
    // Mockito.when(taskMapper.toTaskResponse(Mockito.any(Task.class)))
    // .thenReturn(expected);
    //
    // var response = taskService.create(dto);
    //
    // assertNotNull(response);
    // assertEquals(expected, response);
    // }
    //
    // @Test
    // public void create_shouldThrowNotFoundException_whenTagsSizeNotEqual() {
    // // var dto = new CreateTaskDto("Task1",
    // // "Description",
    // // null,
    // // null,
    // // List.of(1L, 2L),
    // // 1L,
    // // profile.getId());
    //
    // Mockito.when(profileService.getReferenceById(profile.getId()))
    // .thenReturn(profile);
    //
    // Mockito.when(tagService.getAllByIdInProfileId(dto.tagsId(), profile.getId()))
    // .thenReturn(List.of(tags.get(0)));
    //
    // assertThrows(NotFoundException.class, () -> taskService.create(dto));
    // }
    //
}
