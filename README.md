# 📘 EventBoard - 이벤트 보상 시스템

NestJS + MongoDB 기반의 이벤트 보상 플랫폼입니다.  
이벤트 생성, 보상 등록, 유저 요청, 관리자 확인 등 **이벤트 운영 전 과정**을 지원합니다.

---

## 🧩 시스템 구성

### 📦 서비스 아키텍처 (MSA 구조)

| 서비스명              | 설명                                  |
|-------------------|-------------------------------------|
| **EventBoard**      | 사용자 UI (Next.js 기반). 유저/관리자 이벤트 관리 화면 제공                       |
| **Gateway Service**      | 모든 요청을 받는 진입점. 인증/권한 확인, 프록시 라우팅 처리 |
| **Auth Service**  | 유저 등록, 로그인, 역할(role) 관리, JWT 발급 담당  |
| **Event Service** | 이벤트 생성/조회, 보상 등록/조회, 보상 요청/이력 관리    |

---

## ⚙️ 실행 방법 (Docker 기반)

### 1.  전체 서비스 실행
```bash
  docker-compose up --build
```

### 2.  종료
```bash
  docker-compose down
```

## 💻 접속 방법 
```
http://localhost:3005
```

## 💡 주요 기능
### ✅ 인증 및 권한
- JWT 기반 인증

- USER / OPERATOR / AUDITOR / ADMIN 역할별 권한 구분

- NestJS의 @Roles, AuthGuard, RolesGuard 적용

### ✅ 이벤트 관리
- 이벤트 생성 (조건, 기간, 상태 포함)

- 보상 등록 (포인트 / 아이템 / 마일리지 - 1개만 등록 가능)

- 이벤트별 보상 요청 가능 여부 제어

### ✅ 유저 보상 요청
- 로그인 횟수 기반 조건 검증

- 중복 요청 방지

- 요청 성공/실패 및 사유 기록

### ✅ 이력 확인
- 유저: 본인 요청 내역 확인 가능

- 관리자(OPERATOR, AUDITOR, ADMIN): 전체 요청 이력 확인 가능

## 🛠️ 이벤트 설계 및 검증 방식
### 🎯 이벤트 조건
- 기본: 로그인 n일 이상

- 실제 조건은 유저 정보 기반으로 서버에서 검증

- 향후 조건 확장 가능 (주간 퀘스트, 보스 클리어 등)

### 🧪 조건 검증 방식
- 보상 요청 시 서버에서 다음을 검증:

- 이벤트 기간 내 요청 여부

- 이벤트 활성 상태 여부

### 유저 조건 충족 여부 (ex. 로그인 횟수)

- 🧱 API 구조 및 라우팅
- ✅ 설계 기준
- 각 서비스는 MSA 원칙에 따라 분리

- Gateway 서버는 인증/권한 검사 후 내부 서비스로 요청 프록시

- 각 서비스는 역할에 따른 책임만 수행

### 🌐 요청 예시

| 라우팅   | 경로                      | 대상 서비스               |
|---------|--------------------------|-------------------------|
| POST    | /auth/register           | Auth Service            |
| POST    | /auth/login              | Auth Service            |
| POST    | /events                  | Event Service           |
| POST    | /reward-requests         | Event Service           |
| GET     | /reward-requests/me      | Event Service           |
| GET     | /reward-requests/history | Event Service           |


## 🧭 API 구조 선택 이유

- **도메인 분리**: 인증(Auth), 이벤트(Event), 프론트(UI) 간 명확한 책임 분리를 통해 유지보수성과 확장성 확보
- **Gateway 단일 진입점**: 모든 API 요청을 Gateway에서 처리함으로써 보안 제어, 인증 검증, 로깅 및 추후 Rate Limit 설정이 용이
- **역할 기반 API 보호**: 각 API는 `@Roles()` 데코레이터를 통해 접근 가능 역할을 지정 → 운영자 / 유저 / 감사자 분리
- **NestJS 특징 활용**:
    - `AuthGuard`, `JwtStrategy`, `RolesGuard` 등을 활용한 인증/인가 일관성
    - MSA 간 통신은 Axios + `HttpService`를 통해 안정적으로 구성
- **확장 고려**: 추후 이벤트 통계, 쿠폰 연동, 외부 알림 API 추가 시 서비스 단위로 수평 확장 가능


## 🤔 구현 중 고민 및 해결
###  🔐 MSA 환경에서의 인증 공유
- JWT는 Gateway에서만 검증, 내부 서비스는 인증된 요청만 받음

- 사용자 정보는 JWT payload에서 추출하여 전달됨

###  ✅ 조건 검증 구조
- 이벤트 조건은 event-service에서 유저 데이터를 통해 검증

- 확장 가능한 구조 (조건 enum 기반 설계)

###  🌐 프론트 연동 오류 대응
-  인증 실패(401), CORS 등 문제 발생

- useEffect 내부에서 토큰 로드 후 API 호출 방식으로 해결

##  🧩 기타 참고
-  모든 API는 NestJS 기반 RESTful 구조

-  데이터 저장은 MongoDB 사용

-  Next.js 프론트는 http://localhost:3005 에서 실행

-  향후 Redis, Swagger, 캐시, RBAC 확장 가능