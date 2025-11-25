/**
 * Base application-layer context for the LoadApp use-case pipeline.
 *
 * - Always an object
 * - Intentionally empty
 * - Applications may extend this with their own fields
 */
export type LoadAppContext = Record<string, unknown>;
