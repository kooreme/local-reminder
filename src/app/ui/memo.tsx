"use client";

import { useState } from "react";
import styles from "./memo.module.css";
import { DeleteMemo, MemoInfo, UpdateMemo } from "../types/memo";

//文字色を白or黒に固定する。
type PermitTextColor = "white" | "black"

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
                <div className={styles.delete} onClick={() => deleter(memoInfo)} />
                <input type="checkbox" className={styles.checkbox} checked={memoInfo.isComplete} onChange={(e) => updater(memoInfo, "isComplete", e.target.checked)} />
                <div className={styles.maxcontent}>
                    <label htmlFor="deadline">期限：</label>
                    <input name="deadline" type="datetime-local"
                        className={`${styles.datetime} ${textColor === "black" ? styles.black : styles.white}`}
                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                        value={deadline}
                        onChange={(e) => updater(memoInfo, "deadline", e.target.value)}
                    />
                    <div className={styles.dummy}>
                        {description + "\u200b"}
                        <Textarea
                            color={textColor}
                            description={description}
                            change={(value) => updater(memoInfo, "description", value)}
                        />
                    </div>
                </div>
                <input className={styles.color} value={backgroundColor} type="color" onChange={(e) => {
                    setTextColor(calcTextColor(e.target.value));
                    updater(memoInfo, "color", e.target.value);
                }} />
            </div>
        </>
    );
}

//メモ内のテキストエリア用コンポーネント
function Textarea({ description, color, change }: {
    description: string,
    color: PermitTextColor,
    change: (value: string) => void,
}) {
    return (
        <textarea
            style={{ color }}
            className={styles.description}
            value={description}
            onChange={(e) => change(e.target.value)}
        />
    );
}