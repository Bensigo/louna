/* eslint-disable @typescript-eslint/no-var-requires */
import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions"

const applyGlobalPolyfills = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { TextEncoder, TextDecoder } = require("text-encoding")

  polyfillGlobal("TextEncoder", () => TextEncoder)
  polyfillGlobal("TextDecoder", () => TextDecoder)
}

export default applyGlobalPolyfills