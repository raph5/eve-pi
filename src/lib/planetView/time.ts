import { ShaderUniform } from "./shader/shaderParameter";

// create a shared time uniform
export const time = new ShaderUniform( 'time', performance.now() / 1000 )

export type timeUniform = typeof time