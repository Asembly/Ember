package asembly.talis.tag.dto;

import asembly.talis.common.enums.Color;

/**
 * TagResponseDto
 */
public record TagResponseDto(Long id, String name, Long profileId, Color color) {
}
