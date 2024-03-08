export type MemoInfo = {
    id: Readonly<number>
    description: string
    color?: string
    deadline?: string;
}
export type MemoInfoProps = keyof Omit<MemoInfo, "id">;
export type MemoInfoPropertyValues = (MemoInfo)[MemoInfoProps];
export type UpdateFactory = (propName: MemoInfoProps) => <T extends MemoInfoPropertyValues>(memo: MemoInfo, newValue: T, index: number) => void;
export const DEFAULT_BACKGROUND_COLOR = "#ccffbb" as const;