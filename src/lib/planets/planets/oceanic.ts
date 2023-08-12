import Planet from '../planet'
import Atmosphere from "../atmospheres/atmosphereTemperate"
import GlobeOceanic from '../globes/globeOceanic'
import type { timeUniform } from '../../planetView/time'
import { createUniformTexture } from '@utils/shaders/uniformTexture'
import { UniformParameter } from '@utils/shaders/uniformParameter'
import planetTemplate from '@ccpdata/templates/oceanic/oceanic10.json'
import heightMap from '@ccpdata/textures/oceanHeightMap1.png'


export default class PlanetOceanic extends Planet {
  
  private globe: GlobeOceanic
  private atmosphere: Atmosphere

  constructor(
    time: timeUniform
  ) {

    super(time)

    // bind settings and textures
    this.bindSettings( planetTemplate.settings )
    // @ts-ignore
    this.bindTextures( planetTemplate.textures )

    // import height map
    const heightMapTexture = createUniformTexture( heightMap, false, 'linear' )
    this.uniforms.heightMap = new UniformParameter( 'heightMap', heightMapTexture )

    // build planet
    this.globe = new GlobeOceanic( this.uniforms )
    // this.atmosphere = new Atmosphere( this.uniforms )

    // add planet to scene
    this.add( this.globe )

  }

}