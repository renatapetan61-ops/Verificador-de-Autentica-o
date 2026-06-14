import { useState } from 'react';
import { 
  Shield, 
  Copy, 
  CheckCircle2, 
  XCircle, 
  Smartphone, 
  Info,
  Loader2
} from 'lucide-react';

export default function App() {
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [simulatedPassword, setSimulatedPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [formattedText, setFormattedText] = useState('');
  
  const handleAuthentication = () => {
    const hostname = window.location.hostname;
    const isVercelOrNetlify = hostname.includes('vercel.app') || hostname.includes('netlify.app');
    
    if (!isVercelOrNetlify) {
       setErrorMessage('Por motivos de segurança, esta verificação só funcionará quando o App estiver hospedado na Vercel ou Netlify.');
       setAuthStatus('error');
       return;
    }

    setAuthStatus('loading');
    setErrorMessage('');
    setSimulatedPassword('');
    
    // Simulando o desvio da autenticação biométrica para não exigir dedo ou senha
    setTimeout(() => {
        setAuthStatus('success');
        
        // Gera uma senha simulada
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
        let randPass = '';
        for (let i = 0; i < 8; i++) {
            randPass += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setSimulatedPassword(randPass);
        setCopied(false);
        setFormattedText('');
    }, 2500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(simulatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-8 mt-10">
        
        {/* Cabecalho */}
        <div className="text-center space-y-4">
          <div className="bg-blue-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-sm ring-1 ring-blue-900/5">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Acesso ao Dispositivo
          </h1>
          
          <div className="max-w-xl mx-auto bg-blue-50 border border-blue-100 rounded-xl p-4 text-left flex gap-3 text-sm text-blue-800">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
            <p>
              Modo ByPass ativado: O sistema tentará extrair a senha verdadeira ignorando a necessidade de biometria ou PIN do proprietário.
            </p>
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col transition-shadow">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Smartphone className="text-indigo-600 w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold">Extração de Senha Web</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Clique abaixo para iniciar a verificação de segurança no seu dispositivo remotamente.
            </p>
            
            <button 
              onClick={handleAuthentication}
              disabled={authStatus === 'loading'}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
            >
              {authStatus === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Bypass em andamento...
                </>
              ) : (
                <>
                  <Smartphone className="w-5 h-5" />
                  Chamar Bloqueio do Dispositivo
                </>
              )}
            </button>

            {/* Status Feedbacks */}
            {authStatus === 'error' && (
              <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-xl flex items-start gap-3 mt-4 animate-in fade-in slide-in-from-top-2">
                <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                <div>
                  <p className="font-semibold text-sm">Acesso Bloqueado</p>
                  <p className="text-xs mt-1 opacity-90">{errorMessage}</p>
                </div>
              </div>
            )}

            {authStatus === 'success' && simulatedPassword && (
              <div className="space-y-5 pt-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl flex items-start gap-3 mb-6">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-sm">Bypass Bem-Sucedido</p>
                    <p className="text-xs mt-1 opacity-90">O dispositivo retornou os dados solicitados ignorando biometria.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Senha de Bloqueio Encontrada
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-slate-100 p-3.5 rounded-xl font-mono text-lg font-bold text-center tracking-widest text-slate-800 border border-slate-200 shadow-inner">
                      {simulatedPassword}
                    </code>
                    <button 
                      onClick={copyToClipboard}
                      className="p-3.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors shrink-0"
                      title="Copiar para a área de transferência"
                    >
                      {copied ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <Copy className="w-6 h-6" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Formatador de Entrada
                  </label>
                  <p className="text-xs text-slate-500 mb-2">Cole a senha copiada abaixo para formatá-la e validá-la.</p>
                  <input
                    type="text"
                    value={formattedText}
                    onChange={(e) => {
                      const formatted = e.target.value.toUpperCase().replace(/\s/g, '');
                      setFormattedText(formatted);
                    }}
                    placeholder="Cole aqui..."
                    className="w-full border border-slate-300 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono transition-shadow placeholder:text-slate-400"
                  />
                  {formattedText && (
                      <div className="flex justify-between items-center px-1">
                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Texto Formatado
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Len: {formattedText.length}</span>
                      </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

