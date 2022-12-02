import { IRecord, IStore } from 'extra-workflow'
import { DiskStoreView } from 'extra-disk-store'
import { sortNumbersAscending } from 'extra-sort'
import { toArray, isntUndefined } from '@blackglory/prelude'
import { last } from 'iterable-operator'

export class DiskStore<T> implements IStore<T> {
  constructor(private view: DiskStoreView<number, IRecord<T>>) {}

  set(index: number, record: IRecord<T>): void {
    this.view.set(index, record)
  }

  get(index: number): IRecord<T> | undefined {
    return this.view.get(index)
  }

  pop(): IRecord<T> | undefined {
    const lastIndex = last(this.getIndexesAscending())
    if (isntUndefined(lastIndex)) {
      const record = this.get(lastIndex)!
      this.view.delete(lastIndex)
      return record
    }
  }

  clear(): void {
    this.view.clear()
  }

  dump(): Array<IRecord<T>> {
    return this.getIndexesAscending()
      .map(index => this.view.get(index)!)
  }

  private getIndexesAscending(): number[] {
    const indexes = toArray(this.view.keys())
    sortNumbersAscending(indexes)
    return indexes
  }
}
