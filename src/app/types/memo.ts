export type MemoInfo = {
    id: Readonly<number>;
    description: string;
    color?: string;
    deadline?: string;
    isComplete: boolean;
}
export type MemoInfoProps = keyof Omit<MemoInfo, "id">;
export type UpdateMemo = (memo: MemoInfo, propName: MemoInfoProps, newValue: MemoInfo[MemoInfoProps], index: number) => void;
export type DeleteMemo = (i: number) => void;

export const DEFAULT_BACKGROUND_COLOR = "#ccffbb" as const;