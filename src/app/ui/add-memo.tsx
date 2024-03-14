import { CreateMemo, MemoInfo } from "../types/memo";
import styles from "./add-memo.module.css"

//メモ追加コンポーネント
export default function AddMemo({ i, onclick, deadline }: { i: number, onclick: (i: number, template: CreateMemo) => void, deadline?: () => string }) {
    //特定範囲の乱数を16進数表記で生成する
    const randomColor = (from = 0, to = 0) => (Math.floor(Math.random() * (to - from + 1)) + from).toString(16);
    //背景色文字列をランダムに生成
    const createBackgroundColor = () => `#${randomColor(195, 255)}${randomColor(195, 255)}${randomColor(195, 255)}`

    //作成するメモのテンプレート
    const template: (id: number) => MemoInfo = (id: number) => ({
        id: id,
        description: "",
        color: createBackgroundColor(),
        deadline: deadline ? deadline() : undefined,
        isComplete: false
    });
    //描画内容の返却。クリック時、メモのテンプレート関数を親コンポーネントに渡して処理してもらう
    return (
        <div className={styles.addMemo} onClick={() => { onclick(i, template) }} />
    );
}