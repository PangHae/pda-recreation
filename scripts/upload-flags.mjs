/**
 * 국기 퀴즈 이미지 업로드 & SQL 생성 스크립트
 * 쉬움(order 1~49) + 보통(order 50~117) 국가만 포함
 *
 * 실행 방법:
 *   node scripts/upload-flags.mjs > /tmp/flag-quiz-insert.sql
 */

import AdmZip from 'adm-zip';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '..', '.env.local') });

const ZIP_PATH = '/Users/panghae/Downloads/외교부_국가(지역)별 국기 이미지_20230210.zip';
const BUCKET = 'question-images';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// 쉬움 (order 1-49, TH 중복 제거)
const EASY = [
  { code: 'US', name: '미국' },
  { code: 'JP', name: '일본' },
  { code: 'CN', name: '중국' },
  { code: 'GB', name: '영국' },
  { code: 'FR', name: '프랑스' },
  { code: 'DE', name: '독일' },
  { code: 'IT', name: '이탈리아' },
  { code: 'BR', name: '브라질' },
  { code: 'AU', name: '호주' },
  { code: 'CA', name: '캐나다' },
  { code: 'MX', name: '멕시코' },
  { code: 'IN', name: '인도' },
  { code: 'RU', name: '러시아' },
  { code: 'ES', name: '스페인' },
  { code: 'TR', name: '터키' },
  { code: 'SA', name: '사우디아라비아' },
  { code: 'EG', name: '이집트' },
  { code: 'TH', name: '태국' },
  { code: 'ID', name: '인도네시아' },
  { code: 'AR', name: '아르헨티나' },
  { code: 'NL', name: '네덜란드' },
  { code: 'SE', name: '스웨덴' },
  { code: 'NO', name: '노르웨이' },
  { code: 'CH', name: '스위스' },
  { code: 'PT', name: '포르투갈' },
  { code: 'NZ', name: '뉴질랜드' },
  { code: 'ZA', name: '남아프리카공화국' },
  { code: 'GR', name: '그리스' },
  { code: 'PL', name: '폴란드' },
  { code: 'BE', name: '벨기에' },
  { code: 'AT', name: '오스트리아' },
  { code: 'DK', name: '덴마크' },
  { code: 'FI', name: '핀란드' },
  { code: 'HU', name: '헝가리' },
  { code: 'CZ', name: '체코' },
  { code: 'VN', name: '베트남' },
  { code: 'MY', name: '말레이시아' },
  { code: 'PH', name: '필리핀' },
  { code: 'SG', name: '싱가포르' },
  { code: 'UA', name: '우크라이나' },
  { code: 'IL', name: '이스라엘' },
  { code: 'IQ', name: '이라크' },
  { code: 'IR', name: '이란' },
  { code: 'PK', name: '파키스탄' },
  { code: 'NG', name: '나이지리아' },
  { code: 'KE', name: '케냐' },
  { code: 'ET', name: '에티오피아' },
  { code: 'MN', name: '몽골' },
  { code: 'CU', name: '쿠바' },
];

