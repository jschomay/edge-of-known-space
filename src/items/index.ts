import FOV, { VisibilityCallback } from "../../lib/rotjs/fov/fov";

export default interface Item {
  key: string
  name: string
  color: string
  active: boolean
  getFOV(): { r: number, fov: FOV, cb: VisibilityCallback }
  onActivate(...any: any): void
  onDeactivate(): void
}
