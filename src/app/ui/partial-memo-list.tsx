import { CreateMemo, DeleteMemo, MemoInfo, UpdateMemo } from "../types/memo";
import AddMemo from "./add-memo";
import Memo from "./memo";
import styles from "./partial-memo-list.module.css";

export default function PartialMemoList({ name, memos, startNum, updater, deleter, adder, deadline }: {
    name: string
    memos: MemoInfo[]
    startNum: number
    updater: UpdateMemo
    deleter: DeleteMemo
    adder?: (i: number, template: CreateMemo) => void
    deadline?: () => string
}) {
    const OptionalAddMemo = (i: number) => {
        if (!adder) return <></>
        else return (
            <AddMemo i={i} onclick={adder} deadline={deadline} />
        )
    }
    const memoList = memos.map((memo, i) =>
        <div key={memo.id} className={styles.flexColumn}>
            <Memo i={i + startNum} info={memo} updater={updater} deleter={deleter} />
            {OptionalAddMemo(i + startNum + 1)}
        </div>
    );
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