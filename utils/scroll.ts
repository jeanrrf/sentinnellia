/**
 * Realiza rolagem suave para um elemento específico com compensação de cabeçalho fixo.
 * @param id ID do elemento alvo
 * @param offset Compensação em pixels (padrão: 100px)
 */
export const smoothScrollTo = (id: string, offset: number = 100) => {
  // Se for link para home ou vazio, volta ao topo
  if (id === 'home' || id === '') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const element = document.getElementById(id);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};