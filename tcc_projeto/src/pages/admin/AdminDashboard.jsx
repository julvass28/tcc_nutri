export default function AdminDashboard() {
  return (
    <div className="admin-dash">
      <h2>Bem-vindo(a) 👋</h2>
      <p>Escolha uma opção no menu ao lado para começar.</p>

      <div className="cards">
        <a className="card" href="/admin/users">
          <i className="fas fa-users" />
          <div>
            <b>Usuários</b>
            <span>Listar, ver detalhes e remover</span>
          </div>
        </a>
        {/* próximos atalhos: consultas, pagamentos, etc */}
      </div>

      <style>{`
        .admin-dash h2{margin:0 0 8px}
        .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:12px}
        .card{
          display:flex;gap:12px;align-items:center;padding:14px;border-radius:14px;border:1px solid #e5e7eb;background:#fff;
          text-decoration:none;color:inherit;
        }
        .card i{font-size:22px}
        .card span{display:block;color:#6b7280;font-size:13px}
        .card:hover{background:#f9fafb}
      `}</style>
    </div>
  );
}
