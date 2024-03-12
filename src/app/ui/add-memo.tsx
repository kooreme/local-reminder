import styles from "./add-memo.module.css"
export default function AddMemo({ i, onclick }: { i: number, onclick: (i: number) => void }) {
    return (
        <div className={styles.addMemo} onClick={() => onclick(i)} />
    );
}