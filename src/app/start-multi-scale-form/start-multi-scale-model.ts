import { StartMultiScaleStyle } from './start-multi-scale-style'

export interface StartMultiScaleModel {
    epochs: number[],
    contentWeight: number[],
    useReducedLayerSet: number[],
    runUntil: number,
    startFromDim: number,
    previousDim: number,
    imgRatio: number,
    gpu: boolean,
    content: string,
    key: string,
    styles: Array<StartMultiScaleStyle>
}
