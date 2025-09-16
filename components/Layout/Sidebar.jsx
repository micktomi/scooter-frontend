'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/homepage', icon: 'bi-speedometer2', label: 'Επισκόπηση' },
    { href: '/scooterpage', icon: 'bi-scooter', label: 'Σκούτερ' },
    { href: '/customerpage', icon: 'bi-people', label: 'Πελάτες' },
    { href: '/servicespage', icon: 'bi-tools', label: 'Υπηρεσίες' },
    { href: '/rentalspage', icon: 'bi-clipboard-check', label: 'Ενοικιάσεις' },
    { href: '/financialpage', icon: 'bi-graph-up', label: 'Οικονομικά' },
    { href: '/sparepartspage', icon: 'bi-nut', label: 'Ανταλλακτικά' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link href="/" className="sidebar-brand">
          <i className="bi bi-scooter"></i>
          <span>Scooter Service</span>
        </Link>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
