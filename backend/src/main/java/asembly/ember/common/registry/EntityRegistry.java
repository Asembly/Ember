package asembly.ember.common.registry;

import java.util.Collection;

/**
 * EntityRegistry
 */
public interface EntityRegistry<T, ID> {

    public void registry(T entity);

    public void registryAll(Collection<T> entities);

    public T get(ID id);

    public Collection<T> getAll();
}
