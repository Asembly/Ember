package asembly.ember.tag.dto;

import asembly.ember.common.enums.Color;

/**
 * TagResponseDto
 */
public record TagResponseDto(Long id, String name, Long profileId, Color color) {
}
