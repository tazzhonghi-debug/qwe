import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_INSTRUCTION_TEXT = [
  '당신은 온담컴퍼니 2027 봄 워크숍 안내를 돕는 한국어 AI 챗봇입니다.',
  '반드시 아래 [행사 안내 자료]에 적힌 사실만을 바탕으로 한국어로 정중하고 간결하게 답하세요.',
  '질문한 내용(예: 준비물, 신청 방법, 세부 일정, 식사, 교통편, 연락처 등)이 아래 안내 자료에 없으면 절대 추측하거나 지어내지 말고 반드시 "안내 자료에 없습니다"라고 답하세요.',
  '답변은 마크다운 기호(*, #, **, ``` 등)를 쓰지 말고 일반 텍스트로만 작성하세요.',
  '',
  '[행사 안내 자료]',
  "- 행사명: 2027 봄 워크숍 '함께 걷는 하루'",
  '- 한 줄 소개: 봄날, 동료와 나란히 걷는 하루',
  '- 주최: 온담컴퍼니 경영지원팀',
  "- 행사 소개: 온담컴퍼니 경영지원팀이 전 직원을 위해 마련한 2027 봄 워크숍 '함께 걷는 하루'는 광교호수공원에서 봄의 정취를 느끼며 함께 걷는 사내 행사입니다. 일상 업무에서 잠시 벗어나 동료들과 나란히 발걸음을 맞추며 편하게 소통하고 재충전하는 시간을 갖고자 합니다.",
  '- 일시: 2027년 4월 16일(금) 09:30~16:00',
  '- 장소: 광교호수공원',
  '- 대상: 온담컴퍼니 전 직원',
  '- 하루 일정:',
  '  09:30 집결, 출석 확인',
  '  10:00 여는 말씀',
  '  10:30 팀별 걷기 미션',
  '  12:00 점심 (장소 미정)',
  "  13:30 팀 대화 '올해 우리 팀'",
  '  15:00 사진 촬영, 정리',
  '  16:00 해산',
  '- 오시는 곳: 광교호수공원 (지도 링크 제공)',
  '- 우천 시 안내: 미정',
  '- 챙겨 오세요 (준비물): 편한 운동화, 개인 물병, 가벼운 겉옷, 사원증',
  '- 신청 마감: 4월 2일(금)',
  '- 신청 방법: 안내 페이지의 "참석 신청하기" 버튼을 눌러 신청 폼(Google Forms)에서 신청',
  '- 문의처: 온담컴퍼니 경영지원팀',
  '- 연락처: 미정',
  '- 비고: 교육용 가상 행사입니다',
].join('\n');

interface ChatPartInput {
  text?: unknown;
}

interface ChatTurnInput {
  role?: unknown;
  parts?: unknown;
}

