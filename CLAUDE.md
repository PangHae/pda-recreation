# PDA Recreation Web App

신한투자증권 프로디지털아카데미 6기 Mt 레크레이션 웹 앱

## Tech Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Realtime + Storage)
- Vercel

## Brand Colors
- shinhan-blue: #0046ff (primary)
- navy: #00236e
- royal-blue: #2878f5
- sky-blue: #4baff5
- light-blue: #8cd2f5

## Key Rules
- /scoreboard 만 공개 페이지
- /admin/setup, /admin/draw, /admin/games/* 는 PC 전용 (PcOnlyGuard 적용)
- /admin, /admin/menu, /admin/dashboard 는 모바일 허용
- 모든 mutations는 Server Actions 사용 (service role key 서버에만)
- 팀 추첨은 시각적으로만 랜덤 (실제 결과는 DB 사전 설정값)
- 점수는 atomic하게 처리: add_score Postgres RPC 사용
- Git 커밋은 기능 단위로 (예: "팀 구성 페이지 개발")

## Routing Structure
```
/                        → redirect to /scoreboard
/scoreboard              → 공개, 모바일 대응, 실시간 점수
/admin                   → 로그인 (비밀번호), 모바일 허용
/admin/menu              → 로그인 후 메뉴 허브, 모바일 허용
/admin/dashboard         → 점수 입력 (관리자 폰용), 모바일 허용
/admin/setup             → 팀원 사전 설정, PC 전용
/admin/draw              → 팀 추첨 애니메이션, PC 전용
/admin/games             → 게임 선택, PC 전용
/admin/games/[game]      → 게임 진행 화면, PC 전용
```

## Database Tables
- `teams` (id, name, color, total_score)
- `members` (id, name, team_id)
- `score_logs` (id, team_id, game_name, points, note, created_at)
- `settings` (key, value) — admin_password_hash 저장
- `questions` (id, game_type, content, answer, hint, image_url, order)
- `snacks` (id, name, image_url, order) — 흑백요리사용

## Commit Convention
기능 단위 한국어 커밋 메시지
예: "팀 구성 설정 페이지 추가", "초성 퀴즈 게임 화면 구현", "실시간 스코어보드 구현"
