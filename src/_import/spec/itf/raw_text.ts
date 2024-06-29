import { RawMessage } from '@minecraft/server';

/**
 * Creates a simple text component.
 * @param value - The text value.
 * @returns Text component object.
 */
const TEXT = (value: string): RawMessage => ({
    text: value
});

/**
 * Creates a translation component with optional 'with' parameters.
 * @param key - The translation key.
 * @param params - The optional parameters for translation.
 * @returns Translation component object.
 */
const TRANSLATE = (key: string, ...params: string[]): RawMessage => ({
    translate: key,
    with: params.length ? params : undefined
});

/**
 * Creates a score component.
 * @param name - The entity's name whose score is being displayed.
 * @param objective - The name of the score objective.
 * @returns Score component object.
 */
const SCORE = (name: string, objective: string): RawMessage => ({
    score: {
        name: name,
        objective: objective
    }
});

/**
 * Wraps various text components into a rawtext structure.
 * @param rawText - The raw text components.
 * @returns Raw text object.
 */
const MESSAGE = (...rawText: RawMessage[]): RawMessage => ({
    rawtext: rawText
});

const RawText = {
    TEXT,
    TRANSLATE,
    SCORE,
    MESSAGE
};

export { RawText };
