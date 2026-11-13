package asembly.ember.tag;

import java.util.Collection;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import org.springframework.stereotype.Service;

import asembly.ember.common.exception.NotFoundException;
import asembly.ember.profile.ProfileService;
import asembly.ember.tag.dto.CreateTagDto;
import asembly.ember.tag.dto.TagResponseDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * TagService
 */
@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final TagMapper tagMapper;

    private final ProfileService profileService;

    @Transactional
    public TagResponseDto create(CreateTagDto dto) {

        if (!profileService.existsById(dto.profileId()))
            throw new NotFoundException("Profile", "id", dto.profileId());

        var profile = profileService.getReferenceById(dto.profileId());

        var tag = Tag.builder()
                .profile(profile)
                .name(dto.name())
                .description(dto.description())
                .color(dto.color())
                .tasks(Collections.emptySet())
                .build();

        tagRepository.save(tag);

        return tagMapper.toTagResponse(tag);
    }

    public List<Tag> getAllByIdInProfileId(Collection<Long> ids, Long profileId) {
        if (ids == null)
            throw new IllegalStateException("Ids could not be null");

        return tagRepository.findAllByIdInAndProfileId(ids, profileId);
    }

    public List<Tag> getAllById(Collection<Long> ids) {
        if (ids == null)
            throw new IllegalStateException("Ids could not be null");

        return tagRepository.findAllById(ids);
    }

    public List<TagResponseDto> getAll() {
        var tags = tagRepository.findAll();
        var response = new LinkedList<TagResponseDto>();
        for (var tag : tags) {
            response.add(tagMapper.toTagResponse(tag));
        }
        return response;
    }

    public TagResponseDto getById(Long id) {
        var tag = tagRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("tag", "id", id));
        return tagMapper.toTagResponse(tag);
    }

}
