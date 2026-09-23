/*----- FILE: AdminDashboard.jsx | CONTENT: MovieMate administrator dashboard. | PURPOSE: Displays high-level counts, revenue, and quick actions before detailed management. -----*/

import { useEffect, useState } from "react";
import { Film, Building2, CalendarDays, Users, Ticket, IndianRupee, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/adminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try { const response = await api.get("/admin/dashboard"); setStats(response.data); }
      catch (requestError) { setError(requestError.response?.data?.message || "Unable to load dashboard."); }
    };
    loadDashboard();
  }, []);

  const cards = stats ? [
    [Film, "Movies", stats.movies], [Building2, "Theatres", stats.theatres], [CalendarDays, "Shows", stats.shows], [Users, "Users", stats.users], [Ticket, "Bookings", stats.bookings], [IndianRupee, "Revenue", `₹${stats.revenue}`],
  ] : [];

  return (
    <main className="admin-dashboard-page">
      <section className="dashboard-hero"><div><p className="dashboard-label">ADMIN DASHBOARD</p><h1>Welcome to MovieMate</h1><p>Monitor your movie ticket booking system and manage its data from one place.</p></div><Link to="/admin/manage" className="dashboard-action">Manage Data <ArrowRight size={18} /></Link></section>
      {error && <p className="dashboard-error">{error}</p>}
      {!stats ? <div className="dashboard-loading">Loading dashboard...</div> : <section className="stats-grid">{cards.map(([Icon, label, value]) => <article className="stat-card" key={label}><div className="stat-icon"><Icon size={23} /></div><p>{label}</p><h2>{value}</h2></article>)}</section>}
      <section className="dashboard-info"><div><h2>Quick Management</h2><p>Use the management page to add, update or delete movies, theatres and shows.</p></div><Link to="/admin/manage">Open Admin Management <ArrowRight size={17} /></Link></section>
    </main>
  );
}

export default AdminDashboard;
