export interface DesignConfig {
  /**
   * 编辑器总行数
   */
  total_rows: number;
  /**
   * 编辑器总列数
   */
  total_columns: number;

  /**
   * 行高度
   */
  row_height: number;
}

export default {
  total_rows: 24,
  total_columns: 24,

  row_height: 48,
} satisfies DesignConfig;
