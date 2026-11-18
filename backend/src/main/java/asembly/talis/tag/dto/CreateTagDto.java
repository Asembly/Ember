package asembly.talis.tag.dto;

import asembly.talis.common.enums.Color;

/**
 * CreateTagDto
 */
public record CreateTagDto(Long profileId, String name, String description, Color color) {

}
