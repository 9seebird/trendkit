export default function PrivacyPage() {
  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "120px 24px 80px",
        color: "#1a1a1a",
        lineHeight: 1.8,
      }}
    >
      {/* 페이지 제목 */}
      <section style={{ marginBottom: "48px" }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#2563eb",
            marginBottom: "12px",
          }}
        >
          Privacy Policy
        </p>

        <h1
          style={{
            fontSize: "clamp(30px, 5vw, 44px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "16px",
          }}
        >
          개인정보처리방침
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#555",
            maxWidth: "840px",
          }}
        >
          TrendKit(이하 &quot;서비스&quot;)은 이용자의 개인정보를 중요하게 생각하며,
          관련 법령을 준수합니다. 본 개인정보처리방침은 서비스 이용 과정에서
          수집될 수 있는 정보, 이용 목적, 보관 및 보호 방식 등에 대해 안내합니다.
        </p>
      </section>

      {/* 본문 */}
      <section style={{ display: "grid", gap: "32px" }}>
        <div>
          <h2 style={sectionTitleStyle}>1. 수집하는 정보</h2>
          <p style={paragraphStyle}>
            서비스는 별도의 회원가입 없이 이용할 수 있으며, 서비스 제공 및 품질
            개선을 위해 아래와 같은 정보가 수집될 수 있습니다.
          </p>
          <ul style={listStyle}>
            <li>브라우저 종류 및 버전</li>
            <li>운영체제 정보</li>
            <li>접속 일시, 방문 페이지, 이용 기록</li>
            <li>IP 주소, 쿠키 정보, 기기 정보</li>
            <li>문의 시 사용자가 직접 입력한 정보(이메일, 문의 내용 등)</li>
          </ul>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>2. 개인정보 수집 및 이용 목적</h2>
          <p style={paragraphStyle}>
            수집된 정보는 다음 목적 범위 내에서만 사용됩니다.
          </p>
          <ul style={listStyle}>
            <li>서비스 제공 및 기능 개선</li>
            <li>이용 현황 분석 및 사용자 경험 개선</li>
            <li>오류 확인, 안정성 확보 및 보안 대응</li>
            <li>부정 이용 방지 및 서비스 운영 관리</li>
            <li>문의 또는 요청 사항에 대한 응답</li>
          </ul>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>3. 쿠키(Cookie)의 사용</h2>
          <p style={paragraphStyle}>
            서비스는 이용자 편의성 향상, 접속 통계 분석, 맞춤형 서비스 제공 등을
            위해 쿠키를 사용할 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키
            저장을 거부하거나 삭제할 수 있습니다. 다만 쿠키를 비활성화할 경우
            일부 기능 이용에 제한이 있을 수 있습니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>4. 제3자 서비스 이용</h2>
          <p style={paragraphStyle}>
            서비스는 운영 및 분석, 광고 제공을 위해 제3자 서비스가 사용될 수
            있습니다. 예를 들어 Google Analytics 또는 Google AdSense와 같은
            서비스가 적용될 수 있으며, 이 경우 해당 서비스 제공자가 쿠키 또는
            유사 기술을 통해 정보를 수집할 수 있습니다.
          </p>
          <p style={paragraphStyle}>
            제3자 서비스의 정보 처리 방식은 각 제공자의 정책을 따릅니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>5. 개인정보의 보관 및 파기</h2>
          <p style={paragraphStyle}>
            서비스는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를
            지체 없이 파기하는 것을 원칙으로 합니다. 단, 관련 법령에 따라 일정
            기간 보관이 필요한 경우에는 법령이 정한 기간 동안 안전하게
            보관합니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>6. 개인정보의 제3자 제공</h2>
          <p style={paragraphStyle}>
            서비스는 이용자의 개인정보를 외부에 판매하거나 임의로 제공하지
            않습니다. 다만 다음의 경우에는 예외로 할 수 있습니다.
          </p>
          <ul style={listStyle}>
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 따라 제출 의무가 있는 경우</li>
            <li>서비스 운영상 필요한 범위 내에서 외부 처리 업체를 이용하는 경우</li>
          </ul>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>7. 이용자의 권리</h2>
          <p style={paragraphStyle}>
            이용자는 언제든지 본인의 개인정보와 관련하여 열람, 정정, 삭제,
            처리정지 요청을 할 수 있습니다. 관련 요청은 아래 문의처를 통해
            접수할 수 있으며, 서비스는 관련 법령에 따라 합리적인 범위 내에서
            처리합니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>8. 개인정보 보호를 위한 노력</h2>
          <p style={paragraphStyle}>
            서비스는 개인정보의 안전한 처리를 위해 접근 제한, 보안 점검,
            비정상적 접근 모니터링 등 필요한 관리적·기술적 보호 조치를 위해
            노력합니다. 다만 인터넷 환경의 특성상 완전한 보안을 보장할 수는
            없으므로, 이용자도 안전한 비밀번호 사용 및 기기 보안 유지에 주의를
            기울여 주시기 바랍니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>9. 아동의 개인정보</h2>
          <p style={paragraphStyle}>
            서비스는 관련 법령에서 허용하지 않는 한 아동의 개인정보를 의도적으로
            수집하지 않습니다. 아동의 개인정보가 수집된 사실이 확인될 경우,
            확인 즉시 필요한 조치를 취할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>10. 문의처</h2>
          <p style={paragraphStyle}>
            개인정보 관련 문의가 있으신 경우 아래 연락처를 통해 문의하실 수
            있습니다.
          </p>
          <ul style={listStyle}>
            <li>서비스명: TrendKit</li>
            <li>문의 페이지: /contact</li>
            <li>이메일: contact@trendkit.app</li>
          </ul>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>11. 방침의 변경</h2>
          <p style={paragraphStyle}>
            본 개인정보처리방침은 서비스 운영 정책 또는 관련 법령의 변경에 따라
            수정될 수 있습니다. 내용이 변경되는 경우 본 페이지를 통해
            업데이트됩니다.
          </p>
          <p style={{ ...paragraphStyle, color: "#777" }}>
            시행일: 2026년 4월 21일
          </p>
        </div>
      </section>
    </main>
  );
}

const sectionTitleStyle = {
  fontSize: "22px",
  fontWeight: 700,
  marginBottom: "12px",
  letterSpacing: "-0.01em",
};

const paragraphStyle = {
  fontSize: "16px",
  color: "#444",
  marginBottom: "12px",
};

const listStyle = {
  paddingLeft: "20px",
  color: "#444",
  display: "grid",
  gap: "8px",
};