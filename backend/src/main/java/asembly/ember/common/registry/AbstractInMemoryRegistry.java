package asembly.ember.common.registry;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import lombok.extern.slf4j.Slf4j;

/**
 * AbstractInMemoryRegistry
 */
@Slf4j
public abstract class AbstractInMemoryRegistry<T, ID> implements EntityRegistry<T, ID> {
    private final Map<ID, T> storage = new ConcurrentHashMap<>();

    protected abstract ID extractId(T entity);

    protected abstract String getRegistryName();

    @Override
    public void registry(T entity) {
        if (entity == null) {
            throw new IllegalArgumentException(getRegistryName() + ": entity is null");
        }
        ID id = extractId(entity);
        if (id == null) {
            throw new IllegalArgumentException(getRegistryName() + ": entity id is null");
        }
        storage.put(id, entity);
        log.debug("{}: registered entity with id {}", getRegistryName(), id);
    }

    @Override
    public void registryAll(Collection<T> entities) {
        if (entities == null) {
            throw new IllegalArgumentException(getRegistryName() + ": collection is null");
        }
        for (T entity : entities) {
            registry(entity);
        }
        log.info("{}: registered {} entities", getRegistryName(), entities.size());
    }

    @Override
    public T get(ID id) {
        T entity = storage.get(id);
        if (entity == null) {
            throw new IllegalArgumentException(getRegistryName() + ": unknown id " + id);
        }
        return entity;
    }

    @Override
    public Collection<T> getAll() {
        log.info("{}: get all entities (size={})", getRegistryName(), storage.size());
        return Collections.unmodifiableCollection(storage.values());
    }

}
