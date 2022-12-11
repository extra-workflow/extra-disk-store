import { IRecord, IStore } from 'extra-workflow'
import { DiskStoreView } from 'extra-disk-store'
import { sortNumbersAscending } from 'extra-sort'
import { toArrayAsync, isntUndefined } from '@blackglory/prelude'
import { map } from 'extra-promise'
import { last } from 'iterable-operator'

export class DiskStore<T> implements IStore<T> {
  constructor(private view: DiskStoreView<number, IRecord<T>>) {}

  async set(index: number, record: IRecord<T>): Promise<void> {
    await this.view.set(index, record)
  }

  async get(index: number): Promise<IRecord<T> | undefined> {
    return await this.view.get(index)
  }

  async pop(): Promise<IRecord<T> | undefined> {
    const lastIndex = last(await this.getIndexesAscending())
    if (isntUndefined(lastIndex)) {
      const record = await this.get(lastIndex)
      await this.view.delete(lastIndex)
      return record
    }
  }

  async clear(): Promise<void> {
    await this.view.clear()
  }

  async dump(): Promise<Array<IRecord<T>>> {
    const indexes = await this.getIndexesAscending()
    return await map(indexes, async index => {
      const result = await this.view.get(index)
      return result!
    })
  }

  private async getIndexesAscending(): Promise<number[]> {
    const indexes = await toArrayAsync(this.view.keys())
    sortNumbersAscending(indexes)
    return indexes
  }
}
