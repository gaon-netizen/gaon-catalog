가온스텐 웹 카탈로그 - 완성형

[바로 보는 방법]
1. 압축을 풉니다.
2. index.html을 더블클릭합니다.
3. 별도 서버나 CSV 선택 없이 전체 상품이 자동으로 표시됩니다.

[제품 수정 방법]
- 관리 원본은 products.csv입니다.
- 열 제목은 그대로 유지하세요:
  상품번호 / 제품명 / 카테고리 / 치수 / 규격 / 상세 / 사진파일
- 제품사진은 assets 폴더에 넣습니다.
- 사진파일 열에는 실제 파일명을 적습니다. 예: G-001.jpg

[중요]
- products.js는 홈페이지가 바로 열리도록 products.csv 내용을 웹용으로 변환해 둔 파일입니다.
- products.csv를 수정한 뒤에는 products.js도 다시 생성해야 홈페이지에 반영됩니다.
- 현재 버전은 index.html을 더블클릭해도 정상 작동하도록 구성되어 있습니다.

[공개]
- index.html / styles.css / app.js / products.js / assets 폴더를 함께 GitHub Pages 등에 올리면 됩니다.
