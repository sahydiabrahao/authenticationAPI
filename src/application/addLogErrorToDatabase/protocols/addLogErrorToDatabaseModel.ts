export interface AddLogErrorToDatabaseModel {
  log(error: string): Promise<void>;
}
