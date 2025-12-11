import React from 'react';
import { Cpu, Search, Clock, Users, ShieldCheck, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const featuresData = [
  {
    icon: <Search size={28} />,
    title: "Pesquisa Aplicada",
    desc: "Não fazemos apenas teoria. Unimos o estado da arte acadêmico com a necessidade real do mercado."
  },
  {
    icon: <Cpu size={28} />,
    title: "Automação Inteligente",
    desc: "Transformamos tarefas manuais repetitivas em fluxos autônomos e resilientes."
  },
  {
    icon: <Clock size={28} />,
    title: "Eficiência Temporal",
    desc: "Redução drástica de desperdício de tempo, permitindo que sua equipe foque no estratégico."
  },
  {
    icon: <Users size={28} />,
    title: "Orientado ao Usuário",
    desc: "Soluções desenhadas para pessoas reais. UX fluida e intuitiva é prioridade."
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Qualidade de Execução",
    desc: "Eliminação de erros humanos e padronização de entregas complexas."
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Resultados Mensuráveis",
    desc: "Métricas claras de impacto desde o primeiro dia de implementação."
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Nossa <span className="text-neon-500">Suite de IA</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Projetada para times que buscam performance extrema e redução de custos operacionais.
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
              className="glass-card p-8 rounded-2xl group transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-white/5 rounded-lg flex items-center justify-center text-neon-400 mb-6 group-hover:bg-neon-500 group-hover:text-black transition-colors duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;