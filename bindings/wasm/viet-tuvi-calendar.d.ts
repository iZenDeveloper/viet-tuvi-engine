declare namespace __AdaptedExports {
  /** Exported memory */
  export const memory: WebAssembly.Memory;
  /**
   * assembly/calendar/abiVersion
   * @returns `i32`
   */
  export function abiVersion(): number;
  /**
   * assembly/calendar/julianDay
   * @param day `i32`
   * @param month `i32`
   * @param year `i32`
   * @returns `i32`
   */
  export function julianDay(day: number, month: number, year: number): number;
  /**
   * assembly/calendar/solarToLunarPacked
   * @param day `i32`
   * @param month `i32`
   * @param year `i32`
   * @param tz `f64`
   * @returns `i64`
   */
  export function solarToLunarPacked(day: number, month: number, year: number, tz: number): bigint;
  /**
   * assembly/calendar/equationOfTimeMinutes
   * @param dayOfYear `i32`
   * @returns `f64`
   */
  export function equationOfTimeMinutes(dayOfYear: number): number;
}
/** Instantiates the compiled WebAssembly module with the given imports. */
export declare function instantiate(module: WebAssembly.Module, imports: {
}): Promise<typeof __AdaptedExports>;
