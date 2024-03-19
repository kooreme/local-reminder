"use client";

import { useState } from "react";
import styles from "./memo.module.css";
import { DeleteMemo, MemoInfo, PermitTextColor, UpdateMemo } from "../types/memo";
import AutoResizeTextarea from "./auto-resize-textarea";
import DateTimeLocal from "./datetime-local";
import CloseMemo from "./close-memo";

//文字色の変更基準
const COLOR_BASIS = 128 * 3;

//メモコンポーネント
export default function Memo({ memoInfo, updater, deleter }: { memoInfo: MemoInfo, updater: UpdateMemo, deleter: DeleteMemo }) {
    //文字色決定関数
    function calcTextColor(backgroundColor: string): PermitTextColor {
        //背景色をRGBの3値に分解、その合計値を基準と照らし合わせる。
        const colorSum = backgroundColor
            ?.slice(1)
            ?.match(/.{2}/g)
            ?.map(str => Number.parseInt(str, 16))
            .reduce((a, b) => a + b);
        if (colorSum === undefined) return "black";
        return colorSum < COLOR_BASIS ? "white" : "black";
    }
    const { color: backgroundColor, deadline, description } = memoInfo;

    //文字色をリアクティブに変更する
    const [textColor, setTextColor] = useState(calcTextColor(backgroundColor ? backgroundColor : "#ffffff"));

    //描画内容の返却
    return (
        <>
            <div className={styles.memo} style={{ backgroundColor, color: textColor }}>
                <CloseMemo deleter={() => deleter(memoInfo)} />
                <input type="checkbox" className={styles.checkbox} checked={memoInfo.isComplete} onChange={(e) => updater(memoInfo, "isComplete", e.target.checked)} />
                <div className={styles.maxcontent}>
                    <label htmlFor="deadline">期限：</label>
                    <DateTimeLocal
                        styleName={textColor}
                        datetime={deadline}
                        blur={(value) => updater(memoInfo, "deadline", value)}
                    />
                    <AutoResizeTextarea
                        description={description}
                        color={textColor}
                        blur={(value) => updater(memoInfo, "description", value)}
                    />
                </div>
                <input className={styles.color} value={backgroundColor} type="color" onChange={(e) => {
                    setTextColor(calcTextColor(e.target.value));
                    updater(memoInfo, "color", e.target.value);
                }} />
            </div>
        </>
    );
}