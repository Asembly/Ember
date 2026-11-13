package asembly.ember.attribute;

import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Service;

import asembly.ember.common.exception.AlreadyExistsException;
import asembly.ember.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttributeService {

    private final AttributeRepository attributeRepository;

    public List<Attribute> createAll(Collection<Attribute> attributes) {

        var exist = attributeRepository.findAll().stream()
                .map(Attribute::getName)
                .toList();

        for (var attr : attributes) {
            if (exist.contains(attr.getName()))
                throw new AlreadyExistsException("Attribute", "name", attr.getName());
        }

        return attributeRepository.saveAll(attributes);
    }

    public Attribute getReferenceEntityById(Long id) {

        if (!attributeRepository.existsById(id))
            throw new NotFoundException("Attribute", "id", id);

        return attributeRepository.getReferenceById(id);
    }

    public boolean isEmpty() {
        return attributeRepository.count() == 0;
    }

    public List<Attribute> getAllEntity() {
        return attributeRepository.findAll();
    }
}
