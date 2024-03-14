import { CreateMemo, DeleteMemo, MemoInfo, UpdateMemo } from "../types/memo";
import AddMemo from "./add-memo";
import Memo from "./memo";
import styles from "./partial-memo-list.module.css";

//メモリストを描画するコンポーネント
export default function PartialMemoList({ name, memos, startNum, updater, deleter, adder, deadline }: {
    name: string
    memos: MemoInfo[]
    startNum: number
    updater: UpdateMemo
    deleter: DeleteMemo
    adder?: (i: number, template: CreateMemo) => void
    deadline?: () => string
}) {
    //メモ追加コンポーネントを描画するかどうかを決定する関数
    const OptionalAddMemo = (i: number) => {
        if (!adder) return <></>
        else return (
            <AddMemo i={i} onclick={adder} deadline={deadline} />
        )
    }
    //各メモコンポーネントを描画
    const memoList = memos.map((memo, i) =>
        <div key={memo.id} className={styles.flexColumn}>
            <Memo memoInfo={memo} updater={updater} deleter={deleter} />
            {OptionalAddMemo(i + startNum + 1)}
        </div>
    );
    //描画内容の返却
    return (
        <>
            <div className={styles.flexColumn}>
                <p className={styles.kindTitle}>{name}</p>
                {OptionalAddMemo(startNum)}
                {memoList}
            </div>
            <hr className={styles.hr} />
        </>
    );
}