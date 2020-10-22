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
    styleDir: string,
    content: string,
    contentDir: string,
    key: string,
    styles: Array<StartMultiScaleStyle>
}