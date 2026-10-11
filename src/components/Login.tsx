import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [apiUrl, setApiUrl] = useState('https://api.green-api.com');
  const [idInstance, setIdInstance] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!apiUrl.trim() || !idInstance.trim() || !apiToken.trim()) {
      setError('Заполните все поля');
      return;
    }
    setError('');
    setLoading(true);
    try {
      login(apiUrl.trim(), idInstance.trim(), apiToken.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: 'apiUrl',
      label: 'apiUrl',
      type: 'url',
      value: apiUrl,
      onChange: setApiUrl,
      placeholder: 'https://3100.api.green-api.com',
    },
    {
      key: 'idInstance',
      label: 'idInstance',
      type: 'text',
      value: idInstance,
      onChange: setIdInstance,
      placeholder: '310022750891',
    },
    {
      key: 'apiToken',
      label: 'apiTokenInstance',
      type: 'password',
      value: apiToken,
      onChange: setApiToken,
      placeholder: 'a2f9599b…',
    },
  ] as const;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: '#14151f',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%2314151f'/%3E%3Ccircle cx='40' cy='40' r='1' fill='%23ffffff18'/%3E%3Ccircle cx='200' cy='30' r='1.2' fill='%23ffffff10'/%3E%3Ccircle cx='300' cy='60' r='0.8' fill='%23ffffff18'/%3E%3Ccircle cx='60' cy='160' r='0.6' fill='%23ffffff16'/%3E%3Ccircle cx='250' cy='150' r='0.8' fill='%23ffffff14'/%3E%3Ccircle cx='80' cy='280' r='1' fill='%23ffffff18'/%3E%3Ccircle cx='280' cy='280' r='1' fill='%23ffffff16'/%3E%3C/svg%3E")`,
        backgroundSize: '400px 400px',
      }}
    >
      <div className="w-full max-w-sm bg-[#1e1f2e] rounded-2xl shadow-2xl overflow-hidden border border-white/5">
        <div className="px-8 pt-8 pb-5 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7b61ff] to-[#a78bfa] mb-4 shadow-lg">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
          <h1 className="text-white text-xl font-semibold">GREEN-API Chat</h1>
          <p className="text-[#5c6070] text-sm mt-1">Введите параметры из личного кабинета</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-3">
          {fields.map(f => (
            <div key={f.key} className="space-y-1">
              <label className="text-xs font-medium text-[#5c6070] uppercase tracking-wider">
                {f.label}
              </label>
              <input
                type={f.type}
                value={f.value}
                onChange={e => f.onChange(e.target.value)}
                placeholder={f.placeholder}
                autoComplete="off"
                className="w-full px-4 py-2.5 rounded-xl bg-[#2a2b3d] border border-white/10 text-white placeholder-[#5c6070] text-sm focus:outline-none focus:border-[#7b61ff] transition-colors"
              />
            </div>
          ))}

          {error && <p className="text-red-400 text-xs text-center pt-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#7b61ff] hover:bg-[#6a50ee] disabled:opacity-60 text-white font-medium text-sm transition-colors mt-1"
          >
            {loading ? 'Подключение…' : 'Войти'}
          </button>

          {/* Authorization hint */}
          <div className="pt-1 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
            <p className="text-amber-400 text-xs font-medium mb-1">Статус «Неавторизован»?</p>
            <p className="text-[#8a8a9a] text-xs leading-relaxed">
              Войдите в личный кабинет GREEN-API → выберите инстанс → нажмите <strong className="text-white">QR</strong> и отсканируйте код приложением MAX на телефоне.
            </p>
          </div>

          <p className="text-[#5c6070] text-xs text-center leading-relaxed">
            Данные хранятся локально в браузере.{' '}
            <a href="https://green-api.com/max" target="_blank" rel="noopener noreferrer" className="text-[#a78bfa] hover:underline">
              green-api.com/max
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
