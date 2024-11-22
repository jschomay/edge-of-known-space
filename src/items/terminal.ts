import MainLevel from "../level"
import Item from "."

export default class TerminalItem implements Item {
  key: string = "0"
  name: string = "Terminal"
  color: string = "green"

  private _logs: string[] = []
  private _level: MainLevel

  constructor(level: MainLevel) {
    this._level = level
  }

  onActivate(logs: string[]) {
    this._logs = logs
    this._level.textBuffer.displayBox("Isn't this interesting!!")
  }

  onDeactivate() {
    this._level.textBuffer.clearDisplayBox()
  }
}
