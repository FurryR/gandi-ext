export interface Runtime {
  /**
   * @brief 启动 Hats。
   * @param requestedHatOpcode Opcode of hats to start.
   * @param optMatchFields Optionally, fields to match on the hat.
   * @param optTarget Optionally, a target to restrict to.
   */
  startHats(
    requestedHatOpcode: string,
    optMatchFields?: unknown,
    optTarget?: unknown
  ): unknown[]
  /**
   * @brief Dispose all targets. Return to clean state.
   */
  dispose(): void
  /**
   * @brief Start all threads that start with the green flag.
   */
  greenFlag(): void
  /**
   * @brief tw: Change runtime target frames per second
   * @param {number} framerate Target frames per second
   */
  setFramerate(framerate: number): void
}
