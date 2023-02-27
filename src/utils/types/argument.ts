export enum ArgumentType {
  /**
   * Numeric value with angle picker
   */
  ANGLE = 'angle',
  /**
   * Boolean value with hexagonal placeholder
   */
  BOOLEAN = 'Boolean',
  /**
   * Numeric value with color picker
   */
  COLOR = 'color',
  /**
   * Numeric value with text field
   */
  NUMBER = 'number',
  /**
   * String value with text field
   */
  STRING = 'string',
  /**
   * String value with matrix field
   */
  MATRIX = 'matrix',
  /**
   * MIDI note number with note picker (piano) field
   */
  NOTE = 'note',
  /**
   * Inline image on block (as part of the label)
   */
  IMAGE = 'image'
}
export interface Argument<T extends ArgumentType = ArgumentType> {
  type: T
  defaultValue?: string | number
  /** the name of the menu to use for this argument, if any. */
  menu?: string
}
