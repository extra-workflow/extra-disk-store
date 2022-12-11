# @extra-workflow/extra-disk-store
## Install
```sh
npm install --save @extra-workflow/extra-disk-store
# or
yarn add @extra-workflow/extra-disk-store
```

## API
### DiskStore
```ts
class DiskStore<T> implements IStore<T> {
  constructor(view: DiskStoreView<number, IRecord<T>>)
}
```
