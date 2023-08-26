import { derived } from "svelte/store";
import planets from "./store";
import schematics from "@ccpdata/schematics/schematics.json"
import types from "@ccpdata/types/types.json"

type planetsType = typeof planets
type derivedType<T> = Record<string, T>

const SPACEPORTS_ID = 1030
const STORAGES_ID = 1029

class Commodity {
  public name: string
  constructor(
    public type: number
  ) {
    this.name = types[type].name
  }
}


export const planetsProgress = derived<planetsType, derivedType<number>>(planets, ($planets) => {
  const progress = {}

  for(const p in $planets) {
    // TODO: finish planetProgress store
    progress[p] = 0.5
  }

  return progress
})


export const planetsStorage = derived<planetsType, derivedType<number>>(planets, ($planets) => {
  const _storages = {}
  
  for(const p in $planets) {
    const storages = $planets[p].layout.pins.filter(planet => (
      types[planet.type_id].group_id == SPACEPORTS_ID ||
      types[planet.type_id].group_id == STORAGES_ID
    ))
    const storagesTotalFilling = storages.map(storage => ([
      storage.type_id,
      storage.contents.reduce((a,b) => a + b.amount * types[b.type_id].volume, 0)
    ]))
    const storagesFilling = storagesTotalFilling.map(([ id, content ]) => content / types[id].capacity)
    _storages[p] = Math.max(...storagesFilling)
  }

  return _storages
})


export const extractedCommoditys = derived<planetsType, derivedType<Commodity[]>>(planets, ($planets) => {
  const _commoditys = {}

  for(const _p in $planets) {
    const commoditys: Commodity[] = []
    for(const p of $planets[_p].layout.pins) {
      if(p?.extractor_details?.product_type_id) {
        const commodity = p.extractor_details.product_type_id;
        if(!commoditys.find(c => c.type == commodity)) {
          commoditys.push( new Commodity(commodity) )
        }
      }
    }
    _commoditys[_p] = commoditys
  }

  return _commoditys
})


export const porcessedCommoditys = derived<planetsType, derivedType<Commodity[]>>(planets, ($planets) => {
  const _commoditys = {}

  for(const _p in $planets) {
    const commoditys: Commodity[] = []
    for(const p of $planets[_p].layout.pins) {
      if(p?.schematic_id) {
        const commodity = schematics[p.schematic_id].output.typeID;
        if(!commoditys.find(c => c.type == commodity)) {
          commoditys.push( new Commodity(commodity) )
        }
      }
    }
    _commoditys[_p] = commoditys
  }

  return _commoditys
})


export const storedCommoditys = derived<planetsType, derivedType<Commodity[]>>(planets, ($planets) => {
  const _commoditys = {}

  for(const _p in $planets) {
    const commoditys: Commodity[] = []
    for(const p of $planets[_p].layout.pins) {
      if(p?.contents) {
        for(const c of p?.contents) {
          if(!commoditys.find(_c => _c.type == c.type_id)) {
            commoditys.push( new Commodity(c.type_id) )
          }
        }
      }
    }
    _commoditys[_p] = commoditys
  }

  return _commoditys
})