"use client";
import styles from "./page.module.css";
import { CreateMemo, CreatePartialMemoListInfo, MemoInfo, PartialMemoListInfo, UpdateMemo } from "./types/memo";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import PartialMemoList from "./ui/partial-memo-list";

export default function Home() {
  const [memos, setMemos] = useState<MemoInfo[]>([]);

  useEffect(() => {
    const startStr = localStorage.getItem("my-reminder");
    const start: MemoInfo[] = startStr ? JSON.parse(startStr) : [];
    setMemos(start);
  }, []);

  const updateDataInMemo: UpdateMemo = (memo, propName, newValue) => {
    if (memos.length === 0) return;
    const copyMemo = { ...memo };

    //クソダサい（
    if (newValue == null) return;
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
    const copyMemos = [...memos];
    copyMemos[copyMemos.findIndex(m => m.id === memo.id)] = copyMemo;
    recordAndSetMemos(copyMemos);
  }

  const createMemo = (i: number, template: CreateMemo) => {
    if (memos.length === 0) {
      return recordAndSetMemos([template(0)]);
    }
    const id = Math.max(...memos.map(m => m.id)) + 1;
    const copyMemos = [...memos].slice(0, i)?.concat(template(id), [...memos].slice(i));
    recordAndSetMemos(copyMemos);
  }

  const deleteMemo = (memo: MemoInfo) => {
    const copyMemos = memos.filter(m => m !== memo);
    recordAndSetMemos(copyMemos);
  }
  const recordAndSetMemos = (memos: MemoInfo[]) => {
    localStorage.setItem("my-reminder", JSON.stringify(memos));
    setMemos(memos);
  }

  const createPartialMemoListInfo: (
    memos: MemoInfo[],
    startNum: number,
    options: CreatePartialMemoListInfo
  ) => PartialMemoListInfo =
    (memos, startNum, { name, isPermitCreatingNewMemo, filter, deadlineFunction }) => {
      const filteredMemos = memos.filter(filter);
      return {
        name,
        isPermitCreatingNewMemo,
        memos: filteredMemos,
        startNum,
        deadlineFunction
      }
    };
  const createListInfo: CreatePartialMemoListInfo[] = [
    {
      name: "24時間以内 or 期限切れ",
      isPermitCreatingNewMemo: true,
      filter: (memo: MemoInfo) => {
        if (memo.isComplete) return false;
        if (memo.deadline == null || memo.deadline === "") return false;
        const now = dayjs().valueOf();
        const deadline = dayjs(memo.deadline).valueOf();
        return deadline - now < 1000 * 60 * 60 * 24;
      },
      deadlineFunction: () => dayjs().format("YYYY-MM-DDTHH:mm")
    },
    {
      name: "期限なし",
      isPermitCreatingNewMemo: true,
      filter: (memo: MemoInfo) => {
        if (memo.isComplete) return false;
        return memo.deadline == null || memo.deadline === "";
      },
    },
    {
      name: "タスク完了",
      isPermitCreatingNewMemo: false,
      filter: (memo: MemoInfo) => memo.isComplete,
    },
  ];

  let startNum = 0;
  const partialMemoLists: PartialMemoListInfo[] = [];
  for (let c of createListInfo) {
    const lists = createPartialMemoListInfo(memos, startNum, c);
    startNum += lists.memos.length;
    partialMemoLists.push(lists);
  }
  const exclusionMemoList = partialMemoLists.map(ml => ml.memos).flat();
  const otherMemoList = memos.filter(memo => !exclusionMemoList.includes(memo));
  partialMemoLists.push({
    name: "24時間以上",
    isPermitCreatingNewMemo: false,
    memos: otherMemoList,
    startNum
  });

  const createPartialMemoListElement = partialMemoLists.map((ml, i) =>
    <PartialMemoList
      name={ml.name}
      memos={ml.memos}
      startNum={ml.startNum}
      updater={updateDataInMemo}
      deleter={deleteMemo}
      adder={ml.isPermitCreatingNewMemo ? createMemo : undefined}
      deadline={ml.deadlineFunction}
      key={i}
    />
  );

  return (
    <main className={styles.main}>
      {createPartialMemoListElement}
    </main>
  );
}

