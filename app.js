import cors from 'cors';
import express from 'express';
import session from 'express-session';
import {
  userRouter,
  postRouter,
  bookmarkRouter,
  commentRouter,
} from './routers/index.js';
import { errorHandler } from './middlewares/index.js';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger.js';

const app = express();

// CORS 에러 방지
app.use(
  cors({
    origin: '*', // 출처 허용 옵션
    credential: 'true', // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  })
);

// passport.js LocalStrategy 사용하는 경우 (+session)
app.use(session({ secret: process.env.COOKIE_SECRET }));

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
// body-parser가 내장되어 있음
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// Swagger (router 이전에 위치)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// api 라우팅
// 아래처럼 하면, userRouter 에서 '/login' 으로 만든 것이 실제로는 앞에 /api가 붙어서
// /api/login 으로 요청을 해야 하게 됨. 백엔드용 라우팅을 구분하기 위함임.
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/bookmarks', bookmarkRouter);
app.use('/api/comments', commentRouter);

// 순서 중요 (errorHandler은 다른 일반 라우팅보다 나중에 있어야 함)
// 그래야, 에러가 났을 때 next(error) 했을 때 여기로 오게 됨
app.use(errorHandler);

export { app };
