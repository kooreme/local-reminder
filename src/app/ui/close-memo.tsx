import styles from "./close-memo.module.css";

export default function CloseMemo({ deleter }: { deleter: () => void }) {
    return (
        <div className={styles.delete} onClick={() => deleter()} />
    );
}