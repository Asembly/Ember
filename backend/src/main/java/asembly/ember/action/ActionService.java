package asembly.ember.action;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import asembly.ember.action.dto.ActionResponseDto;
import asembly.ember.action.dto.CreateActionDto;
import asembly.ember.attribute.AttributeService;
import asembly.ember.common.exception.AlreadyExistsException;
import asembly.ember.common.exception.InvalidWeightSumException;
import asembly.ember.common.exception.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * ActionService
 */
@Service
@RequiredArgsConstructor
public class ActionService {

    private final ActionRepository actionRepository;
    private final ActionMapper actionMapper;
    private final AttributeService attributeService;

    @Transactional
    public ActionResponseDto create(CreateActionDto dto) {

        var optAction = getByTitle(dto.name());
        if (optAction.isPresent())
            throw new AlreadyExistsException("Action", "title", dto.name());

        var action = Action.builder()
                .name(dto.name())
                .description(dto.description())
                .build();

        var actionAttributes = new LinkedList<ActionAttributes>();

        var totalWeight = BigDecimal.ZERO;
        for (var aw : dto.attributes()) {

            var attribute = attributeService.getReferenceEntityById(aw.attributeId());
            totalWeight = totalWeight.add(aw.weight());

            actionAttributes.add(ActionAttributes.builder()
                    .attribute(attribute)
                    .weight(aw.weight())
                    .action(action)
                    .build());
        }

        if (totalWeight.compareTo(BigDecimal.ONE) == 1)
            throw new InvalidWeightSumException("Total weight sum: " + totalWeight.doubleValue());

        action.setActionAttributes(actionAttributes);

        actionRepository.save(action);

        return actionMapper.toActionResponseDto(action);
    }

    public List<ActionResponseDto> getAll() {
        var actions = actionRepository.findAll();

        List<ActionResponseDto> response = new ArrayList<>();
        for (var a : actions) {
            response.add(actionMapper.toActionResponseDto(a));
        }

        return response;
    }

    public Action getReferenceEntityById(Long id) {

        if (!actionRepository.existsById(id))
            throw new NotFoundException("Action", "id", id);

        return actionRepository.getReferenceById(id);
    }

    public Optional<Action> getByTitle(String title) {
        return actionRepository.findByTitle(title);
    }

}
