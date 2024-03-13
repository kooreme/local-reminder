import { CreateMemo, MemoInfo } from "../types/memo";
import styles from "./add-memo.module.css"
export default function AddMemo({ i, onclick, deadline }: { i: number, onclick: (i: number, template: CreateMemo) => void, deadline?: () => string }) {
    const randomColor = (from = 0, to = 0) => (Math.floor(Math.random() * (to - from + 1)) + from).toString(16);
    const createBackgroundColor = () => `#${randomColor(195, 255)}${randomColor(195, 255)}${randomColor(195, 255)}`
    const template: (id: number) => MemoInfo = (id: number) => ({
        id: id,
        description: "",
        color: createBackgroundColor(),
        deadline: deadline ? deadline() : undefined,
        isComplete: false
    });
    return (
        <div className={styles.addMemo} onClick={() => { onclick(i, template) }} />
    );
}