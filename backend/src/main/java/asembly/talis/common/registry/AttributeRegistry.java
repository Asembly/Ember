package asembly.talis.common.registry;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import asembly.talis.attribute.Attribute;
import asembly.talis.attribute.AttributeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * AttributeRegistry
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AttributeRegistry extends AbstractInMemoryRegistry<Attribute, Long> implements ApplicationRunner {

    private final AttributeRepository attributeRepository;

    @Override
    public void run(ApplicationArguments args) {
        registryAll(attributeRepository.findAll());
        log.info("AttributeRegistry: registered {} entities", getAll().size());
    }

    @Override
    protected Long extractId(Attribute entity) {
        return entity.getId();
    }

    @Override
    protected String getRegistryName() {
        return "AttributeRegistry";
    }

    public Attribute getByName(String name) {
        return getAll().stream()
                .filter(a -> a.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown attribute: " + name));
    }

}
