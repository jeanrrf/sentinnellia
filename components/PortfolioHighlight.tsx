import React from 'react';
import { ArrowRight, Award, Users, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { smoothScrollTo } from '../utils/scroll';

export default function PortfolioHighlight() {
  const highlights = [
    {
      icon: <Award size={32} />,
      title: 'Treinamento Especializado',
      description: 'Do zero ao primeiro deploy com GitHub Copilot gratuito',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: <Users size={32} />,
      title: 'Aulas ao Vivo',
      description: 'Sessões interativas via Google Meet, não gravadas',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Rocket size={32} />,
      title: 'IA em Código',
      description: 'Revolução da Inteligência em Código e ecossistema',
      color: 'from-neon-500 to-green-500'
    }
  ];

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-neon-500/20 via-cyan-500/20 to-neon-500/20 border border-neon-500/30 rounded-2xl p-8 md:p-12 overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-neon-500/10 rounded-full blur-3xl -z-10" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Seu Caminho para a <span className="text-neon-400">Revolução IA</span>
              </h2>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Mentoria intensiva com especialista em NVIDIA Cloud e Google Developers. Aprenda as ferramentas, práticas e inovações que transformam código em resultados.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => smoothScrollTo('mentorship')}
              className="flex items-center gap-2 bg-neon-500 hover:bg-neon-600 text-black font-bold px-8 py-4 rounded-xl transition-all whitespace-nowrap shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]"
            >
              Começar Mentoria
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {highlights.map((highlight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-neon-500/30 transition-all hover:bg-white/10"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${highlight.color} rounded-lg flex items-center justify-center text-white mb-4 shadow-lg`}>
                {highlight.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{highlight.title}</h3>
              <p className="text-gray-400 text-sm">{highlight.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
