import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link href="/" className="navbar-brand">
          <i className="bi bi-scooter me-2"></i> Scooter Service
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/homepage" className="nav-link">
                Αρχική
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/customerpage" className="nav-link">
                Πελάτες
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/scooterpage" className="nav-link">
                Σκούτερ
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/servicespage" className="nav-link">
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/rentalspage" className="nav-link">
                Ενοικιάσεις
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/sparepartspage" className="nav-link">
                Ανταλλακτικά
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/financialpage" className="nav-link">
                Οικονομικά
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;