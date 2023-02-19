import { isFarmUnit } from '$global/utils/guards.js';

// Testa se as unidades de farm são identificadas corretamente.
test('unidades de farm', () => {
    expect(isFarmUnit('spear')).toBe(true);
    expect(isFarmUnit('sword')).toBe(true);
    expect(isFarmUnit('axe')).toBe(true);
    expect(isFarmUnit('archer')).toBe(true);
    expect(isFarmUnit('spy')).toBe(true);
    expect(isFarmUnit('light')).toBe(true);
    expect(isFarmUnit('marcher')).toBe(true);
    expect(isFarmUnit('heavy')).toBe(true);
    expect(isFarmUnit('knight')).toBe(true);

    expect(isFarmUnit('catapult')).toBe(false);
    expect(isFarmUnit('ram')).toBe(false);
    expect(isFarmUnit('snob')).toBe(false);
    expect(isFarmUnit('militia')).toBe(false);
});