interface SanitizedTurn {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

function sanitizeContents(rawContents: unknown): SanitizedTurn[] {
  if (!Array.isArray(rawContents)) {
    return [];
  }

  const sanitized: SanitizedTurn[] = [];
  for (const item of rawContents.slice(-20)) {
    if (!item || typeof item !== 'object') {
      continue;
    }
    const turn = item as ChatTurnInput;
    const role = turn.role === 'model' ? 'model' : turn.role === 'user' ? 'user' : null;
    if (!role || !Array.isArray(turn.parts)) {
      continue;
    }

    const parts: Array<{ text: string }> = [];
    for (const partItem of turn.parts) {
      if (partItem && typeof partItem === 'object') {
        const textValue = (partItem as ChatPartInput).text;
        if (typeof textValue === 'string') {
          const trimmed = textValue.trim();
          if (trimmed.length > 0 && trimmed.length <= 2000) {
            parts.push({ text: trimmed });
          }
        }
      }
    }

    if (parts.length > 0) {
      sanitized.push({ role, parts });
    }
  }

  return sanitized;
}

function getErrorInfo(err: unknown): { status: number; message: string } {
  const errObj = err && typeof err === 'object' ? (err as Record<string, unknown>) : {};
  const rawStatus =
    typeof errObj.status === 'number'
      ? errObj.status
      : typeof errObj.statusCode === 'number'
        ? errObj.statusCode
        : 500;
  const rawMessage = typeof errObj.message === 'string' ? errObj.message : '';

  if (
    rawStatus === 400 &&
    (rawMessage.includes('API_KEY') || rawMessage.toLowerCase().includes('api key'))
  ) {
    return {
      status: 400,
      message:
        'API 키 오류가 발생했습니다. Settings > Secrets 패널에서 GEMINI_API_KEY 설정을 확인해 주세요.',
    };
  }

  if (rawStatus === 401 || rawStatus === 403 || rawMessage.includes('PERMISSION_DENIED')) {
    return {
      status: 403,
      message:
        'API 키 접근 권한이 없습니다. Settings > Secrets 패널에서 GEMINI_API_KEY 설정을 확인해 주세요.',
    };
  }

  if (rawStatus === 429 || rawMessage.includes('RESOURCE_EXHAUSTED')) {
    return {
      status: 429,
      message:
        'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도하거나 Settings > Secrets 패널의 API 키 할당량을 확인해 주세요.',
    };
  }

  if (rawStatus === 404 || rawMessage.includes('NOT_FOUND')) {
    return {
      status: 404,
      message: '요청한 AI 모델을 찾을 수 없습니다. 모델 설정을 확인해 주세요.',
    };
  }

  if (rawStatus === 400 && rawMessage.includes('FAILED_PRECONDITION')) {
    return {
      status: 400,
      message: 'API 요청 조건을 충족하지 못했습니다. Settings > Secrets 패널 및 프로젝트 설정을 확인해 주세요.',
    };
  }

  if (rawStatus === 503 || rawMessage.includes('UNAVAILABLE')) {
    return {
      status: 503,
      message: '현재 AI 모델에 요청이 몰려 일시적으로 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.',
    };
  }

  return {
    status: rawStatus >= 400 && rawStatus < 600 ? rawStatus : 500,
    message: '일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  };
}

function isRetryableError(err: unknown): boolean {
  const errObj = err && typeof err === 'object' ? (err as Record<string, unknown>) : {};
  const rawStatus =
    typeof errObj.status === 'number'
      ? errObj.status
      : typeof errObj.statusCode === 'number'
        ? errObj.statusCode
        : 0;
  const rawMessage = typeof errObj.message === 'string' ? errObj.message : '';
  return rawStatus >= 500 || rawMessage.includes('UNAVAILABLE');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(ai: GoogleGenAI, contents: SanitizedTurn[]) {
  const delaysMs = [0, 400, 1000];
  let lastError: unknown;

  for (let attempt = 0; attempt < delaysMs.length; attempt++) {
    if (delaysMs[attempt] > 0) {
      await sleep(delaysMs[attempt]);
    }
    try {
      return await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_TEXT,
        },
      });
    } catch (err) {
      lastError = err;
      if (attempt === delaysMs.length - 1 || !isRetryableError(err)) {
        throw err;
      }
    }
  }

  throw lastError;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/chat', async (req: Request, res: Response) => {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      res.status(500).json({
        error:
          '서버에 Gemini API 키가 설정되어 있지 않습니다. Settings > Secrets 패널에서 GEMINI_API_KEY를 확인해 주세요.',
      });
      return;
    }

    const body = req.body as { contents?: unknown } | undefined;
    const contents = sanitizeContents(body?.contents);

    if (contents.length === 0 || contents[contents.length - 1]?.role !== 'user') {
      res.status(400).json({ error: '질문을 입력해 주세요.' });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await generateWithRetry(ai, contents);

      const text = (response.text ?? '').trim();
      if (!text) {
        res.status(502).json({
          error: '답변을 생성하지 못했습니다. 다른 표현으로 다시 질문해 주세요.',
        });
        return;
      }

      res.json({ text });
    } catch (err) {
      const info = getErrorInfo(err);
      res.status(info.status).json({ error: info.message });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
