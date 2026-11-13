package asembly.ember.profile.dto;

import java.math.BigDecimal;

/**
 * StatsResponseDto
 */
public record StatResponseDto(BigDecimal currentXp, Integer level, BigDecimal nextLevelUp, Long attributeId,
        Long profileId, String name) {
}