// 보통 (order 50-117, TZ 중복 제거)
const MEDIUM = [
  { code: 'CL', name: '칠레' },
  { code: 'CO', name: '콜롬비아' },
  { code: 'PE', name: '페루' },
  { code: 'VE', name: '베네수엘라' },
  { code: 'EC', name: '에콰도르' },
  { code: 'BO', name: '볼리비아' },
  { code: 'PY', name: '파라과이' },
  { code: 'UY', name: '우루과이' },
  { code: 'CR', name: '코스타리카' },
  { code: 'PA', name: '파나마' },
  { code: 'GT', name: '과테말라' },
  { code: 'HN', name: '온두라스' },
  { code: 'NI', name: '니카라과' },
  { code: 'SV', name: '엘살바도르' },
  { code: 'MA', name: '모로코' },
  { code: 'DZ', name: '알제리' },
  { code: 'TN', name: '튀니지' },
  { code: 'LY', name: '리비아' },
  { code: 'SD', name: '수단' },
  { code: 'GH', name: '가나' },
  { code: 'SN', name: '세네갈' },
  { code: 'CI', name: '코트디부아르' },
  { code: 'CM', name: '카메룬' },
  { code: 'AO', name: '앙골라' },
  { code: 'MZ', name: '모잠비크' },
  { code: 'TZ', name: '탄자니아' },
  { code: 'UG', name: '우간다' },
  { code: 'ZM', name: '잠비아' },
  { code: 'ZW', name: '짐바브웨' },
  { code: 'RW', name: '르완다' },
  { code: 'BD', name: '방글라데시' },
  { code: 'LK', name: '스리랑카' },
  { code: 'NP', name: '네팔' },
  { code: 'MM', name: '미얀마' },
  { code: 'KH', name: '캄보디아' },
  { code: 'LA', name: '라오스' },
  { code: 'AF', name: '아프가니스탄' },
  { code: 'UZ', name: '우즈베키스탄' },
  { code: 'KZ', name: '카자흐스탄' },
  { code: 'AZ', name: '아제르바이잔' },
  { code: 'GE', name: '조지아' },
  { code: 'AM', name: '아르메니아' },
  { code: 'BY', name: '벨라루스' },
  { code: 'MD', name: '몰도바' },
  { code: 'RS', name: '세르비아' },
  { code: 'HR', name: '크로아티아' },
  { code: 'SK', name: '슬로바키아' },
  { code: 'SI', name: '슬로베니아' },
  { code: 'RO', name: '루마니아' },
  { code: 'BG', name: '불가리아' },
  { code: 'LT', name: '리투아니아' },
  { code: 'LV', name: '라트비아' },
  { code: 'EE', name: '에스토니아' },
  { code: 'BH', name: '바레인' },
  { code: 'QA', name: '카타르' },
  { code: 'KW', name: '쿠웨이트' },
  { code: 'AE', name: '아랍에미리트' },
  { code: 'OM', name: '오만' },
  { code: 'JO', name: '요르단' },
  { code: 'YE', name: '예멘' },
  { code: 'LB', name: '레바논' },
  { code: 'SY', name: '시리아' },
  { code: 'IE', name: '아일랜드' },
  { code: 'IS', name: '아이슬란드' },
  { code: 'LU', name: '룩셈부르크' },
  { code: 'MC', name: '모나코' },
  { code: 'MT', name: '몰타' },
];

const COUNTRIES = [
  ...EASY.map((c, i) => ({ ...c, order: i + 1 })),
  ...MEDIUM.map((c, i) => ({ ...c, order: EASY.length + i + 1 })),
];

async function main() {
  const zip = new AdmZip(ZIP_PATH);
  const entries = zip.getEntries();

  // ZIP 내 파일명 맵: 코드(대문자) → 엔트리
  const zipMap = {};
  for (const entry of entries) {
    const base = path.basename(entry.entryName, path.extname(entry.entryName)).toUpperCase();
    zipMap[base] = entry;
  }

  const rows = [];
  const failed = [];

  for (const country of COUNTRIES) {
    const entry = zipMap[country.code];
    if (!entry) {
      process.stderr.write(`[WARN] 이미지 없음: ${country.code}\n`);
      failed.push(country.code);
      continue;
    }

    const ext = path.extname(entry.entryName).toLowerCase();
    const storagePath = `flags/${country.code}${ext}`;
    const buffer = entry.getData();

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: ext === '.gif' ? 'image/gif' : ext === '.png' ? 'image/png' : 'image/jpeg',
        upsert: true,
      });

    if (error) {
      process.stderr.write(`[ERROR] 업로드 실패 ${country.code}: ${error.message}\n`);
      failed.push(country.code);
      continue;
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    const imageUrl = urlData.publicUrl;

    rows.push(
      `('flag-quiz', '이 나라는?', '${country.name}', '${imageUrl}', ${country.order})`
    );

    process.stderr.write(`[OK] ${country.code} ${country.name} (order ${country.order})\n`);
  }

  if (rows.length > 0) {
    process.stdout.write(
      `INSERT INTO questions (game_type, content, answer, image_url, "order") VALUES\n` +
      rows.join(',\n') +
      `;\n`
    );
  }

  process.stderr.write(`\n완료: ${rows.length}개 성공, ${failed.length}개 실패\n`);
  if (failed.length > 0) {
    process.stderr.write(`실패 목록: ${failed.join(', ')}\n`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
