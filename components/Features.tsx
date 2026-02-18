import React from 'react';
import { Cpu, Search, Clock, Users, ShieldCheck, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const featuresData = [
  {
    icon: <Cpu size={28} />,
    title: "Automação com IA",
    desc: "Fluxos autônomos e resilientes que transformam tarefas manuais em processos inteligentes."
  },
  {
    icon: <Search size={28} />,
    title: "Pesquisa Aplicada",
    desc: "Estado da arte acadêmico aplicado diretamente nas necessidades reais do seu negócio."
  },
  {
    icon: <Clock size={28} />,
    title: "Eficiência Potencializada",
    desc: "Redução drástica de tempo operacional, liberando sua equipe para trabalho estratégico."
  },
  {
    icon: <Users size={28} />,
    title: "Design Centrado no Usuário",
    desc: "UX fluida e intuitiva, pensada para pessoas reais com necessidades concretas."
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Qualidade Robusta",
    desc: "Código resiliente, testes rigorosos e padrões de execução de classe mundial."
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Impacto Mensurado",
    desc: "Métricas claras que demonstram ROI desde o primeiro dia de implementação."
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-neon-400 font-semibold text-sm mb-4 bg-neon-500/10 px-4 py-2 rounded-full border border-neon-500/30">
            ⚡ SOLUÇÕES PROPRIETÁRIAS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Projetos Desenhados e <span className="text-neon-400">Desenvolvidos</span><br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-400 to-cyan-400">Pela Sentinnell IA</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Soluções inovadoras que transformam ideias em resultados mensuráveis com excelência técnica, design robusto e aplicação prática de inteligência artificial.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-lg" />
              
              {/* Card */}
              <div className="relative glass-card p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 border border-white/10 group-hover:border-neon-500/30">
                <div className="w-14 h-14 bg-gradient-to-br from-neon-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center text-neon-400 mb-6 group-hover:from-neon-500 group-hover:to-cyan-500 group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.2)] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
