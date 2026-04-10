export function Disclaimer() {
  return (
    <>
      <div className="disc">
        <div
          className="disc-box"
          style={{ maxWidth: "820px", margin: "0 auto", textAlign: "left", lineHeight: "1.7" }}
        >
          <strong style={{ fontSize: "13px", display: "block", marginBottom: "6px" }}>
            This is a documentation &amp; organization tool — not a VA decision engine.
          </strong>
          This app helps you organize your injury records, understand how VA ratings work, and prepare
          for the claims process. It does <strong>not</strong> file claims, make official decisions, or
          guarantee any rating or outcome. The ratings shown here are estimates based on general VA
          criteria — your actual rating will be determined by a VA examiner reviewing your specific
          medical evidence.
          <br />
          <br />
          <strong>Before filing:</strong> Talk to a Veterans Service Organization (VSO), a VA-accredited
          claims agent, or a VA disability attorney. These services are often free and can significantly
          improve your claim. You can find an accredited representative at your local VA office or through
          organizations like DAV, VFW, or American Legion.
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "12px 20px 20px",
          fontFamily: "'IBM Plex Mono',monospace",
          fontSize: "11px",
          color: "#9aa5b4",
          letterSpacing: "0.3px",
        }}
      >
        &copy; K. Dimond | C. Gamble · All Rights Reserved.
      </div>
    </>
  )
}
