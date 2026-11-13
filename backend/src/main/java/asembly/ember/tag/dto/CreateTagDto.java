package asembly.ember.tag.dto;

import asembly.ember.common.enums.Color;

/**
 * CreateTagDto
 */
public record CreateTagDto(Long profileId, String name, String description, Color color) {

}
