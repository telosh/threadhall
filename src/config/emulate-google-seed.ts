/**
 * @emulators/google のシード。`oauth_clients` を置かないときは client_id / secret の厳格検証は行われず、
 * NextAuth から渡る値はダミーでよい（README の GitHub 例と同様）。
 *
 * ユーザーを増やすときは `users` に追記する。
 */
export const emulateGoogleSeed = {
  users: [
    {
      email: "dev.owner@threadhall.local",
      name: "開発オーナー",
      given_name: "開発",
      family_name: "オーナー",
    },
    {
      email: "dev.member@threadhall.local",
      name: "開発メンバー",
    },
    {
      email: "dev.guest@threadhall.local",
      name: "開発ゲスト",
    },
  ],
} as const;
