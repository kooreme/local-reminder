import { useState } from "react";
import { PermitTextColor } from "../types/memo";
import styles from "./auto-resize-textarea.module.css";

//自動で入力範囲が拡縮するテキストエリア
export default function AutoResizeTextarea({ description, color, blur }: {
    description: string,
    color: PermitTextColor,
    blur: (value: string) => void,
}) {
    const [autoResize, setAutoResize] = useState(description);
    return (
        <div className={styles.description_base}>
            {autoResize + "\u200b"}
            <textarea
                style={{ color }}
                className={styles.description_textarea}
                defaultValue={description}
                onChange={(e) => setAutoResize(e.target.value)} //内容に合わせてテキストエリアを拡縮する。
                onBlur={(e) => blur(e.target.value)} //内容が確定すると親コンポーネントへ情報を伝達する。
            />
        </div>
    );
}