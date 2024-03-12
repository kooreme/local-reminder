"use client";
import styles from "./page.module.css";
import Memo from "./ui/memo";
import { DEFAULT_BACKGROUND_COLOR, MemoInfo, UpdateMemo } from "./types/memo";
import { useEffect, useState } from "react";
import AddMemo from "./ui/add-memo";
import dayjs from "dayjs";

export default function Home() {
  const [memos, setMemos] = useState<MemoInfo[]>([]);

  useEffect(() => {
    const startStr = localStorage.getItem("my-reminder");
    const start: MemoInfo[] = startStr ? JSON.parse(startStr) : [];
    setMemos(start);
  }, []);

  const updateDataInMemo: UpdateMemo = (memo, propName, newValue, index) => {
    if (memos.length === 0) return;
    const copyMemo = { ...memo };

    //クソダサい（
    if (newValue != null) {
      switch (propName) {
        case "color":
        case "deadline":
        case "description":
          if (typeof newValue === "string") copyMemo[propName] = newValue;
          break;
        case "isComplete":
          if (typeof newValue === "boolean") copyMemo[propName] = newValue;
          break;
      }
    }
    const copyMemos = [...memos];
    copyMemos[index] = copyMemo;
    recordAndSetMemos(copyMemos);
  }

  const createMemo = (i: number) => {
    const create = (id: number) => ({
      id: id,
      description: "",
      color: DEFAULT_BACKGROUND_COLOR,
      deadline: dayjs().format("YYYY-MM-DDTHH:mm"),
      isComplete: false
    });

    if (memos.length === 0) return setMemos([create(0)]);

    const id = Math.max(...memos.map(m => m.id)) + 1;
    const copyMemos = [...memos].slice(0, i)?.concat(create(id), [...memos].slice(i));
    recordAndSetMemos(copyMemos);
  }
  const deleteMemo = (i: number) => {
    const copyMemos = memos.toSpliced(i, 1);
    recordAndSetMemos(copyMemos);
  }
  const recordAndSetMemos = (memos: MemoInfo[]) => {
    localStorage.setItem("my-reminder", JSON.stringify(memos));
    setMemos(memos);
  }

  const memoLists = memos?.map((memo, i) =>
    <div key={memo.id} className={styles.memoList}>
      <Memo i={i} info={memo} updater={updateDataInMemo} deleter={deleteMemo} />
      <AddMemo i={i + 1} onclick={createMemo} />
    </div>
  );
  return (
    <main className={styles.main}>
      <AddMemo i={0} onclick={createMemo} />
      {memoLists}
    </main>
  );
}

