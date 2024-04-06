export interface UserData {
  lineNumber: number
  round: number
  level: number
  autocomplete: boolean
}

export interface UserStats {
  level: number
  round: number
  author: string
  name: string
  year: string
  stats: StatsData
}

export interface StatsData {
  [key: string]: boolean | null
}
