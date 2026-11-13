package asembly.ember.profile;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import asembly.ember.profile.dto.ProfileResponseDto;
import asembly.ember.profile.dto.StatResponseDto;
import asembly.ember.profile.profile_attributes.ProfileAttributeService;
import lombok.RequiredArgsConstructor;

/**
 * ProfileController
 */
@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final ProfileAttributeService profileAttributeService;

    @GetMapping("/get")
    public ResponseEntity<List<ProfileResponseDto>> getAll() {
        return ResponseEntity.ok(profileService.getAll());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ProfileResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getById(id));
    }

    @GetMapping("/get/{id}/attribute")
    public ResponseEntity<List<StatResponseDto>> getAttributesByProfileId(@PathVariable("id") Long profileId) {
        return ResponseEntity.ok(profileAttributeService.getAttributesByProfileId(profileId));
    }

}
