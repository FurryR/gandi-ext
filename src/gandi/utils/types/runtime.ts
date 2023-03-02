export interface TranslationMap {
  [lang: string]: {
    [key: string]: string | undefined
  } | undefined
}
/**
 * @brief 格式化消息返回的函数类型。
 */
export type FormatMessageType = (args: {
  id: string
  default: string
  description: string
}) => string
export interface Runtime {
  /**
   * @brief 获取格式化消息。
   * @param args 语言表。
   */
  getFormatMessage(args: TranslationMap): FormatMessageType
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