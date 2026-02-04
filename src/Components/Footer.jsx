function Footer() {
  return (
    <footer className="bg-gradient-to-r from-black via-blue-900 to-blue-800 text-white py-4 px-6 shadow-md border-t-2 border-white">
      <div className="max-w-6xl mx-auto text-center space-y-2">
        <p> Assembled Tutoring &copy; {new Date().getFullYear()}</p>
        <p>Contact us: assembledtutoring@gmail.com</p>
        <p>Phone: 084 727 7408</p>
        <p>Headquarter: Montana Tuine Pretoria 0182</p>
      </div>
    </footer>
  );
}

export default Footer;