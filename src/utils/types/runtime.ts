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
}