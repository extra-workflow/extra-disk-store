import { DiskStore } from '@src/disk-store'
import { IRecord } from 'extra-workflow'
import { DiskStore as ExtraDiskStore, DiskStoreView, JSONValueConverter } from 'extra-disk-store'

describe('DiskStore', () => {
  describe('set', () => {
    test('record does not exist', async () => {
      const cache = new ExtraDiskStore()
      const store = new DiskStore(createView(cache))
      const record: IRecord<string> = {
        type: 'result'
      , value: 'value'
      }

      await store.set(0, record)

      expect(await store.dump()).toStrictEqual([
        record
      ])
    })

    test('record exists', async () => {
      const cache = new ExtraDiskStore()
      const store = new DiskStore(createView(cache))
      const oldRecord: IRecord<string> = {
        type: 'result'
      , value: 'old-value'
      }
      await store.set(0, oldRecord)
      const newRecord: IRecord<string> = {
        type: 'result'
      , value: 'new-value'
      }

      await store.set(0, newRecord)

      expect(await store.dump()).toStrictEqual([
        newRecord
      ])
    })
  })

  describe('get', () => {
    test('record exists', async () => {
      const cache = new ExtraDiskStore()
      const store = new DiskStore(createView(cache))
      const record: IRecord<string> = {
        type: 'result'
      , value: 'value'
      }
      await store.set(0, record)

      const result = await store.get(0)

      expect(result).toStrictEqual(record)
    })

    test('event does not exist', async () => {
      const cache = new ExtraDiskStore()
      const store = new DiskStore(createView(cache))

      const result = await store.get(0)

      expect(result).toBeUndefined()
    })
  })

  describe('pop', () => {
    test('record exists', async () => {
      const cache = new ExtraDiskStore()
      const store = new DiskStore(createView(cache))
      const record: IRecord<string> = {
        type: 'result'
      , value: 'value'
      }
      await store.set(0, record)

      const result = await store.pop()

      expect(result).toStrictEqual(record)
      expect(await store.dump()).toStrictEqual([])
    })

    test('record does not exist', async () => {
      const cache = new ExtraDiskStore()
      const store = new DiskStore(createView(cache))

      const result = await store.pop()

      expect(result).toBeUndefined()
      expect(await store.dump()).toStrictEqual([])
    })
  })

  test('clear', async () => {
    const cache = new ExtraDiskStore()
    const store = new DiskStore(createView(cache))
    const record: IRecord<string> = {
      type: 'result'
    , value: 'value'
    }
    await store.set(0, record)

    await store.clear()

    expect(await store.dump()).toStrictEqual([])
  })

  test('dump', async () => {
    const cache = new ExtraDiskStore()
    const store = new DiskStore(createView(cache))
    const record1: IRecord<string> = {
      type: 'result'
    , value: 'value-1'
    }
    const record2: IRecord<string> = {
      type: 'result'
    , value: 'value-2'
    }
    await store.set(0, record1)
    await store.set(1, record2)

    const result = await store.dump()

    expect(result).toStrictEqual([
      record1
    , record2
    ])
  })
})

function createView(cache: ExtraDiskStore): DiskStoreView<number, IRecord<string>> {
  return new DiskStoreView(
    cache
  , {
      fromString: str => Number(str)
    , toString: index => index.toString()
    }
  , new JSONValueConverter()
  )
}
