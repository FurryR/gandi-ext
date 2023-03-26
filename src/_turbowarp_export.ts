import exportv from './index'
import { Scratch } from './turbowarp/utils/types/export'

declare const Scratch: Scratch
;((Scratch: Scratch) => {
  if (!Scratch.extensions.unsandboxed || Scratch.vm === undefined) {
    throw new Error('Runtime Options extension needs to be run unsandboxed')
  }
  Scratch.extensions.register(new exportv(Scratch.vm.runtime))
})(Scratch)
