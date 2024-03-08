"use client";

import { useState } from "react";
import styles from "./memo.module.css";
import { MemoInfo, UpdateFactory } from "../types/memo";

type WhiteBlack = "white" | "black"

const COLOR_BASIS = 128 * 3;

export default function Memo({ i, info, updateFactory }: { i: number, info: MemoInfo, updateFactory: UpdateFactory }) {
    function checkColor(backgroundColor: string): WhiteBlack {
        const colorSum = backgroundColor
            .slice(1)
            .match(/.{2}/g)
            ?.map(str => Number.parseInt(str, 16))
            .reduce((a, b) => a + b);
        if (colorSum === undefined) return "black";
        return colorSum < COLOR_BASIS ? "white" : "black";
    }
    const { color: backgroundColor, deadline, description } = info;
    const [color, setColor] = useState(checkColor(backgroundColor ? backgroundColor : "#ffffff"));
    return (
        <>
            <div className={styles.memo} style={{ backgroundColor, color }}>
                <div className={styles.maxcontent}>
                    <label htmlFor="deadline">期限：</label>
                    <input name="deadline" type="datetime-local"
                        className={`${styles.datetime} ${color === "black" ? styles.black : styles.white}`}
                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                        value={deadline}
                        onChange={(e) => updateFactory("deadline")(info, e.target.value, i)}
                    />
                    <div className={styles.dummy}>
                        {description + "\u200b"}
                        <Textarea
                            color={color}
                            description={description}
                            change={(value) => updateFactory("description")(info, value, i)}
                        />
                    </div>
                </div>
                <input className={styles.color} value={backgroundColor} type="color" onChange={(e) => {
                    setColor(checkColor(e.target.value));
                    updateFactory("color")(info, e.target.value, i);
                }} />
            </div>
        </>
    );
}

function Textarea({ description, color, change }: {
    description: string,
    color: WhiteBlack,
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