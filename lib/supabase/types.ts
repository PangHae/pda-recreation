export type Team = {
  id: number
  name: string
  color: string
  total_score: number
}

export type Member = {
  id: number
  name: string
  team_id: number | null
}

export type ScoreLog = {
  id: number
  team_id: number
  game_name: string
  points: number
  note: string | null
  created_at: string
}

export type Question = {
  id: number
  game_type: string
  content: string
  answer: string | null
  hint: string | null
  image_url: string | null
  order: number
}

export type Snack = {
  id: number
  name: string
  image_url: string | null
  order: number
}

export type GameSlug = 'cho-sung' | 'i-sim' | 'silent-scream' | 'black-white-chef' | 'flag-quiz'
