import { useState } from 'react';
import { 
  Shield, 
  Fingerprint, 
  Copy, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Smartphone, 
  Info
} from 'lucide-react';

export default function App() {
  const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [simulatedPassword, setSimulatedPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [formattedText, setFormattedText] = useState('');
  
  const handleRealAuthentication = async () => {
    try {
      const hostname = window.location.hostname;
      const isVercelOrNetlify = hostname.includes('vercel.app') || hostname.includes('netlify.app');
      
      if (!isVercelOrNetlify) {
         setErrorMessage('Por motivos de segurança, esta verificação só funcionará quando o App estiver hospedado na Vercel ou Netlify.');
         setAuthStatus('error');
         return;
      }

      if (!window.PublicKeyCredential) {
        setErrorMessage('Seu navegador não suporta a API de Autenticação Web (WebAuthn).');
        setAuthStatus('error');
        return;
      }
      
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      
      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);
      
      // Chamada para a API nativa de autenticação do dispositivo (Biometria / PIN)
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: challenge,
          rp: {
            name: "Verificador de Segurança",
            id: window.location.hostname
          },
          user: {
            id: userId,
            name: "usuario_local",
            displayName: "Usuário do Dispositivo"
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },   // ES256
            { type: "public-key", alg: -257 }  // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform", // Força o uso do autenticador integrado do dispositivo
            userVerification: "required" // Exige que a tela seja desbloqueada
          },
          timeout: 60000,
          attestation: "none"
        }
      });
      
      if (credential) {
        setAuthStatus('success');
      } else {
        setAuthStatus('error');
        setErrorMessage('A autenticação falhou. Nenhuma credencial gerada.');
      }
    } catch (error) {
      console.error("Erro no WebAuthn:", error);
      setAuthStatus('error');
      // Trata erros comuns, como o usuário cancelando a interação
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setErrorMessage('Autenticação cancelada ou bloqueada pelo dispositivo.');
        } else {
          setErrorMessage(`Falha na operação: ${error.message}`);
        }
      } else {
        setErrorMessage('Ocorreu um erro desconhecido durante a autenticação.');
      }
    }
  };

  const handleSimulateExtraction = () => {
    // Gera uma senha que "finge" ser a extraída, apenas para simular a interface pedida
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let randPass = '';
    for (let i = 0; i < 8; i++) {
        randPass += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setSimulatedPassword(randPass);
    setCopied(false);
    setFormattedText('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(simulatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8 mt-10">
        
        {/* Cabecalho */}
        <div className="text-center space-y-4">
          <div className="bg-blue-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-sm ring-1 ring-blue-900/5">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Validador de Acesso de Dispositivo
          </h1>
          
          <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-100 rounded-xl p-4 text-left flex gap-3 text-sm text-blue-800">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
            <p>
              <b>Aviso de Segurança e Privacidade:</b> Os navegadores da web são isolados do sistema operacional. É <b>tecnicamente impossível</b> que um site acesse ou leia a "senha de bloqueio verdadeira" na forma de texto. No entanto, é possível <i>validar</i> o usuário usando a API <code className="bg-blue-100 px-1 rounded">WebAuthn</code>, que invoca a tela de verificação do dispositivo sem jamais compartilhar a senha real com a página.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full">
          
          {/* Card 1: Autenticador Real */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Fingerprint className="text-indigo-600 w-6 h-6" />
                </div>
                <h2 className="text-lg font-semibold">1. Autenticação Real</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Este método é a implementação verdadeira de segurança na web atual. Ele solicita que o dono do dispositivo comprove sua identidade utilizando sua tela de bloqueio (Biometria, FaceID, ou PIN). 
              </p>
              
              <button 
                onClick={handleRealAuthentication}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              >
                <Smartphone className="w-5 h-5" />
                Chamar Bloqueio do Dispositivo
              </button>

              {/* Status Feedbacks */}
              {authStatus === 'success' && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl flex items-start gap-3 mt-4 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-sm">Identidade Confirmada</p>
                    <p className="text-xs mt-1 opacity-90">O sistema operacional confirmou através da sua tela de bloqueio com sucesso.</p>
                  </div>
                </div>
              )}

              {authStatus === 'error' && (
                <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-xl flex items-start gap-3 mt-4 animate-in fade-in slide-in-from-top-2">
                  <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <p className="font-semibold text-sm">Falha ou Cancelado</p>
                    <p className="text-xs mt-1 opacity-90">{errorMessage}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Modo Simulação */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
            {/* Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            
            <div className="space-y-4 flex-1 relative">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <AlertTriangle className="text-amber-500 w-6 h-6" />
                </div>
                <h2 className="text-lg font-semibold">2. Simulador de Fluxo</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Abaixo está a interface interativa solicitada com a geração de uma credencial, cópia e formatação. <b>Nota:</b> Uma senha gerada aleatoriamente é usada para o exemplo.
              </p>
              
              <button 
                onClick={handleSimulateExtraction}
                className="w-full mt-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3.5 px-4 rounded-xl transition-all active:scale-[0.98]"
              >
                Simular Extração de Senha
              </button>

              {simulatedPassword && (
                <div className="space-y-5 pt-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Credencial Simulada
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
                    <p className="text-xs text-slate-500 mb-2">Cole a senha para formatação automática (Ex: Remove espaços, impõe Maiúsculas).</p>
                    <input
                      type="text"
                      value={formattedText}
                      onChange={(e) => {
                        // Exemplo de formatação: apenas caracteres alfanuméricos e maiúsculos, sem espaços
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
    </div>
  );
}
