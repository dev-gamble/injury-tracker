export function Footer() {
  return (
    <footer
      style={{
        background: "#1a2332",
        color: "rgba(255,255,255,.55)",
        padding: "16px 24px",
        fontSize: "10px",
        fontFamily: "var(--fm)",
        lineHeight: 1.7,
        textAlign: "center",
        marginTop: "20px",
        borderTop: "3px solid var(--red)",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <strong style={{ color: "rgba(255,255,255,.85)" }}>
          Documentation &amp; organization tool — not a VA decision engine.
        </strong>{" "}
        Not an official VA product. Not affiliated with or endorsed by the U.S.
        Department of Veterans Affairs. This app helps you organize your injury
        records and prepare for the claims process. It does not file claims, make
        official decisions, or guarantee any rating or outcome. Ratings shown are
        estimates based on general VA criteria. No data is stored — export before
        closing. Talk to a VSO, VA-accredited claims agent, or disability
        attorney before filing.
        <div
          style={{
            marginTop: "8px",
            color: "rgba(255,255,255,.35)",
            fontSize: "9px",
          }}
        >
          &copy; K. Dimond. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}
