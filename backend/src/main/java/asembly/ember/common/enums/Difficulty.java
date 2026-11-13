package asembly.ember.common.enums;

/**
 * Difficulty
 */
public enum Difficulty {

    EASY(0.1),
    MEDIUM(0.5),
    HARD(0.75),
    EXTRA_HARD(0.80),
    INSANE(1.0);

    private final double multiplier;

    Difficulty(double multiplier) {
        this.multiplier = multiplier;
    }

    public double getMultiplier() {
        return multiplier;
    }

}
