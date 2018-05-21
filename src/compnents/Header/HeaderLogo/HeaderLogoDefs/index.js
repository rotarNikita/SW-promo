import React from 'react';
import { MAIN_COLOR_1, MAIN_COLOR_2, HEADER_LOGO_SVG_DEF_ID } from "../../../../data/constants";
import generateKey from '../../../../generals/generateKey';

export default function HeaderLogoDefs () {
    return (
        <svg style={{display: 'none'}}>
            <defs>
                <symbol id={HEADER_LOGO_SVG_DEF_ID} viewBox={"61.4 194.3 323.1 187"}>
                    <g>
                        <polygon fill={'#FFFFFF'} points="123.4,194.3 183.3,226.3 123.4,258.2"/>
                        <polygon fill={'#FFFFFF'} points="123.4,194.3 61.4,226.3 123.4,258.2"/>
                        <polygon fill={'#FFFFFF'} points="123.4,319.3 183.3,350.6 123.4,381.3"/>
                        <polygon fill={'#FFFFFF'} points="123.4,319.3 61.4,350.3 123.4,381.3"/>
                        <polygon fill={'#FFFFFF'} points="123.4,258.2 183.3,290.2 123.4,319.3"/>
                        <polygon fill={'#FFFFFF'} points="123.4,258.2 61.4,288.3 123.4,319.3"/>
                        <polygon fill={'#FFFFFF'} points="61.4,226.3 123.4,258.2 61.4,288.3"/>
                        <polygon fill={'#FFFFFF'} points="183.3,290.2 123.4,319.3 183.3,350.6"/>

                        <polygon fill={MAIN_COLOR_1} points="123.4,194.3 183.3,226.3 123.4,258.2"/>
                        <polygon fill={MAIN_COLOR_1} points="123.4,194.3 61.4,226.3 123.4,258.2"/>
                        <polygon fill={MAIN_COLOR_1} points="123.4,319.3 183.3,350.6 123.4,381.3"/>
                        <polygon fill={MAIN_COLOR_1} points="123.4,319.3 61.4,350.3 123.4,381.3"/>
                        <polygon fill={MAIN_COLOR_2} points="123.4,258.2 183.3,290.2 123.4,319.3"/>
                        <polygon fill={MAIN_COLOR_2} points="123.4,258.2 61.4,288.3 123.4,319.3"/>
                        <polygon fill={MAIN_COLOR_2} points="61.4,226.3 123.4,258.2 61.4,288.3"/>
                        <polygon fill={MAIN_COLOR_2} points="183.3,290.2 123.4,319.3 183.3,350.6"/>
                    </g>
                    <g>
                        <polygon fill={'#FFFFFF'} points="253.6,257.6 286.3,321 319,257.6"/>
                        <polygon fill={'#FFFFFF'} points="253.6,257.6 286.3,194.1 319,257.6"/>

                        <polygon fill={MAIN_COLOR_1} points="253.6,257.6 286.3,321 319,257.6"/>
                        <polygon fill={MAIN_COLOR_1} points="253.6,257.6 286.3,194.1 319,257.6"/>
                    </g>
                    <g>
                        <polygon fill={'#FFFFFF'} points="286.3,321 253.6,382.5 220.8,321"/>
                        <polygon fill={'#FFFFFF'} points="286.3,321 253.6,257.6 220.8,321"/>
                        <polygon fill={'#FFFFFF'} points="188.1,257.6 220.8,321 253.6,257.6"/>
                        <polygon fill={'#FFFFFF'} points="188.1,257.6 220.8,194.1 253.6,257.6"/>
                        <polygon fill={'#FFFFFF'} points="319,257.6 351.8,321 384.5,257.6"/>
                        <polygon fill={'#FFFFFF'} points="319,257.6 351.8,194.1 384.5,257.6"/>
                        <polygon fill={'#FFFFFF'} points="351.8,321 319,382.5 286.3,321"/>
                        <polygon fill={'#FFFFFF'} points="351.8,321 319,257.6 286.3,321"/>

                        <polygon fill={MAIN_COLOR_2} points="286.3,321 253.6,382.5 220.8,321"/>
                        <polygon fill={MAIN_COLOR_2} points="286.3,321 253.6,257.6 220.8,321"/>
                        <polygon fill={MAIN_COLOR_2} points="188.1,257.6 220.8,321 253.6,257.6"/>
                        <polygon fill={MAIN_COLOR_2} points="188.1,257.6 220.8,194.1 253.6,257.6"/>
                        <polygon fill={MAIN_COLOR_2} points="319,257.6 351.8,321 384.5,257.6"/>
                        <polygon fill={MAIN_COLOR_2} points="319,257.6 351.8,194.1 384.5,257.6"/>
                        <polygon fill={MAIN_COLOR_2} points="351.8,321 319,382.5 286.3,321"/>
                        <polygon fill={MAIN_COLOR_2} points="351.8,321 319,257.6 286.3,321"/>
                    </g>
                </symbol>
            </defs>
        </svg>
    )
}

HeaderLogoDefs.id = generateKey();