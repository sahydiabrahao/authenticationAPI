export interface UpdateAccessTokenModel {
  updateAccessToken(id: string, token: string): Promise<void>;
}
