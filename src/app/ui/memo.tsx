"use client";

import { useState } from "react";
import styles from "./memo.module.css";
import { DeleteMemo, MemoInfo, UpdateMemo } from "../types/memo";

type PermitTextColor = "white" | "black"

const COLOR_BASIS = 128 * 3;

export default function Memo({ i, info, updater, deleter }: { i: number, info: MemoInfo, updater: UpdateMemo, deleter: DeleteMemo }) {
    function calcTextColor(backgroundColor: string): PermitTextColor {
        const colorSum = backgroundColor
            .slice(1)
            .match(/.{2}/g)
            ?.map(str => Number.parseInt(str, 16))
            .reduce((a, b) => a + b);
        if (colorSum === undefined) return "black";
        return colorSum < COLOR_BASIS ? "white" : "black";
    }
    const { color: backgroundColor, deadline, description } = info;
    const [textColor, setTextColor] = useState(calcTextColor(backgroundColor ? backgroundColor : "#ffffff"));

    return (
        <>
            <div className={styles.memo} style={{ backgroundColor, color: textColor }}>
                <div className={styles.delete} onClick={() => deleter(info)} />
                <input type="checkbox" className={styles.checkbox} checked={info.isComplete} onChange={(e) => updater(info, "isComplete", e.target.checked)} />
                <div className={styles.maxcontent}>
                    <label htmlFor="deadline">期限：</label>
                    <input name="deadline" type="datetime-local"
                        className={`${styles.datetime} ${textColor === "black" ? styles.black : styles.white}`}
                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                        value={deadline}
                        onChange={(e) => updater(info, "deadline", e.target.value)}
                    />
                    <div className={styles.dummy}>
                        {description + "\u200b"}
                        <Textarea
                            color={textColor}
                            description={description}
                            change={(value) => updater(info, "description", value)}
                        />
                    </div>
                </div>
                <input className={styles.color} value={backgroundColor} type="color" onChange={(e) => {
                    setTextColor(calcTextColor(e.target.value));
                    updater(info, "color", e.target.value);
                }} />
            </div>
        </>
    );
}

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