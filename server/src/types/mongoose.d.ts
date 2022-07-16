declare module "mongoose" {
  interface Query<T> {
    cache(options?: { key: string | number }): Query<T>
    useCache: boolean
    hashKey: string
  }
}
