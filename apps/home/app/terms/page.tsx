export default function TermsPage() {
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
          Terms of Service
        </p>

        <h1
          style={{
            fontSize: "clamp(30px, 5vw, 44px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "16px",
          }}
        >
          이용약관
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#555",
            maxWidth: "760px",
          }}
        >
          본 약관은 TrendKit(이하 &quot;서비스&quot;)가 제공하는 웹 기반 생산성
          도구 및 관련 서비스의 이용과 관련하여, 서비스와 이용자 간의 권리,
          의무 및 책임사항을 규정합니다.
        </p>
      </section>

      {/* 본문 */}
      <section style={{ display: "grid", gap: "32px" }}>
        <div>
          <h2 style={sectionTitleStyle}>1. 서비스의 목적</h2>
          <p style={paragraphStyle}>
            서비스는 엑셀 병합, 워드클라우드 생성, 키워드 분석 등 다양한 웹 기반
            생산성 도구를 제공하여 이용자의 업무 효율 향상을 돕는 것을 목적으로
            합니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>2. 약관의 효력 및 변경</h2>
          <p style={paragraphStyle}>
            본 약관은 서비스 웹사이트에 게시함으로써 효력이 발생합니다.
            서비스는 운영상 필요 또는 관련 법령 변경에 따라 본 약관을 수정할 수
            있으며, 변경 내용은 서비스 내 공지 또는 본 페이지 갱신을 통해
            안내합니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>3. 서비스의 제공</h2>
          <p style={paragraphStyle}>
            서비스는 웹 브라우저를 통해 이용 가능한 생산성 도구를 제공합니다.
            서비스의 일부 기능은 무료로 제공되며, 향후 일부 기능은 유료 또는
            별도의 조건 하에 제공될 수 있습니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>4. 서비스 내용의 변경 및 중단</h2>
          <p style={paragraphStyle}>
            서비스는 운영상, 기술상 필요에 따라 제공하는 기능, 디자인, 정책,
            URL 구조, 접근 방식 등을 변경할 수 있습니다. 또한 시스템 점검,
            장애, 외부 서비스 연동 문제, 천재지변 등의 사유로 서비스 일부 또는
            전부를 일시 중단할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>5. 이용자의 의무</h2>
          <p style={paragraphStyle}>
            이용자는 서비스를 이용함에 있어 다음 행위를 해서는 안 됩니다.
          </p>
          <ul style={listStyle}>
            <li>법령 또는 공공질서에 위반되는 자료를 업로드하거나 이용하는 행위</li>
            <li>서비스를 악의적으로 방해하거나 시스템에 과도한 부하를 주는 행위</li>
            <li>타인의 권리, 명예, 개인정보를 침해하는 행위</li>
            <li>자동화 도구, 스크립트 등을 이용한 비정상적 대량 요청</li>
            <li>서비스의 취약점을 악용하거나 보안 우회를 시도하는 행위</li>
          </ul>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>6. 업로드 데이터 및 결과물</h2>
          <p style={paragraphStyle}>
            이용자가 서비스를 통해 입력하거나 업로드한 데이터, 그리고 이를
            바탕으로 생성된 결과물에 대한 책임은 원칙적으로 이용자에게 있습니다.
            이용자는 본인이 적법하게 사용할 수 있는 데이터만 업로드해야 하며,
            서비스는 이용자가 업로드한 자료의 적법성이나 정확성을 보증하지
            않습니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>7. 지적재산권</h2>
          <p style={paragraphStyle}>
            서비스에 포함된 디자인, 텍스트, 로고, 구조, 기능, 소프트웨어,
            콘텐츠 등 일체의 권리는 서비스 운영자에게 귀속됩니다. 이용자는
            서비스의 사전 허가 없이 이를 복제, 배포, 수정, 판매, 재사용할 수
            없습니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>8. 외부 서비스 및 링크</h2>
          <p style={paragraphStyle}>
            서비스는 이용 편의를 위해 외부 사이트 또는 제3자 서비스와 연동될 수
            있습니다. 외부 링크 또는 외부 서비스 이용 과정에서 발생하는 문제는
            해당 서비스의 정책 및 책임에 따르며, 서비스는 이에 대해 직접적인
            책임을 지지 않습니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>9. 면책조항</h2>
          <p style={paragraphStyle}>
            서비스는 안정적인 운영을 위해 노력하지만, 다음 각 호의 사항에 대해
            책임을 지지 않을 수 있습니다.
          </p>
          <ul style={listStyle}>
            <li>이용자의 입력 오류 또는 잘못된 사용으로 인한 손해</li>
            <li>업로드 자료의 손상, 누락, 변형 또는 처리 실패</li>
            <li>외부 네트워크, 브라우저, 기기, 제3자 서비스 문제로 인한 장애</li>
            <li>서비스 점검, 업데이트, 장애 대응 중 발생한 일시적 중단</li>
            <li>예상하지 못한 시스템 오류, 천재지변, 불가항력적 사유</li>
          </ul>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>10. 광고 및 제휴</h2>
          <p style={paragraphStyle}>
            서비스에는 광고 또는 제휴 링크가 포함될 수 있습니다. 이용자는
            광고주 또는 외부 서비스와의 거래에 대해 각자의 책임 하에 판단해야
            하며, 서비스는 해당 거래의 결과에 대해 책임을 지지 않습니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>11. 개인정보 보호</h2>
          <p style={paragraphStyle}>
            이용자의 개인정보 처리에 관한 사항은 별도로 게시된
            개인정보처리방침에 따릅니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>12. 준거법 및 분쟁 해결</h2>
          <p style={paragraphStyle}>
            본 약관은 대한민국 법령에 따라 해석됩니다. 서비스 이용과 관련하여
            분쟁이 발생할 경우, 관련 법령 및 일반적인 분쟁 해결 절차에 따릅니다.
          </p>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>13. 문의처</h2>
          <p style={paragraphStyle}>
            서비스 이용과 관련한 문의는 아래를 통해 접수하실 수 있습니다.
          </p>
          <ul style={listStyle}>
            <li>서비스명: TrendKit</li>
            <li>문의 페이지: /contact</li>
            <li>이메일: contact@trendkit.app</li>
          </ul>
        </div>

        <div>
          <h2 style={sectionTitleStyle}>14. 시행일</h2>
          <p style={{ ...paragraphStyle, color: "#777" }}>
            본 약관은 2026년 4월 21일부터 적용됩니다.
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