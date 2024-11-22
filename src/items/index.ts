export default interface Item {
  key: string
  name: string
  color: string
  onActivate(...any: any): void
}
