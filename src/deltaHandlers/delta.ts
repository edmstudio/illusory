import { IllusoryElement } from '../IllusoryElement'
import { parseTransformOrigin } from '../parsers/parseTransformOrigin'

interface IDelta {
  x: number
  y: number
  scaleX: number
  scaleY: number
  inverseScaleX: number
  inverseScaleY: number
}

type DeltaHandlerFunction = (delta: IDelta, deltaStyle: string, thisStyle: string) => string
interface IDeltaHandlerMap {
  [propertyName: string]: DeltaHandlerFunction
}
interface IDeltaHandlerConfigMap {
  [propertyName: string]: DeltaHandlerFunction | false
}

const DELTA_PASS_THROUGH_HANDLER: DeltaHandlerFunction = (_, __, thisStyle) => thisStyle

function getDelta(start: IllusoryElement, end: IllusoryElement): IDelta {
  const origin = parseTransformOrigin(start.getStyle('transformOrigin'))
  const naturalToCloneScale = start.naturalToCloneScale

  const scaleX = naturalToCloneScale * end.rect.width / start.rect.width
  const scaleY = naturalToCloneScale * end.rect.height / start.rect.height

  const inverseScaleX = 1 / scaleX
  const inverseScaleY = 1 / scaleY

  const originDisplacementX = naturalToCloneScale * (origin.x / start.rect.width) * (end.rect.width * (1 - inverseScaleX))
  const originDisplacementY = naturalToCloneScale * (origin.y / start.rect.height) * (end.rect.height * (1 - inverseScaleY))

  const x = end.rect.left - start.rect.left + originDisplacementX
  const y = end.rect.top - start.rect.top + originDisplacementY

  return {
    x,
    y,
    scaleX,
    scaleY,
    inverseScaleX,
    inverseScaleY
  }
}

export { getDelta, DeltaHandlerFunction, IDeltaHandlerMap, IDeltaHandlerConfigMap, IDelta, DELTA_PASS_THROUGH_HANDLER }
