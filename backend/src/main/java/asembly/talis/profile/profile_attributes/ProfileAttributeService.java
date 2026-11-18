package asembly.talis.profile.profile_attributes;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import asembly.talis.profile.dto.StatResponseDto;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileAttributeService {

    private final ProfileAttributeRepository paRepository;
    private final ProfileAttributeMapper profileAttributeMapper;

    public List<StatResponseDto> getAttributesByProfileId(Long profileId) {
        var pAs = paRepository.findAttributesByProfileId(profileId);
        var response = new ArrayList<StatResponseDto>();
        for (var pa : pAs) {
            response.add(profileAttributeMapper.toStatsResponseDto(pa));
        }

        return response;
    }

}
