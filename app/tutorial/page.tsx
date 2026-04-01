'use client'

import { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Header } from '../pokemon/components/Header'

import { useFavorites } from '@/hooks/pokemon/useFavorites'

type SecretAbilityType = 'buff' | 'debuff' | 'reveal' | 'neutral'

interface SecretAbility {
  id: string
  color: string
  colorClass: string
  icon: string
  revealed: boolean
  type: SecretAbilityType
  name: string
  description: string
}

type TutorialStep = 'intro' | 'selection' | 'abilities' | 'battle' | 'strategy' | 'rewards'

export default function TutorialPage() {
  const router = useRouter()
  const { favorites, isLoaded } = useFavorites()
  
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>('intro')
  const [secretAbilities, setSecretAbilities] = useState<SecretAbility[]>([
    { 
      id: 'A', 
      color: 'purple', 
      colorClass: 'bg-purple-500', 
      icon: '🟪', 
      revealed: false,
      type: 'buff',
      name: 'Fúria Interior',
      description: 'Aumenta +20 no ataque do Pokémon'
    },
    { 
      id: 'B', 
      color: 'blue', 
      colorClass: 'bg-blue-500', 
      icon: '🟦', 
      revealed: false,
      type: 'debuff',
      name: 'Maldição do Vazio',
      description: 'Reduz -15 na defesa do seu Pokémon'
    },
    { 
      id: 'C', 
      color: 'red', 
      colorClass: 'bg-red-500', 
      icon: '🟥', 
      revealed: false,
      type: 'reveal',
      name: 'Visão do Futuro',
      description: 'Revela tipo e HP de um Pokémon inimigo'
    },
  ])
  const [revealedAbility, setRevealedAbility] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isLoaded) return

    if (favorites.length === 0) {

      return
    }
  }, [favorites, isLoaded])

  // Tutorial navigation
  const nextStep = useCallback(() => {
    const steps: TutorialStep[] = ['intro', 'selection', 'abilities', 'battle', 'strategy', 'rewards']
    const currentIndex = steps.indexOf(tutorialStep)

    if (currentIndex < steps.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setTutorialStep(steps[currentIndex + 1])
        setIsAnimating(false)
      }, 300)
    }
  }, [tutorialStep])

  const prevStep = useCallback(() => {
    const steps: TutorialStep[] = ['intro', 'selection', 'abilities', 'battle', 'strategy', 'rewards']
    const currentIndex = steps.indexOf(tutorialStep)

    if (currentIndex > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setTutorialStep(steps[currentIndex - 1])
        setIsAnimating(false)
      }, 300)
    }
  }, [tutorialStep])

  const revealAbility = useCallback((abilityId: string) => {
    setRevealedAbility(abilityId)
    setSecretAbilities(prev => prev.map(a => 
      a.id === abilityId ? { ...a, revealed: true } : a
    ))
  }, [])

  const resetAbilities = useCallback(() => {
    setRevealedAbility(null)
    setSecretAbilities(prev => prev.map(a => ({ ...a, revealed: false })))
  }, [])

  // Tutorial content components
  const renderTutorialContent = () => {
    const containerClass = `transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`

    switch (tutorialStep) {
      case 'intro':
        return (
          <div className={containerClass}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-lg animate-pulse">
                <span className="text-4xl">⚔️</span>
              </div>
              <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mb-4">
                Bem-vindo à Arena Secreta
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
                Prepare-se para uma experiência de combate única onde 
                estratégia, risco e surpresa se encontram. 
                Use seus Pokémon favoritos contra times misteriosos da máquina!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-linear-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center hover:scale-105 transition-transform">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-bold text-zinc-800 dark:text-white mb-2">Escolha Estratégica</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Selecione 3 Pokémon dos seus favoritos para formar seu time</p>
              </div>
              <div className="bg-linear-to-br from-purple-500/10 to-purple-600/5 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200 dark:border-purple-800 rounded-xl p-6 text-center hover:scale-105 transition-transform">
                <div className="text-3xl mb-3">🎲</div>
                <h3 className="font-bold text-zinc-800 dark:text-white mb-2">Habilidades Secretas</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Use habilidades misteriosas que podem ser buffs, debuffs ou revelações</p>
              </div>
              <div className="bg-linear-to-br from-red-500/10 to-red-600/5 dark:from-red-900/20 dark:to-red-800/10 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center hover:scale-105 transition-transform">
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="font-bold text-zinc-800 dark:text-white mb-2">Vitória ou Derrota</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Vença 2 de 3 batalhas para conquistar a arena</p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>💡 Dica:</strong> O elemento surpresa é crucial! 
                Você nunca sabe contra quem está 
                lutando até usar habilidades de revelação.
              </p>
            </div>
          </div>
        )

      case 'selection':
        return (
          <div className={containerClass}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2 flex items-center gap-2">
                <span>🧾</span> Seleção de Pokémon
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Escolha sabiamente seus 3 guerreiros. Analise 
                nome, tipo e stats básicos antes de decidir.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Seu Time (0/3)</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                  Modo: Escolha Manual
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[1, 2, 3].map((slot) => (
                  <div key={slot} className="aspect-square bg-zinc-100 dark:bg-zinc-700 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex flex-col items-center justify-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer group">
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">➕</span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">Slot {slot}</span>
                  </div>
                ))}
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-4 text-sm text-zinc-600 dark:text-zinc-400">
                <p className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <strong>HP:</strong> Pontos de vida do Pokémon
                </p>
                <p className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <strong>Ataque:</strong> Dano base nos ataques
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <strong>Defesa:</strong> Redução de dano recebido
                </p>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🤖</span>
                <div>
                  <h4 className="font-bold text-red-800 dark:text-red-200 mb-1">Time da Máquina (Mistério 🔥)</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    A máquina gera 3 Pokémon aleatórios, mas você não 
                    verá seus stats ou tipos inicialmente. 
                    Use habilidades de revelação para descobrir 
                    informações durante a batalha!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'abilities':
        return (
          <div className={containerClass}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2 flex items-center gap-2">
                <span>🃏</span> Sistema de Habilidades Secretas
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                O coração do jogo! Você recebe 3 
                habilidades misterias. Não sabe o que fazem até arriscar...
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {secretAbilities.map((ability) => (
                <div 
                  key={ability.id}
                  onClick={() => revealAbility(ability.id)}
                  className={`relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-500 hover:scale-105 ${
                    ability.revealed 
                      ? 'border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-800' 
                      : `${ability.colorClass} border-transparent opacity-90 hover:opacity-100`
                  }`}
                >
                  <div className="p-6 text-center">
                    {!ability.revealed ? (
                      <>
                        <div className="text-4xl mb-3 animate-bounce">{ability.icon}</div>
                        <h3 className="font-bold text-white text-lg mb-1">Habilidade {ability.id}</h3>
                        <p className="text-white/80 text-sm">Clique para revelar</p>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl mb-2">
                          {ability.type === 'buff' && '⬆️'}
                          {ability.type === 'debuff' && '⬇️'}
                          {ability.type === 'reveal' && '🔍'}
                          {ability.type === 'neutral' && '❌'}
                        </div>
                        <h3 className="font-bold text-zinc-800 dark:text-white mb-1">{ability.name}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                          ability.type === 'buff' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          ability.type === 'debuff' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                          ability.type === 'reveal' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                          'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                        }`}>
                          {ability.type === 'buff' && 'Buff'}
                          {ability.type === 'debuff' && 'Debuff'}
                          {ability.type === 'reveal' && 'Reveal'}
                          {ability.type === 'neutral' && 'Neutro'}
                        </span>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{ability.description}</p>
                      </>
                    )}
                  </div>
                  {!ability.revealed && (
                    <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-6 mb-4">
              <h3 className="font-bold text-zinc-800 dark:text-white mb-4 flex items-center gap-2">
                <span>📋</span> Tipos de Efeitos (Embaralhados a cada rodada!)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-700 p-3 rounded-lg">
                  <span className="text-2xl">⬆️</span>
                  <div>
                    <p className="font-medium text-sm text-zinc-800 dark:text-white">Buff</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">+Ataque/Defesa</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-700 p-3 rounded-lg">
                  <span className="text-2xl">⬇️</span>
                  <div>
                    <p className="font-medium text-sm text-zinc-800 dark:text-white">Debuff</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">-Atributos 😈</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-700 p-3 rounded-lg">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <p className="font-medium text-sm text-zinc-800 dark:text-white">Reveal</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Mostra inimigo</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-700 p-3 rounded-lg">
                  <span className="text-2xl">❌</span>
                  <div>
                    <p className="font-medium text-sm text-zinc-800 dark:text-white">Neutro</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Sem efeito</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200">
                  <strong>👉 Regra:</strong> Use apenas 1 habilidade 
                  por confronto. Escolha sabiamente!
                </p>
              </div>
              <div className="flex-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200">
                  <strong>🧠 Estratégia:</strong> Pode optar por não usar 
                  habilidade e jogar seguro.
                </p>
              </div>
            </div>

            {revealedAbility && (
              <button 
                onClick={resetAbilities}
                className="mt-4 w-full py-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              >
                🔄 Resetar Demonstração
              </button>
            )}
          </div>
        )

      case 'battle':
        return (
          <div className={containerClass}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2 flex items-center gap-2">
                <span>⚔️</span> Sistema de Batalha
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                3 rounds de confronto direto. 
                Escolha qual Pokémon usar em cada rodada!
              </p>
            </div>

            <div className="bg-linear-to-r from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl p-6 mb-6 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-2xl mb-2 shadow-lg">
                    🧑‍🎤
                  </div>
                  <p className="text-sm font-bold text-zinc-800 dark:text-white">Você</p>
                  <p className="text-xs text-zinc-500">Escolhe o Pokémon</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-zinc-400">VS</span>
                  <div className="flex gap-1 mt-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75"></span>
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150"></span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-2xl mb-2 shadow-lg">
                    🤖
                  </div>
                  <p className="text-sm font-bold text-zinc-800 dark:text-white">Máquina</p>
                  <p className="text-xs text-zinc-500">Aleatório</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {[1, 2, 3].map((round) => (
                  <div key={round} className="bg-white dark:bg-zinc-800 rounded-lg p-4 border-2 border-zinc-200 dark:border-zinc-600 text-center">
                    <div className="text-xs font-bold text-zinc-400 mb-2">ROUND {round}</div>
                    <div className="flex justify-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
                      <span className="text-zinc-400">⚔️</span>
                      <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full border-2 border-dashed border-zinc-400"></div>
                    </div>
                    <p className="text-xs text-zinc-500">1 vs 1</p>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-center">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  🎯 Melhor de 3: Quem vencer 2 rounds primeiro, ganha a batalha!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700">
                <h3 className="font-bold text-zinc-800 dark:text-white mb-3 flex items-center gap-2">
                  <span>🧮</span> Fórmula de Dano
                </h3>
                <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 font-mono text-sm text-center mb-3">
                  <span className="text-blue-600 dark:text-blue-400">poderFinal</span> = {' '}
                  <span className="text-green-600 dark:text-green-400">ataque</span> + {' '}
                  <span className="text-purple-600 dark:text-purple-400">bônus</span> - {' '}
                  <span className="text-red-600 dark:text-red-400">penalidade</span>
                </div>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Ataque vs Defesa do oponente
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    Vantagem/Desvantagem de tipo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Efeito da habilidade usada
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700">
                <h3 className="font-bold text-zinc-800 dark:text-white mb-3 flex items-center gap-2">
                  <span>👁️</span> Sistema de Revelação
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    <span className="text-xl">🔍</span>
                    <div>
                      <p className="font-medium text-sm text-zinc-800 dark:text-white">Reveal Parcial</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Mostra TIPO ou STATS, nunca ambos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    <span className="text-xl">🎲</span>
                    <div>
                      <p className="font-medium text-sm text-zinc-800 dark:text-white">Escolha Dinâmica</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Adapte estratégia com informações parciais</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'strategy':
        return (
          <div className={containerClass}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2 flex items-center gap-2">
                <span>🧠</span> Elemento Estratégico
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                A verdadeira profundidade está nas 
                decisões difíceis sob incerteza.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-linear-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5">
                <h3 className="font-bold text-indigo-800 dark:text-indigo-200 mb-3 flex items-center gap-2">
                  <span>🔁</span> Sistema de Escolha Dinâmica
                </h3>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">
                  Você escolhe qual Pokémon usar em 
                  CADA rodada. Não é sequencial fixo!
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/50 dark:bg-zinc-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Round 1</p>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">Pikachu</p>
                  </div>
                  <div className="bg-white/50 dark:bg-zinc-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Round 2</p>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">Charizard</p>
                  </div>
                  <div className="bg-white/50 dark:bg-zinc-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Round 3</p>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">Blastoise</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-5">
                  <h3 className="font-bold text-orange-800 dark:text-orange-200 mb-3">⚠️ Gestão de Risco</h3>
                  <ul className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Usar habilidade cedo pode revelar vantagem</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Guardar para momento crucial é arriscado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Habilidades de buff em 
                        round errado = desperdício</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
                  <h3 className="font-bold text-green-800 dark:text-green-200 mb-3">✅ Dicas Pro</h3>
                  <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Revele primeiro, ataque depois</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Salve Pokémon forte para counter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Observe padrões da máquina (Modo Difícil)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-5">
              <h3 className="font-bold text-zinc-800 dark:text-white mb-4 text-center">🎮 Fluxo Decisão-Risco</h3>
              <div className="flex items-center justify-between text-xs md:text-sm">
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">1</div>
                  <p className="text-zinc-600 dark:text-zinc-400">Ver Inimigo<br/>(Oculto)</p>
                </div>
                <span className="text-zinc-400">→</span>
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">2</div>
                  <p className="text-zinc-600 dark:text-zinc-400">Escolher<br/>Habilidade?</p>
                </div>
                <span className="text-zinc-400">→</span>
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">3</div>
                  <p className="text-zinc-600 dark:text-zinc-400">Arriscar<br/>Reveal?</p>
                </div>
                <span className="text-zinc-400">→</span>
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">4</div>
                  <p className="text-zinc-600 dark:text-zinc-400">Escolher<br/>Pokémon</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'rewards':
        return (
          <div className={containerClass}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2 flex items-center gap-2">
                <span>🏆</span> Resultado & Progressão
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Recompensas por vitória e sistema 
                de evolução para jogadores dedicados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-linear-to-br from-yellow-400/20 to-orange-500/20 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl p-6">
                <div className="text-center mb-4">
                  <span className="text-4xl">🏆</span>
                  <h3 className="text-xl font-bold text-zinc-800 dark:text-white mt-2">Vitória!</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white/50 dark:bg-zinc-800/50 rounded-lg p-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">MVP da Batalha</span>
                    <span className="font-bold text-zinc-800 dark:text-white">Charizard ⭐</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/50 dark:bg-zinc-800/50 rounded-lg p-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Dano Total Causado</span>
                    <span className="font-bold text-zinc-800 dark:text-white">1,247 HP</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/50 dark:bg-zinc-800/50 rounded-lg p-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Habilidades Usadas</span>
                    <span className="font-bold text-zinc-800 dark:text-white">2/3 🃏</span>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-purple-400/20 to-pink-500/20 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-400 dark:border-purple-600 rounded-xl p-6">
                <div className="text-center mb-4">
                  <span className="text-4xl">💔</span>
                  <h3 className="text-xl font-bold text-zinc-800 dark:text-white mt-2">Derrota...</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white/50 dark:bg-zinc-800/50 rounded-lg p-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Rounds Vencidos</span>
                    <span className="font-bold text-zinc-800 dark:text-white">1/3</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/50 dark:bg-zinc-800/50 rounded-lg p-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">XP Ganho</span>
                    <span className="font-bold text-zinc-800 dark:text-white">+50 XP</span>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-center">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      💡 Tente novamente! Analise os tipos do oponente.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-zinc-800 dark:text-white mb-4 flex items-center gap-2">
                <span>🚀</span> Extras & Modo Difícil
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-zinc-700 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h4 className="font-bold text-sm text-zinc-800 dark:text-white mb-2">⭐ Progressão</h4>
                  <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                    <li>• XP para Pokémon vencedores</li>
                    <li>• Ranking global do jogador</li>
                    <li>• Conquistas desbloqueáveis</li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-zinc-700 rounded-lg p-4 border-l-4 border-green-400">
                  <h4 className="font-bold text-sm text-zinc-800 dark:text-white mb-2">🎁 Recompensas</h4>
                  <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                    <li>• Novos Pokémon favoritos</li>
                    <li>• Habilidades especiais raras</li>
                    <li>• Skins cosméticas</li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-zinc-700 rounded-lg p-4 border-l-4 border-red-400">
                  <h4 className="font-bold text-sm text-zinc-800 dark:text-white mb-2">👹 Modo Difícil</h4>
                  <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                    <li>• Máquina usa habilidades secretas</li>
                    <li>• IA adaptativa</li>
                    <li>• Recompensas maiores</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => router.push('/combate')}
                className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all"
              >
                🎮 Começar Batalha Agora
              </button>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3">
                Pronto para o desafio? Sua arena o aguarda!
              </p>
            </div>
          </div>
        )
    }
  }
    
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Header showSearch={false} />

      <main className="pt-4 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
              {[
                { id: 'intro', label: 'Intro', icon: '🎯' },
                { id: 'selection', label: 'Seleção', icon: '🧾' },
                { id: 'abilities', label: 'Habilidades', icon: '🃏' },
                { id: 'battle', label: 'Batalha', icon: '⚔️' },
                { id: 'strategy', label: 'Estratégia', icon: '🧠' },
                { id: 'rewards', label: 'Recompensas', icon: '🏆' }
              ].map((step, index) => {
                const isActive = tutorialStep === step.id
                const isPast = ['intro', 'selection', 'abilities', 'battle', 'strategy', 'rewards'].indexOf(tutorialStep) > 
                  ['intro', 'selection', 'abilities', 'battle', 'strategy', 'rewards'].indexOf(step.id as TutorialStep)
                
                return (
                  <div key={step.id} className="flex items-center shrink-0">
                    <button
                      onClick={() => setTutorialStep(step.id as TutorialStep)}
                      className={`flex flex-col items-center gap-1 transition-all ${
                        isActive 
                          ? 'scale-110' 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors ${
                        isActive 
                          ? 'bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
                          : isPast
                            ? 'bg-green-500 text-white'
                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {isPast ? '✓' : step.icon}
                      </div>
                      <span className={`text-xs font-medium ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-500'
                      }`}>
                        {step.label}
                      </span>
                    </button>
                    {index < 5 && (
                      <div className={`w-8 h-0.5 mx-2 ${
                        isPast ? 'bg-green-500' : 'bg-zinc-200 dark:bg-zinc-700'
                      }`}></div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="min-h-100">
              {renderTutorialContent()}
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={prevStep}
                disabled={tutorialStep === 'intro'}
                className={`
                  flex items-center gap-2 px-5 py-2.5 
                  rounded-full font-semibold transition-all
                  ${
                    tutorialStep === 'intro'
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                      : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:shadow-md hover:scale-105'
                  }
                `}
              >
                <span className="text-lg">←</span> Anterior
              </button>

              <div className="flex gap-2">
                <span className="text-sm text-zinc-400 dark:text-zinc-600">
                  {['intro', 'selection', 'abilities', 'battle', 'strategy', 'rewards'].indexOf(tutorialStep) + 1} / 6
                </span>
              </div>

              {tutorialStep !== 'rewards' && (
                <button
                  onClick={nextStep}
                  className="
                    flex items-center gap-2 px-6 py-2 
                    rounded-full font-medium transition-all
                    bg-yellow-400 text-black 
                    hover:bg-yellow-300 hover:scale-105 shadow-md
                  "
                >
                  Próximo <span>→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
