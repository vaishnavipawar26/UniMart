import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";


function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#E0E0E0",
        color: "#222",
        textAlign: "center",
        padding: "25px 20px",
        fontSize: "14px",
        lineHeight: "1.6",
      }}
    >
      <div style={{ marginBottom: "15px" }}>
        <a
          href="#"
          style={{
            color: "#433D8B",
            margin: "0 10px",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Home
        </a>

        <a
          href="#"
          style={{
            color: "#433D8B",
            margin: "0 10px",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Contact
        </a>

        <a
          href="#"
          style={{
            color: "#433D8B",
            margin: "0 10px",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Privacy
        </a>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <FaInstagram
          style={{ margin: "0 10px", cursor: "pointer", color: "#433D8B" }}
        />
        <FaFacebook
          style={{ margin: "0 10px", cursor: "pointer", color: "#433D8B" }}
        />
        <FaTwitter
          style={{ margin: "0 10px", cursor: "pointer", color: "#433D8B" }}
        />
      </div>

      <div style={{ fontSize: "13px", color: "#555" }}>
        © 2026 UniMart. All rights reserved.
      </div>
    </footer>
  );
}
export default Footer;
