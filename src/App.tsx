/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type MouseEvent } from 'react';
import { Calendar, Clock, MapPin, Menu, Users, X, ArrowDown } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: '첫 화면' },
  { id: 'intro', label: '행사 소개' },
  { id: 'info', label: '핵심 정보' },
  { id: 'contact', label: '문의' },
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-[#16221C]">
      {/* 상단 고정 메뉴: 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#F8FAF8]/95 backdrop-blur-sm border-b border-[#DCE4DF]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-8">
          {/* Zone 1: 단일 브랜드 텍스트 */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, 'hero')}
            className="font-display text-base sm:text-lg font-semibold tracking-tight text-[#16221C] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E563B] rounded-sm"
          >
            온담컴퍼니
          </a>

          {/* Zone 2: 데스크톱 내비게이션 링크 */}
          <nav aria-label="행사 안내 메뉴" className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A5A51]">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className="py-2 hover:text-[#16221C] underline-offset-4 hover:underline transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E563B] rounded-sm"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 주요 이동 버튼 & 모바일 메뉴 토글 */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#info"
              onClick={(e) => handleNavClick(e, 'info')}
              className="hidden md:inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-white bg-[#1E563B] hover:bg-[#16422D] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E563B]"
            >
              핵심 정보 보기
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              className="md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-2 text-[#16221C] hover:bg-[#EDF2EE] rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E563B]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* 모바일 펼침 메뉴 */}
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="모바일 행사 안내 메뉴"
            className="md:hidden border-t border-[#DCE4DF] bg-[#FFFFFF]"
          >
            <div className="px-5 py-3 flex flex-col">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="min-h-[44px] flex items-center text-sm font-medium text-[#16221C] border-b border-[#EDF2EE] last:border-b-0 active:bg-[#F1F5F2]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        {/* 1. 첫 화면 */}
        <section
          id="hero"
          className="scroll-mt-16 max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-14 sm:pt-16 sm:pb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* 왼쪽: 행사명, 한 줄 소개, 날짜, 장소 */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-8">
              <div className="space-y-5">
                <p className="text-xs sm:text-sm font-medium text-[#4A5A51] tracking-normal">
                  온담컴퍼니 경영지원팀 주최
                  <span className="mx-2 text-[#B8C6BE]" aria-hidden="true">·</span>
                  사내 행사 안내
                </p>

                <h1 className="font-display text-[clamp(2.15rem,4.4vw,3.4rem)] font-semibold leading-[1.22] tracking-tight text-[#16221C]">
                  2027 봄 워크숍
                  <span className="block text-[#1E563B] mt-1">‘함께 걷는 하루’</span>
                </h1>

                <p className="text-base sm:text-lg text-[#35443C] leading-relaxed max-w-xl">
                  봄날, 동료와 나란히 걷는 하루
                </p>
              </div>

              <div className="space-y-6 pt-2">
                {/* 날짜 · 장소 한눈에 보기 (무-캡슐 타이포그래피) */}
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-5 border-t border-[#DCE4DF]">
                  <div>
                    <dt className="text-xs font-medium text-[#5A6B61] mb-1">날짜</dt>
                    <dd className="text-base sm:text-lg font-semibold text-[#16221C] tabular-nums">
                      2027년 4월 16일(금)
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[#5A6B61] mb-1">장소</dt>
                    <dd className="text-base sm:text-lg font-semibold text-[#16221C]">
                      광교호수공원
                    </dd>
                  </div>
                </dl>

                <div>
                  <a
                    href="#info"
                    onClick={(e) => handleNavClick(e, 'info')}
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 text-sm font-medium text-white bg-[#1E563B] hover:bg-[#16422D] rounded-lg transition-colors duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E563B]"
                  >
                    <span>핵심 정보 확인하기</span>
                    <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* 오른쪽: 자체 벡터 호수 산책로 그래픽 + 요약 표식 (외부 이미지 미사용) */}
            <div className="lg:col-span-5 flex">
              <div className="w-full h-full min-h-[280px] sm:min-h-[340px] bg-white border border-[#DCE4DF] rounded-xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                {/* 호수와 산책로를 형상화한 자체 인라인 SVG 등고선 */}
                <svg
                  viewBox="0 0 400 260"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-full h-auto max-h-[190px] text-[#1E563B]"
                >
                  <path
                    d="M18 195C62 150 112 172 158 142C204 112 248 64 308 78C346 86 368 62 384 38"
                    stroke="#1E563B"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 222C74 178 124 198 176 164C228 130 266 88 326 100C356 106 376 88 390 66"
                    stroke="#8EB29E"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    strokeLinecap="round"
                  />
                  <ellipse cx="205" cy="186" rx="145" ry="44" stroke="#DCE4DF" strokeWidth="1.25" />
                  <ellipse cx="205" cy="186" rx="102" ry="28" stroke="#E5ECE7" strokeWidth="1.25" />
                  <circle cx="158" cy="142" r="5" fill="#1E563B" />
                  <circle cx="308" cy="78" r="4" fill="#4A7C62" />
                </svg>

                <div className="pt-6 border-t border-[#EDF2EE] space-y-2">
                  <p className="text-xs font-medium text-[#5A6B61]">워크숍 일정 요약</p>
                  <p className="font-display text-xl font-semibold text-[#16221C] tabular-nums">
                    2027. 04. 16 (금) 09:30~16:00
                  </p>
                  <p className="text-sm text-[#4A5A51]">
                    광교호수공원
                    <span className="mx-2 text-[#B8C6BE]" aria-hidden="true">·</span>
                    온담컴퍼니 전 직원
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 행사 소개 (정확히 2문장) */}
        <section
          id="intro"
          className="scroll-mt-16 border-t border-[#DCE4DF] bg-white"
        >
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
              <div className="lg:col-span-4 space-y-2">
                <p className="text-xs font-semibold text-[#1E563B]">01. 행사 소개</p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#16221C] leading-snug">
                  함께 걷는 하루
                </h2>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <p className="text-base sm:text-lg text-[#24322A] leading-[1.8] max-w-2xl">
                  온담컴퍼니 경영지원팀이 전 직원을 위해 마련한 2027 봄 워크숍 ‘함께 걷는 하루’는 광교호수공원에서 봄의 정취를 느끼며 함께 걷는 사내 행사입니다. 일상 업무에서 잠시 벗어나 동료들과 나란히 발걸음을 맞추며 편하게 소통하고 재충전하는 시간을 갖고자 합니다.
                </p>
                <p className="text-sm text-[#5A6B61]">
                  주최: 온담컴퍼니 경영지원팀
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 핵심 정보 (일시, 장소, 대상) */}
        <section
          id="info"
          className="scroll-mt-16 border-t border-[#DCE4DF] bg-[#F8FAF8]"
        >
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-10">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#1E563B]">02. 핵심 정보</p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#16221C]">
                일시 · 장소 · 대상
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-5 lg:gap-6">
              {/* 일시 */}
              <div className="bg-white border border-[#DCE4DF] rounded-xl p-3.5 sm:p-6 lg:p-8 flex flex-col justify-between gap-4 sm:gap-6">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <span className="text-xs sm:text-sm font-medium text-[#5A6B61]">일시</span>
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E563B] shrink-0" aria-hidden="true" />
                </div>
                <div className="space-y-1 sm:space-y-1.5">
                  <p className="font-display text-sm sm:text-xl lg:text-2xl font-semibold text-[#16221C] tabular-nums break-keep">
                    2027년 4월 16일(금)
                  </p>
                  <p className="inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-base font-medium text-[#1E563B] tabular-nums">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
                    <span>09:30~16:00</span>
                  </p>
                </div>
              </div>

              {/* 장소 */}
              <div className="bg-white border border-[#DCE4DF] rounded-xl p-3.5 sm:p-6 lg:p-8 flex flex-col justify-between gap-4 sm:gap-6">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <span className="text-xs sm:text-sm font-medium text-[#5A6B61]">장소</span>
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E563B] shrink-0" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-display text-sm sm:text-xl lg:text-2xl font-semibold text-[#16221C] break-keep">
                    광교호수공원
                  </p>
                </div>
              </div>

              {/* 대상 */}
              <div className="bg-white border border-[#DCE4DF] rounded-xl p-3.5 sm:p-6 lg:p-8 flex flex-col justify-between gap-4 sm:gap-6">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <span className="text-xs sm:text-sm font-medium text-[#5A6B61]">대상</span>
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E563B] shrink-0" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-display text-sm sm:text-xl lg:text-2xl font-semibold text-[#16221C] break-keep">
                    온담컴퍼니 전 직원
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 문의 */}
        <section
          id="contact"
          className="scroll-mt-16 border-t border-[#DCE4DF] bg-white"
        >
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
              <div className="lg:col-span-4 space-y-2">
                <p className="text-xs font-semibold text-[#1E563B]">03. 문의</p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#16221C]">
                  문의 안내
                </h2>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-[#F8FAF8] border border-[#DCE4DF] rounded-xl p-6 sm:p-8">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <dt className="text-xs font-medium text-[#5A6B61] mb-1.5">문의처</dt>
                      <dd className="text-lg font-semibold text-[#16221C]">
                        온담컴퍼니 경영지원팀
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-[#5A6B61] mb-1.5">연락처</dt>
                      <dd className="text-lg font-semibold text-[#4A5A51]">
                        미정
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 맨 아래 안내 */}
      <footer className="border-t border-[#DCE4DF] bg-[#F1F5F2]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-[#4A5A51]">
          <div>
            <span>온담컴퍼니 경영지원팀</span>
            <span className="mx-2 text-[#B8C6BE]" aria-hidden="true">·</span>
            <span>2027 봄 워크숍 ‘함께 걷는 하루’</span>
          </div>
          <p className="font-medium text-[#16221C]">
            교육용 가상 행사입니다
          </p>
        </div>
      </footer>
    </div>
  );
}
