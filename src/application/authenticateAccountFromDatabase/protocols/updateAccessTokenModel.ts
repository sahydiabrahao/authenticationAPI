export interface UpdateAccessTokenModel {
  update(id: string, token: string): Promise<void>;
}
