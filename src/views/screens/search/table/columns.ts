type RenderValue = (v: string) => JSX.Element | string | null;
type RenderRecord = (r: Record<string, string>) => JSX.Element | string;
type RenderComplexRecord = (v: string, r: any) => JSX.Element | string;

export interface TColumn {
  title: string | JSX.Element;
  dataIndex?: string | string[];
  name?: string | string[];
  width?: number;
  summary?: boolean;
  render?: RenderValue | RenderRecord | RenderComplexRecord;
  children?: TColumn[];
  key?: string;
}
