/**
 * @license MIT
 */

/// <reference lib="dom"/>
declare module 'eruda' {
  export class Eruda implements IDisposable {
    constructor(options: IErudaOptions)

    dispose(): void
  }

  /**
   * An object that can be disposed via a dispose function.
   */
  export interface IDisposable {
    dispose(): void
  }

  export interface IErudaOptions {
    container: HTMLElement
  }
}
