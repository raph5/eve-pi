import { UniformParameter } from "./uniform/uniformParameter";

// create a shared time uniform
export const time = new UniformParameter( 'time', performance.now() / 1000 )

export type timeUniform = typeof time