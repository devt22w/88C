# Product image checklist

One picture per product — **39 uploads cover every card on the site.** The
picture is keyed to the product, not to the position, so the same upload shows
on the home page, on every category page it belongs to, and on its product page.

Listed in the reference's **ALL** running order (4 pages × 12). The category
columns show where the same product also appears.

## How to link one

1. Supabase → Storage → `site-images` → upload the photo (square works best).
2. Copy its public URL.
3. Run, with the slot name from the table:

```sql
update public.image_slots
   set url = 'https://qvclouuywvogodrajpvm.supabase.co/storage/v1/object/public/site-images/<your-file>.jpg', updated_at = now()
 where slot = '<slot from the table>' and locale is null;
```

## The 39 slots

| ALL # | Page | Product | Slot | Also on |
| --- | --- | --- | --- | --- |
| 1 | 1 | 콜라겐 비타 링클 멀티 비비크림 | `product_thumb_f10` | FACE #12 |
| 2 | 1 | 원콧 픽싱 틴트 | `product_thumb_l7` | LIP #12 |
| 3 | 1 | UV 데일리 에어리 선스틱 SPF50+ PA++++ | `product_thumb_f9` | FACE #11 |
| 4 | 1 | UV 데일리 모이스처 선스틱 SPF50+ PA++++ | `product_thumb_f8` | FACE #10 |
| 5 | 1 | 쥬시 핏 틴트 | `product_thumb_n1` | LIP #11 · home NEW #1 |
| 6 | 1 | 다크스팟 제로 미백크림 | `product_thumb_n2` | FACE #9 · home NEW #2 |
| 7 | 1 | 비건 스피큘 샷 립플럼퍼 | `product_thumb_n3` | LIP #10 · home NEW #3 |
| 8 | 1 | [기획세트] 페이크 업 3색 쉐딩 + 쉐딩 브러쉬 | `product_thumb_f7` | FACE #8 |
| 9 | 1 | 테이퍼 캔들 멜팅 밤 | `product_thumb_l6` | LIP #9 |
| 10 | 1 | 듀이 워터 블러 틴트 | `product_thumb_l5` | LIP #8 |
| 11 | 1 | 프랑스산 100% 콜라겐 리프팅 세럼 | `product_thumb_f6` | FACE #7 |
| 12 | 1 | 쉐이드 무드 아이팔레트 9구 #뮤티드포션 | `product_thumb_e5` | EYE #10 |
| 13 | 2 | 듀이 오버 립 글로스 | `product_thumb_l4` | LIP #7 |
| 14 | 2 | 파우더 블러 틴트 | `product_thumb_l3` | LIP #6 |
| 15 | 2 | 글로우 멜팅 립스틱 | `product_thumb_b1` | LIP #5 · home BEST #1 |
| 16 | 2 | 듀이 워터 글로우 립틴트 | `product_thumb_b7` | LIP #4 · home BEST #7 |
| 17 | 2 | 페이크업 헤어 커버 스틱 | `product_thumb_f5` | FACE #6 |
| 18 | 2 | 파우더 매트 립스틱 | `product_thumb_b5` | LIP #3 · home BEST #5 |
| 19 | 2 | 프랑스산100% 콜라겐 비타 링클 멀티밤 | `product_thumb_b8` | FACE #5 · home BEST #8 |
| 20 | 2 | 워터프루프 타투 펜 아이라이너 | `product_thumb_b4` | EYE #9 · home BEST #4 |
| 21 | 2 | 맥퀸뉴욕 유자 비타C 클리어 토너 패드 100매 / 대용량 닦토 | `product_thumb_f4` | FACE #4 |
| 22 | 2 | 아이래쉬 컬링 뷰러 | `product_thumb_a4` | ACC&TOOL #4 |
| 23 | 2 | 워터프루프 펜슬 젤 아이라이너 빅사이즈 | `product_thumb_e4` | EYE #8 |
| 24 | 2 | 1001 톤온톤 섀도우 팔레트 프로9구 #누드무드 | `product_thumb_b6` | EYE #7 · home BEST #6 |
| 25 | 3 | 베러 댄 키스 립밤 | `product_thumb_l2` | LIP #2 |
| 26 | 3 | 쥬얼포텐 아이글리터 | `product_thumb_e3` | EYE #6 |
| 27 | 3 | 마이크로핏 파우더 팩트 | `product_thumb_f3` | FACE #3 |
| 28 | 3 | 아이섀도우 브러쉬 | `product_thumb_a3` | ACC&TOOL #3 |
| 29 | 3 | 마이스트롱 오토 아이브로우 | `product_thumb_b2` | EYE #5 · home BEST #2 |
| 30 | 3 | 치크 & 쉐딩 브러쉬 | `product_thumb_a2` | ACC&TOOL #2 |
| 31 | 3 | 마이 결핏 타투 아이브로우 | `product_thumb_b9` | EYE #4 · home BEST #9 |
| 32 | 3 | 페이크 업 3색 쉐딩 | `product_thumb_f2` | FACE #2 |
| 33 | 3 | 마이 스트롱 아이브로우펜슬-하드파우더 | `product_thumb_e2` | EYE #3 |
| 34 | 3 | 루비셀퍼프 SET | `product_thumb_a1` | ACC&TOOL #1 |
| 35 | 3 | 익스트림 볼륨 포텐카라 | `product_thumb_e1` | EYE #2 |
| 36 | 3 | 워터프루프 펜 아이라이너 | `product_thumb_b3` | EYE #1 · home BEST #3 |
| 37 | 4 | UV 데일리 선크림 (SPF50+ PA+++) | `product_thumb_f1` | FACE #1 |
| 38 | 4 | 러빙유 틴트 글로우 립밤 | `product_thumb_l1` | LIP #1 |
| 39 | 4 | 멜팅 블러 틴트 | `product_thumb_l8` | LIP #13 |

## Still empty after these

Hero art (`hero_slide_1` … `_3`), the two mid banners, `mid_badge`,
`logo_footer`, the footer and SNS-login brand icons, and the optional
product-page gallery frames (`product_gallery_<id>_1` … `_6`).
