package asembly.ember.profile.dto;

import java.math.BigDecimal;

/**
 * ProfileResponseDto
 */
public record ProfileResponseDto(Long id, String nickname, Integer level, Integer currentXp,
        BigDecimal nextLevelUp) {
}
