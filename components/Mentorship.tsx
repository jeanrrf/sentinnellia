import React from 'react';
import { BookOpen, Users, Zap, Code } from 'lucide-react';

export default function Mentorship() {
  return (
    <section id="mentorship" className="relative py-24 px-6 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-neon-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-neon-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Main Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-white selection:bg-neon-500/30">
            Meu Treinamento e Mentoria em <span className="text-neon-500">Vibe Coding</span>
          </h1>
          
          {/* Introduction */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            Sou especialista em <span className="font-semibold text-neon-400">NVIDIA Cloud</span> e <span className="font-semibold text-neon-400">Google Developers</span>, 
            trazendo conhecimento de ponta para você aprender de forma prática e direto ao ponto.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="glass-card p-8 rounded-2xl group hover:border-neon-500/50 transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-neon-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-neon-500/30 transition-colors">
                <Code className="w-6 h-6 text-neon-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Do Zero ao Primeiro Deploy</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Aprenda tudo do zero até colocar sua aplicação em produção, <span className="font-semibold text-neon-400">totalmente gratuito</span>, 
                  utilizando GitHub Copilot de forma eficiente e prática.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-8 rounded-2xl group hover:border-neon-500/50 transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-neon-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-neon-500/30 transition-colors">
                <Zap className="w-6 h-6 text-neon-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Dicas e Macetes Exclusivos</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Entrego uma série de <span className="font-semibold text-neon-400">dicas e macetes exclusivos</span> baseados na minha 
                  experiência prática com desenvolvimento, economia de tempo e otimização.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-8 rounded-2xl group hover:border-neon-500/50 transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-neon-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-neon-500/30 transition-colors">
                <Users className="w-6 h-6 text-neon-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Aulas ao Vivo via Google Meet</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  As aulas são <span className="font-semibold text-neon-400">100% ao vivo</span> via Google Meet, 
                  com interação em tempo real. Não é um cursinho online gravado.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="glass-card p-8 rounded-2xl group hover:border-neon-500/50 transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-neon-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-neon-500/30 transition-colors">
                <BookOpen className="w-6 h-6 text-neon-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Revolução da Inteligência em Código</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Desbravamos juntos a <span className="font-semibold text-neon-400">revolução da IA em código</span>: 
                  ferramentas, práticas e inovações que estão transformando o desenvolvimento.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-card-strong p-12 rounded-2xl text-center border-neon-500/40">
          <p className="text-gray-300 mb-4">
            Prepare-se para uma jornada transformadora no mundo do desenvolvimento moderno
          </p>
          <p className="text-sm text-neon-400 font-mono">
            // MENTORIA PRÁTICA | CONHECIMENTO REAL | RESULTADOS IMEDIATOS
          </p>
        </div>
      </div>
    </section>
  );
}
