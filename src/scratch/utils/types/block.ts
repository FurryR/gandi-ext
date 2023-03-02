import type { Argument } from './argument'
export enum ReporterScope {
  GLOBAL = 'global',
  TARGET = 'target'
}
/**
 * Default types of Target supported by the VM
 * @enum {string}
 */
export enum TargetType {
  /**
   * Rendered target which can move, change costumes, etc.
   */
  SPRITE = 'sprite',
  /**
   * Rendered target which cannot move but can change backdrops
   */
  STAGE = 'stage'
}
export enum BlockType {
  /**
   * Boolean reporter with hexagonal shape
   */
  BOOLEAN = 'Boolean',
  /**
   * A button (not an actual block) for some special action, like making a variable
   */
  BUTTON = 'button',
  /**
   * Command block
   */
  COMMAND = 'command',
  /**
   * Specialized command block which may or may not run a child branch
   * The thread continues with the next block whether or not a child branch ran.
   */
  CONDITIONAL = 'conditional',
  /**
   * Specialized hat block with no implementation function
   * This stack only runs if the corresponding event is emitted by other code.
   */
  EVENT = 'event',
  /**
   * Hat block which conditionally starts a block stack
   */
  HAT = 'hat',
  /**
   * Specialized command block which may or may not run a child branch
   * If a child branch runs, the thread evaluates the loop block again.
   */
  LOOP = 'loop',
  /**
   * General reporter with numeric or string value
   */
  REPORTER = 'reporter'
}
export interface DynamicMenu {
  items: string
}
export interface ExtensionMenuItem {
  text: string
  value: string | number
}
export interface BlockInfo {
  /** the type of block (command, reporter, etc.) being described. */
  blockType: BlockType
  /** the text on the block, with [PLACEHOLDERS] for arguments. */
  text: string
  /** a unique alphanumeric identifier for this block. No special characters allowed. */
  opcode: string
  /** the name of the function implementing this block. Can be shared by other blocks/opcodes. */
  func?: (v: unknown) => unknown
  /** true if this block should not appear in the block palette. */
  hideFromPalette?: boolean
  /** true if the block ends a stack - no blocks can be connected after it. */
  isTerminal?: boolean
  /** true if this block is a reporter but should not allow a monitor. */
  disableMonitor?: boolean
  /** if this block is a reporter, this is the scope/context for its value. */
  reporterScope?: ReporterScope
  /** sets whether a hat block is edge-activated. */
  isEdgeActivated?: boolean
  /** sets whether a hat/event block should restart existing threads. */
  shouldRestartExistingThreads?: boolean
  /** for flow control blocks, the number of branches/substacks for this block. */
  branchCount?: number
  /** map of argument placeholder to metadata about each arg. */
  arguments?: {
    [key: string]: Argument
  }
}
