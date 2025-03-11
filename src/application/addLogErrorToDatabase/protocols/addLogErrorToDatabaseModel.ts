export interface AddLogErrorToDatabaseModel {
  logError(error: string): Promise<void>;
}
