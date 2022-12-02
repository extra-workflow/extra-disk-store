import { DiskStore } from '@src/disk-store'
import { IRecord } from 'extra-workflow'
import { DiskStore as ExtraDiskStore, DiskStoreView, JSONValueConverter } from 'extra-disk-store'

describe('DiskStore', () => {
  describe('set', () => {
    test('record does not exist', async () => {
      const cache = await ExtraDiskStore.create()
      const store = new DiskStore(createView(cache))
      const record: IRecord<string> = {
        type: 'result'
      , value: 'value'
      }

      store.set(0, record)

      expect(store.dump()).toStrictEqual([
        record
      ])
    })

    test('record exists', async () => {
      const cache = await ExtraDiskStore.create()
      const store = new DiskStore(createView(cache))
      const oldRecord: IRecord<string> = {
        type: 'result'
      , value: 'old-value'
      }
      store.set(0, oldRecord)
      const newRecord: IRecord<string> = {
        type: 'result'
      , value: 'new-value'
      }

      store.set(0, newRecord)

      expect(store.dump()).toStrictEqual([
        newRecord
      ])
    })
  })

  describe('get', () => {
    test('record exists', async () => {
      const cache = await ExtraDiskStore.create()
      const store = new DiskStore(createView(cache))
      const record: IRecord<string> = {
        type: 'result'
      , value: 'value'
      }
      store.set(0, record)

      const result = store.get(0)

      expect(result).toStrictEqual(record)
    })

    test('event does not exist', async () => {
      const cache = await ExtraDiskStore.create()
      const store = new DiskStore(createView(cache))

      const result = store.get(0)

      expect(result).toBeUndefined()
    })
  })

  describe('pop', () => {
    test('record exists', async () => {
      const cache = await ExtraDiskStore.create()
      const store = new DiskStore(createView(cache))
      const record: IRecord<string> = {
        type: 'result'
      , value: 'value'
      }
      store.set(0, record)

      const result = store.pop()

      expect(result).toStrictEqual(record)
      expect(store.dump()).toStrictEqual([])
    })

    test('record does not exist', async () => {
      const cache = await ExtraDiskStore.create()
      const store = new DiskStore(createView(cache))

      const result = store.pop()

      expect(result).toBeUndefined()
      expect(store.dump()).toStrictEqual([])
    })
  })

  test('clear', async () => {
    const cache = await ExtraDiskStore.create()
    const store = new DiskStore(createView(cache))
    const record: IRecord<string> = {
      type: 'result'
    , value: 'value'
    }
    store.set(0, record)

    store.clear()

    expect(store.dump()).toStrictEqual([])
  })

  test('dump', async () => {
    const cache = await ExtraDiskStore.create()
    const store = new DiskStore(createView(cache))
    const record1: IRecord<string> = {
      type: 'result'
    , value: 'value-1'
    }
    const record2: IRecord<string> = {
      type: 'result'
    , value: 'value-2'
    }
    store.set(0, record1)
    store.set(1, record2)

    const result = store.dump()

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
